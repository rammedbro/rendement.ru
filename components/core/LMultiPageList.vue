<template>
    <div class="l-multi-page-list"
         :class="rootCssClasses">
        <!-- Тело -->
        <div ref="body"
             class="l-multi-page-list__body"
             :class="cssClasses.body">
            <slot name="body"
                  v-bind="{ loading, items, count, countFormat, page, pageCount, onPageChange }">
                <!-- Индикатор загрузки -->
                <v-overlay v-if="!scrollPagination || !count"
                           v-show="loading"
                           absolute
                           opacity="0.3"
                           z-index="1030"
                           color="white">
                    <v-progress-circular color="primary" indeterminate
                                         size="28" width="3"/>
                </v-overlay>

                <!-- Результаты -->
                <div class="l-multi-page-list__results"
                     :class="cssClasses.results">
                    <!-- Количество -->
                    <slot v-if="!disableCount && count > 0"
                          name="count" v-bind="{ count, countFormat }">
                        <div class="text-h6 mb-6">{{ countFormat }}</div>
                    </slot>

                    <!-- Элементы -->
                    <slot v-if="!disableItems && count > 0"
                          name="items" v-bind="{ count, items }">
                        <v-row :class="{ 'flex-column-reverse': reverseScrollPagination }">
                            <v-col v-for="( item, index ) in items"
                                   :key="item[itemKeyProp]"
                                   v-bind="itemColWidthFormat">
                                <slot name="item"
                                      v-bind="{ item, index, items, length: items.length }">
                                    {{ item }}
                                </slot>
                            </v-col>
                        </v-row>
                    </slot>

                    <!-- Нет результатов -->
                    <slot v-if="!disableNoResult && count === 0"
                          name="no-result">
                        {{ noResultMessage }}
                    </slot>
                </div>

                <!-- Пагинация -->
                <slot name="pagination"
                      v-bind="{ page, pageCount, loading, onPageChange }">
                    <l-pagination v-if="!disablePagination && paginationOnBottom"
                                  :value="page"
                                  :count="pageCount"
                                  :loading="loading"
                                  :scroll="scrollPagination"
                                  :path-encoding="paginationPathEncoding"
                                  :path-key="paginationPathKey"
                                  :class="cssClasses.pagination || { 'mt-6': !scrollPagination }"
                                  @input="onPageChange"/>
                </slot>
            </slot>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import LPagination              from '~/components/core/LPagination';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { pickNumeralEnding }    from '~/lib/classes/utility';
    import { IntMultiPageList }     from '~/lib/types/catalog';

    export default {
        name: 'LMultiPageList',
        components: { LPagination },
        props: {
            value: {
                type: Object,
                default: undefined,
            },
            url: {
                type: String,
                required: true,
            },
            limit: {
                type: Number,
                default: 25,
            },
            filter: {
                type: Object,
                default: () => ( {} ),
            },
            requestParams: {
                type: Object,
                default: () => ( {} ),
            },
            passApiKey: {
                type: Boolean,
                default: false,
            },
            scrollPagination: {
                type: Boolean,
                default: false,
            },
            reverseScrollPagination: {
                type: Boolean,
                default: false,
            },
            countEndings: {
                type: Array,
                default: null,
            },
            itemColWidth: {
                type: [ Number, String, Object ],
                default: null,
            },
            paginationOnTop: {
                type: Boolean,
                default: false,
            },
            paginationOnBottom: {
                type: Boolean,
                default: true,
            },
            paginationPathEncoding: {
                type: Boolean,
                default: false,
            },
            paginationPathKey: {
                type: String,
                default: 'page',
            },
            adaptive: {
                type: Boolean,
                default: false,
            },
            noResultMessage: {
                type: String,
                default: 'Нет результатов',
            },
            itemType: {
                type: [ Object, Array ],
                default: null,
            },
            itemTypeErrorThrow: {
                type: Boolean,
                default: false,
            },
            itemKeyProp: {
                type: String,
                default: 'id',
            },
            cssClasses: {
                type: Object,
                default: () => ( {} ),
            },
            disableCount: {
                type: Boolean,
                default: false,
            },
            disableItems: {
                type: Boolean,
                default: false,
            },
            disablePagination: {
                type: Boolean,
                default: false,
            },
            disableNoResult: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            loading: false,
            bodyScrollPosition: 0,
            dataValue: undefined,
            page: undefined,
            count: undefined,
            items: undefined,
            cache: {},
        } ),
        computed: {
            rootCssClasses: vm => ( {
                'l-multi-page-list--adaptive': vm.adaptive,
                'l-multi-page-list--loading': vm.loading,
            } ),
            pageCount: vm =>
                vm.limit > 0 ? Math.ceil( ( vm.count || 0 ) / vm.limit ) : 0,
            countFormat: vm => {
                const count = vm.count || 0;
                return vm.countEndings ? `${ count } ${ pickNumeralEnding( count, vm.countEndings ) }` : count;
            },
            itemColWidthFormat: vm =>
                ( vm.itemColWidth && typeof vm.itemColWidth === 'object' )
                ? vm.itemColWidth
                : { 'cols': vm.itemColWidth },
        },
        watch: {
            value( value ) {
                if ( value === this.dataValue ) return;

                this.clearCache();
                this.handleValue( value );
            },
            $route( value, old ) {
                if ( this.paginationPathEncoding && value.path === old.path ) {
                    this.decodePath();
                }
            },
        },
        created() {
            if ( this.value ) {
                this.handleValue( this.value )
                    .then( () => {
                        if ( this.paginationPathEncoding ) {
                            this.decodePath();
                        }
                    } )
                    .catch( () => {
                        if ( this.paginationPathEncoding ) {
                            this.decodePath();
                        } else {
                            this.onPageChange( 1 );
                        }
                    } );
            } else if ( this.paginationPathEncoding ) {
                this.decodePath();
            } else {
                this.onPageChange( 1 );
            }
        },
        mounted() {
            if ( this.scrollPagination && this.reverseScrollPagination ) {
                this.listenBodyScroll();
            }
        },
        activated() {
            this.setBodyScroll();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            handleValue( value ) {
                try {
                    const result = this.validateValue( value );

                    this.setValue( result );
                    this.addCache( result );

                    return Promise.resolve( result );
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );

                    return Promise.reject( e );
                }
            },
            validateValue( value ) {
                const { itemType, itemTypeErrorThrow } = this;
                const { page, count } = checkObjectInterface( value, IntMultiPageList );
                const items = [];

                if ( itemType ) {
                    for ( const item of value.items ) {
                        try {
                            items.push( checkObjectInterface( item, itemType ) );
                        } catch ( e ) {
                            if ( itemTypeErrorThrow ) {
                                throw e;
                            } else {
                                console.log( e.message );
                            }
                        }
                    }
                } else {
                    items.push( ...value.items );
                }

                return { page, count, items };
            },
            setValue( value ) {
                const { page, count, items } = value;

                this.page = page;
                this.count = count;
                this.setItems( items );
            },
            updateValue( value ) {
                this.dataValue = value;
                this.$emit( 'input', value );
            },
            setItems( items ) {
                const { body } = this.$refs;

                if ( this.scrollPagination ) {
                    if ( this.reverseScrollPagination && body ) {
                        const beforeAddScrollHeight = body.scrollHeight;
                        const beforeAddScrollTop = body.scrollTop;

                        this.items.push( ...items );

                        this.$nextTick( () => {
                            const afterAddScrollHeight = body.scrollHeight;
                            body.scrollTop = beforeAddScrollTop + ( afterAddScrollHeight - beforeAddScrollHeight );
                        } );
                    } else {
                        this.items.push( ...items );
                    }
                } else {
                    this.items = items;
                }
            },
            addCache( value ) {
                this.cache[value.page] = value;
            },
            getCache( page ) {
                return this.cache[page];
            },
            clearCache() {
                this.cache = {};
            },
            async onPageChange( page = 1 ) {
                const { body } = this.$refs;

                if ( !this.scrollPagination && body ) {
                    await this.scrollTo( body );
                }

                const cache = this.getCache( page );

                if ( cache ) {
                    this.setValue( cache );
                } else {
                    this.getDataFromApi( page )
                        .then( this.handleValue )
                        .then( this.updateValue );
                }
            },
            getDataFromApi( page ) {
                const { url, limit, filter, passApiKey, requestParams } = this;

                this.loading = true;

                return this
                    .apiPost( {
                        url,
                        data: { page, limit, filter, preRequest: false, ...requestParams },
                        useLoading: false,
                        passApiKey,
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            doFilter() {
                this.clearCache();
                this.onPageChange( 1 );
            },
            decodePath() {
                const { query } = this.$route;
                const page = +query[this.paginationPathKey] || 1;

                if ( page !== this.page ) {
                    this.onPageChange( page );
                }
            },
            async scrollTo( target, payloadOptions = {} ) {
                const options = {
                    offset: 32,
                    container: document.documentElement,
                    ...payloadOptions,
                };

                if ( !options.container && this.$el ) {
                    const container = this.$el.closest( '.v-dialog' );

                    if ( container ) {
                        options.offset = -32;
                        options.container = container;
                    }
                }

                await this.$vuetify.goTo( target, options );
            },
            onBodyScroll( event ) {
                this.bodyScrollPosition = event.target.scrollTop;
            },
            listenBodyScroll() {
                const { body } = this.$refs;

                this.bodyScrollPosition = body.scrollHeight;
                body.addEventListener( 'scroll', this.onBodyScroll );
            },
            setBodyScroll() {
                const { body } = this.$refs;
                body.scrollTop = this.bodyScrollPosition;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-multi-page-list {
        display: flex;
        flex-direction: column;
        height: 100%;

        &__body {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: column;
            height: 100%;
        }

        &--loading {
            .l-multi-page-list__body {
                min-height: 56px;
            }
        }

        &--adaptive {
            position: absolute;
            z-index: 5;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            .l-multi-page-list__body {
                overflow: auto;
            }
        }
    }
</style>