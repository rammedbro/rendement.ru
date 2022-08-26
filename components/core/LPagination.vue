<template>
    <div v-show="count > 1"
         class="l-pagination">
        <!-- Скролл -->
        <div v-if="scroll"
             v-show="loading || value < count"
             v-intersect="onIntersect"
             class="l-pagination-scroll">
            <v-progress-circular color="primary" indeterminate
                                 size="28" width="3"/>
        </div>

        <!-- Обычная -->
        <v-pagination v-else
                      :value="value"
                      :length="count"
                      :total-visible="visibleCount"
                      circle
                      @input="onInput"/>
    </div>
</template>

<script>
    export default {
        name: 'LPagination',
        props: {
            value: {
                type: Number,
                default: 1,
            },
            count: {
                type: Number,
                default: 1,
            },
            visibleCount: {
                type: Number,
                default: 10,
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
            pathKey: {
                type: String,
                default: 'page',
            },
        },
        watch: {
            value( value ) {
                if ( this.pathEncoding ) {
                    this.encodePath( value );
                }
            },
        },
        methods: {
            onInput( value ) {
                if ( this.pathEncoding ) {
                    this.encodePath( value );
                } else {
                    this.$emit( 'input', value );
                }
            },
            onIntersect( entries, observer, isIntersecting ) {
                if ( !this.scroll || !isIntersecting || this.loading ) return;
                this.onInput( this.value + 1 );
            },
            encodePath( page ) {
                const { path } = this.$route;
                const query = Object.assign( {}, this.$route.query );

                query[this.pathKey] = page > 1 ? page : undefined;

                return this.$router.push( { path, query } );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .l-pagination-scroll {
        margin: 0 auto;
        padding: 16px;
    }
</style>