<template>
    <div v-show="pageCount > 1"
         class="l-pagination">
        <!-- Скролл -->
        <div v-if="scroll"
             v-show="loading || dataPage < pageCount"
             v-intersect="onIntersect"
             class="l-pagination-scroll">
            <v-progress-circular color="primary" indeterminate
                                 size="28" width="3"/>
        </div>

        <!-- Обычная -->
        <v-pagination v-else
                      :value="dataPage"
                      :length="pageCount"
                      :total-visible="6"
                      circle
                      @input="onInput"/>
    </div>
</template>

<script>
    export default {
        name: 'AppPagination',
        props: {
            value: {
                type: Number,
                default: 1,
            },
            pageCount: {
                type: Number,
                default: 0,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            scroll: {
                type: Boolean,
                default: false,
            },
            pathEncoding: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            dataPage: undefined,
        } ),
        watch: {
            value( value ) {
                if ( value === this.dataPage ) return;
                this.onInput( value );
            },
            $route() {
                if ( this.pathEncoding ) {
                    this.decodePath();
                }
            },
        },
        created() {
            if ( this.pathEncoding ) {
                this.decodePath();
            } else {
                this.onInput( this.value );
            }
        },
        methods: {
            updatePage( value ) {
                this.dataPage = value;
                this.$emit( 'input', value );
            },
            onInput( value ) {
                if ( this.pathEncoding ) {
                    this.encodePath( value );
                } else {
                    this.updatePage( value );
                }
            },
            onIntersect( entries, observer, isIntersecting ) {
                if ( !this.scroll || !isIntersecting || this.loading ) return;
                this.onInput( this.dataPage + 1 );
            },
            encodePath( page ) {
                const { path } = this.$route;
                const query = Object.assign( {}, this.$route.query );

                if ( page > 1 ) {
                    query.page = page;
                } else {
                    delete query.page;
                }

                this.$router.push( { path, query } );
            },
            decodePath() {
                const { query } = this.$route;
                const page = +query.page || 1;

                if ( page !== this.dataPage ) {
                    this.updatePage( page );
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-pagination {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .l-pagination-scroll {
        padding: 16px;
    }
</style>