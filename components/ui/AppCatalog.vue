<template>
    <div v-intersect="onComponentIntersect"
         class="l-catalog"
         :class="rootClassObject">
        <!-- Хэдер -->
        <slot name="header"
              v-bind="{ doFilter }">
        </slot>

        <!-- Тело -->
        <div v-if="isInvoke"
             ref="body"
             class="l-catalog__body"
             :class="bodyClass">
            <slot name="body"
                  v-bind="{ loading, items, count: dataCount, countFormat, page, pageCount, onPageChange }">
                <!-- Прогресс бар -->
                <v-overlay v-if="!scrollPagination || !dataCount"
                           v-show="loading"
                           absolute
                           opacity="0.3"
                           z-index="100"
                           color="white">
                    <v-progress-circular color="primary" indeterminate
                                         size="28" width="3"/>
                </v-overlay>

                <!-- Количество -->
                <slot v-if="!disableCount && dataCount > 0"
                      name="count"
                      v-bind="{ count: dataCount, countFormat }">
                    <div class="text-h6 mb-6">{{ countFormat }}</div>
                </slot>

                <!-- Верхняя пагинация -->
                <app-pagination v-if="!disablePagination && paginationOnTop"
                                :value="dataPage"
                                :page-count="pageCount"
                                :loading="loading"
                                :scroll="scrollPagination"
                                :path-encoding="paginationPathEncoding"
                                :class="{ 'mb-6': !scrollPagination }"
                                @input="onPageChange"/>

                <!-- Результаты -->
                <div v-if="dataCount > 0"
                     class="l-catalog__items">
                    <slot name="items" v-bind="{ count: dataCount, items }">
                        <v-row :dense="dense"
                               :class="{ 'flex-column-reverse': reverseScrollPagination }">
                            <v-col v-for="( item, index ) in items"
                                   :key="item[itemKeyProp] !== undefined ? item[itemKeyProp] : index"
                                   v-bind="itemColWidthFormat">
                                <slot name="item"
                                      v-bind="{ item, index, items, length: items.length, doFilter }">
                                    {{ item }}
                                </slot>
                            </v-col>
                        </v-row>
                    </slot>
                </div>

                <!-- Нижняя пагинация -->
                <app-pagination v-if="!disablePagination && paginationOnBottom"
                                :value="dataPage"
                                :page-count="pageCount"
                                :loading="loading"
                                :scroll="scrollPagination"
                                :path-encoding="paginationPathEncoding"
                                :class="{ 'mt-6': !scrollPagination }"
                                @input="onPageChange"/>

                <!-- Нет результатов -->
                <div v-if="!disableNoResult && dataCount === 0"
                     class="l-catalog__no-result">
                    <slot name="no-result">
                        {{ noResultMessage }}
                    </slot>
                </div>
            </slot>
        </div>

        <!-- Футер -->
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppPagination            from '~/components/ui/AppPagination';
    import { IntCatalogResponse }   from '~/lib/types/request';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { pickNumeralEnding }    from '~/lib/classes/utility';

    export default {
        name: 'AppCatalog',
        components: { AppPagination },
        props: {
            url: {
                type: String,
                required: true,
            },
            page: {
                type: Number,
                default: 1,
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
            count: {
                type: Number,
                default: null,
            },
            cache: {
                type: Object,
                default: () => ( {} ),
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
            invokeAfterReach: {
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
            itemTypeErrorOutput: {
                type: Boolean,
                default: false,
            },
            itemKeyProp: {
                type: String,
                default: 'id',
            },
            bodyClass: {
                type: [ String, Array ],
                default: null,
            },
            disableCount: {
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
            adaptive: {
                type: Boolean,
                default: false,
            },
            dense: {
                type: Boolean,
                default: false,
            },
            paginationPathEncoding: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            isInvoke: !vm.invokeAfterReach,
            loading: false,
            items: [],
            dataCount: vm.count,
            dataPage: vm.page,
            dataCache: vm.cache,
            bodyScrollPosition: 0,
        } ),
        computed: {
            rootClassObject: vm => ( {
                'l-catalog--adaptive': vm.adaptive,
                'l-catalog--loading': vm.loading,
            } ),
            pageCount: vm =>
                vm.limit > 0 ? Math.ceil( vm.dataCount / vm.limit ) : 0,
            countFormat: vm => {
                const count = ( vm.dataCount !== null ) ? vm.dataCount : 0;

                if ( vm.countEndings !== null ) {
                    return `${ count } ${ pickNumeralEnding( count, vm.countEndings ) }`;
                } else {
                    return count;
                }
            },
            itemColWidthFormat: vm =>
                ( vm.itemColWidth && typeof vm.itemColWidth === 'object' )
                    ? vm.itemColWidth : { 'cols': vm.itemColWidth },
        },
        created() {
            if ( this.disablePagination && !this.invokeAfterReach ) {
                this.onPageChange( 1 );
            }
        },
        mounted() {
            if ( this.scrollPagination && this.reverseScrollPagination ) {
                const { body } = this.$refs;

                this.bodyScrollPosition = body.scrollHeight;
                body.addEventListener( 'scroll', this.onBodyScroll );
            }
        },
        activated() {
            const { body } = this.$refs;
            body.scrollTop = this.bodyScrollPosition;
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            async onPageChange( page ) {
                const { body } = this.$refs;

                if ( !this.scrollPagination && body ) {
                    await this.scrollTo( body );
                }

                const cache = this.getDataFromCache( page );

                if ( !cache.length ) {
                    const items = await this.getDataFromApi( page );

                    if ( !items ) return;

                    if ( this.scrollPagination ) {
                        if ( this.reverseScrollPagination ) {
                            const { body } = this.$refs;

                            if ( !body ) return;

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

                    this.dataCache[this.dataPage] = items.concat();
                    this.updateCache( this.dataCache );
                } else {
                    this.items = cache;
                }
            },
            doFilter( isValuesChange ) {
                if ( isValuesChange ) {
                    this.updateCache( {} );
                    this.onPageChange( 1 );
                } else {
                    this.scrollTo( this.$refs.body );
                }
            },
            getDataFromCache( page ) {
                return this.dataCache[page] || [];
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
                    .then( response => {
                        const { page, count, items } = checkObjectInterface( response, IntCatalogResponse );
                        const { itemType, itemTypeErrorOutput } = this;

                        this.updateCount( count );
                        this.updatePage( page );

                        if ( itemType ) {
                            const result = [];

                            for ( const item of items ) {
                                try {
                                    result.push( checkObjectInterface( item, itemType ) );
                                } catch ( e ) {
                                    if ( itemTypeErrorOutput ) {
                                        throw e;
                                    } else {
                                        console.log( e.message );
                                    }
                                }
                            }

                            return result;
                        } else {
                            return items;
                        }
                    } )
                    .catch( e => {
                        this.showAppDialog( 'error' );
                        console.log( e.message );
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            updateCount( value ) {
                this.dataCount = value;
                this.$emit( 'update:count', value );
            },
            updatePage( value ) {
                this.dataPage = value;
                this.$emit( 'update:page', value );
            },
            updateCache( value ) {
                this.dataCache = value;
                this.$emit( 'update:cache', value );
            },
            onComponentIntersect( entries, observer, isIntersecting ) {
                if ( !this.invokeAfterReach || !isIntersecting ) return;
                this.isInvoke = true;

                if ( this.disablePagination ) {
                    this.onPageChange( 1 );
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
        },
    };
</script>

<style lang="scss" scoped>
    .l-catalog {
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
            .l-catalog__body {
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

            .l-catalog__body {
                overflow: auto;
            }
        }
    }
</style>
