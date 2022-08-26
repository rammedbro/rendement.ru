<template>
    <div class="l-filter"
         :class="{ 'filter--adaptive': adaptive }">
        <!-- Фильтр: Десктоп -->
        <app-form v-if="!adaptive || isDesktop"
                  ref="form"
                  :url="url"
                  method="POST"
                  :values="formValues"
                  class="l-filter__form"
                  @success="onSuccess">
            <template v-slot:body="{ clear, loading }">
                <slot name="body"
                      v-bind="{ loading, clear, count, countFormat, apply, isFilterEmpty, onValuesChange}"></slot>
            </template>
        </app-form>

        <!-- Фильтр: Мобильный -->
        <template v-if="adaptive && isMobile">
            <v-btn color="primary" outlined block
                   @click="mobileDialog = true">
                {{ mobileFilterBtnFormat }}
            </v-btn>

            <app-fullscreen-dialog v-model="mobileDialog"
                                   title="Фильтр">
                <v-container class="container--dense h-100">
                    <app-form ref="form"
                              :url="url"
                              method="POST"
                              :values="formValues"
                              class="l-filter__form"
                              @success="onSuccess">
                        <template v-slot:body="{ clear, loading }">
                            <slot name="body"
                                  v-bind="{ loading, clear, count, countFormat, apply, appliedValuesCount, onValuesChange, isFilterEmpty }"></slot>
                        </template>
                    </app-form>
                </v-container>
            </app-fullscreen-dialog>
        </template>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    import AppFullscreenDialog   from '~/components/dialogs/AppFullscreenDialog';
    import AppForm               from '~/components/forms/AppForm';
    import { pickNumeralEnding } from '~/lib/classes/utility';
    import {
        checkNotEmpty,
        checkType,
    }                            from '~/lib/classes/validation';

    export default {
        name: 'AppFilter',
        components: { AppForm, AppFullscreenDialog },
        props: {
            value: {
                type: Object,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            pathEncoding: {
                type: Boolean,
                default: false,
            },
            encodingDescription: {
                type: Array,
                default: () => [],
            },
            ajax: {
                type: Boolean,
                default: false,
            },
            countEndings: {
                type: Array,
                default: () => [],
            },
            adaptive: {
                type: Boolean,
                default: true,
            },
        },
        data: () => ( {
            timeout: null,
            applied: {},
            lastApplied: {},
            lastPathParams: '',
            count: null,
            mobileDialog: false,
        } ),
        computed: {
            appliedValuesCount: vm => Object.keys( vm.applied ).length,
            isFilterEmpty: vm => !vm.appliedValuesCount,
            mobileFilterBtnFormat: vm =>
                'Фильтр' + ( !vm.isFilterEmpty ? `: Выбрано: ${ vm.appliedValuesCount }` : '' ),
            countFormat:
                vm => ( vm.count !== null )
                    ? `${ vm.count } ${ pickNumeralEnding( vm.count, vm.countEndings ) }` : '',
            formValues: vm => ( {
                preRequest: true,
                filter: vm.applied,
            } ),
        },
        watch: {
            $route() {
                if ( this.pathEncoding ) {
                    const { pathMatch } = this.$route.params;
                    if ( pathMatch === this.lastPathParams ) return;

                    this.decodePath();
                    this.$nextTick( () => {
                        this.apply();
                    } );
                }
            },
        },
        created() {
            if ( this.pathEncoding ) {
                this.decodePath();
            } else {
                this.getAppliedValues();
            }

            this.$emit( 'update:applied', this.applied );
            this.lastApplied = Object.assign( {}, this.applied );
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onValuesChange() {
                clearTimeout( this.timeout );

                this.timeout = setTimeout( () => {
                    this.getAppliedValues();

                    this.$nextTick( () => {
                        this.ajax ? this.apply() : this.submit();
                    } );
                }, 500 );
            },
            submit() {
                try {
                    this.$refs.form.submit();
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
            onSuccess( response ) {
                try {
                    const { count } = response;
                    this.count = checkType( count, Number );
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
            apply() {
                const isFilterChange = this.checkAppliedValuesChange();

                if ( isFilterChange ) {
                    if ( this.pathEncoding ) {
                        this.encodePath();
                    }

                    this.$emit( 'update:applied', this.applied );
                    this.lastApplied = Object.assign( {}, this.applied );

                    this.$nextTick( () => {
                        this.$emit( 'apply', isFilterChange );
                    } );
                } else {
                    this.$emit( 'apply', isFilterChange );
                }

                this.count = null;
                this.mobileDialog = false;
            },
            checkAppliedValuesChange() {
                const applied = Object.entries( this.applied );
                const lastApplied = Object.keys( this.lastApplied );

                if ( applied.length !== lastApplied.length ) {
                    return true;
                }

                for ( const [ key, value ] of applied ) {
                    if ( this.lastApplied[key] !== value ) return true;
                }

                return false;
            },
            getAppliedValues() {
                this.applied = {};

                for ( const [ key, value ] of Object.entries( this.value ) ) {
                    if ( checkNotEmpty( value, { lengthCheck: true } ) ) {
                        this.applied[key] = value;
                    }
                }
            },
            encodePath() {
                const { matched, query } = this.$route;
                const rootPath = `${ matched[0].path }/`;
                let params = '';

                for ( const desc of this.encodingDescription ) {
                    const { code, name, ignore } = desc;
                    const value = this.applied[name] || this.applied[code];

                    if ( !checkNotEmpty( value, { lengthCheck: true } ) || ignore ) continue;

                    params += `${ name }-is-${ value.toString() }/`;
                }

                this.lastPathParams = params;
                this.$router.push( { path: rootPath + params, query } );
            },
            decodePath() {
                const match = this.$route.params.pathMatch;

                if ( !match ) return;

                const values = {};
                const params = {};
                this.applied = {};

                match.split( '/' ).forEach( item => {
                    const [ key, value ] = item.split( '-is-' );
                    params[key] = value;
                } );

                for ( const desc of this.encodingDescription ) {
                    const { code, name, type: Type, arrayOf: ArrayItemType, ignore } = desc;
                    const value = params[name] || params[code];

                    if ( value && !ignore ) {
                        switch ( Type ) {
                            case Array:
                                this.applied[code] = value.split( ',' ).map(
                                    item => new ArrayItemType( item ).valueOf(),
                                );

                                break;
                            case Boolean:
                                if ( value === 'true' ) {
                                    this.applied[code] = true;
                                }

                                break;
                            default:
                                this.applied[code] = new Type( value ).valueOf();
                        }
                    } else {
                        values[code] = ( Type === Array ) ? [] : undefined;
                    }
                }

                this.$emit( 'input', Object.assign( values, this.applied ) );
            },
        },
    };
</script>
