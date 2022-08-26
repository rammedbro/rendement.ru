<template>
    <div class="l-catalog-menu">
        <l-multi-page-list url="/api/getCatalogMenu/"
                           :value="content"
                           :limit="0"
                           :filter="{ infoBlockId }"
                           :item-type="itemType"
                           disable-count>
            <template v-slot:items="{ items }">
                <slot name="items" v-bind="{ sectionId, items }">
                    <l-multi-level-menu :value="sectionId"
                                        :items="items"/>
                </slot>
            </template>
        </l-multi-page-list>
    </div>
</template>

<script>
    import LMultiPageList            from '~/components/core/LMultiPageList';
    import LMultiLevelMenu           from '~/components/core/LMultiLevelMenu';
    import { IntMultiLevelMenuItem } from '~/lib/types/catalog';

    export default {
        name: 'LCatalogMenu',
        components: { LMultiLevelMenu, LMultiPageList },
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
            itemType: {
                type: Object,
                default: () => IntMultiLevelMenuItem,
            },
        },
    };
</script>