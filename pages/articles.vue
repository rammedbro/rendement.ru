<template>
    <!-- Каталог -->
    <l-catalog-template-default :title="h1"
                                :props="catalog"/>
</template>

<script>
    import { meta } from '~/mixins/meta';

    import LCatalogTemplateDefault  from '~/components/core/catalog/templates/LCatalogTemplateDefault';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntCatalog }           from '~/lib/types/catalog';
    import { IntMetaData }          from '~/lib/types/other';

    export default {
        components: { LCatalogTemplateDefault },
        mixins: [ meta ],
        data: vm => ( {
            title: 'Полезные статьи',
            catalog: undefined,
        } ),
        async asyncData( { store, route, error } ) {
            try {
                const { path, query } = route;
                const catalogParams = {
                    meta: false,
                    breadcrumbs: true,
                    menu: true,
                    sections: null,
                    elements: {
                        limit: 25,
                        includeSubsections: true,
                        paginationPathKey: 'page',
                    },
                };

                const result = await store.dispatch( 'api/apiPost', {
                    url: '/api/getCatalog/',
                    data: {
                        path,
                        ...catalogParams,
                        elements: {
                            ...catalogParams.elements,
                            page: +query[catalogParams.elements.paginationPathKey] || 1,
                        },
                    },
                } );
                const meta = await store.dispatch( 'api/apiGet', {
                    url: '/api/getSeo/', data: { path },
                } );

                return {
                    catalog: {
                        ...catalogParams,
                        content: checkObjectInterface( result, IntCatalog ),
                        disableSections: true,
                    },
                    meta: checkObjectInterface( meta, IntMetaData ),
                };
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
    };
</script>
