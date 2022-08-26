<template>
    <div class="l-catalog-sections">
        <l-multi-page-list url="/api/getCatalogSections/"
                           :value="content"
                           :limit="limit"
                           :filter="{ infoBlockId, sectionId }"
                           :request-params="{ includeSubsections }"
                           :pagination-path-key="paginationPathKey"
                           :item-type="itemType"
                           pagination-path-encoding
                           disable-count>
            <template v-slot:items="data">
                <slot name="items" v-bind="data"></slot>
            </template>

            <template v-slot:item="data">
                <slot name="item" v-bind="data"></slot>
            </template>
        </l-multi-page-list>
    </div>
</template>

<script>
    import LMultiPageList               from '~/components/core/LMultiPageList';
    import { IntCatalogSectionPreview } from '~/lib/types/catalog';

    export default {
        name: 'LCatalogSections',
        components: { LMultiPageList },
        props: {
            infoBlockId: {
                type: Number,
                required: true,
            },
            sectionId: {
                type: Number,
                default: null,
            },
            content: {
                type: Object,
                default: undefined,
            },
            limit: {
                type: Number,
                default: 25,
            },
            includeSubsections: {
                type: Boolean,
                default: false,
            },
            paginationPathKey: {
                type: String,
                default: 's-page',
            },
            itemType: {
                type: Object,
                default: () => IntCatalogSectionPreview,
            },
        },
    };
</script>