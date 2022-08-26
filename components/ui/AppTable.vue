<template>
    <app-catalog :url="url"
                 :limit="limit"
                 :filter="filter"
                 :item-type="itemType"
                 :item-type-error-output="itemTypeErrorOutput"
                 :disable-count="disableCount"
                 :disable-pagination="disablePagination"
                 :pass-api-key="passApiKey"
                 :requrest-params="requestParams"
                 :no-result-message="noResultMessage"
                 :invoke-after-reach="invokeAfterReach"
                 :count-endings="countEndings">
        <template v-slot:items="{ items }">
            <v-data-table :headers="headers"
                          :items="items"
                          disable-sort
                          hide-default-footer
                          mobile-breakpoint="0"
                          :items-per-page="5">
                <template v-slot:item="{ item }">
                    <slot name="item"
                          v-bind="{ item }">
                        <tr>
                            <td v-for="( header, index ) in headers" :key="index"
                                :class="`text-${ header.align || 'start' }`">
                                <slot :name="`item.${ header.value }`"
                                      v-bind="{ value: item[ header.value ], header, item }">
                                    {{ item[ header.value ] }}
                                </slot>
                            </td>
                        </tr>
                    </slot>
                </template>
            </v-data-table>
        </template>
    </app-catalog>
</template>

<script>
    import AppCatalog from '~/components/ui/AppCatalog';

    export default {
        name: 'AppTable',
        components: { AppCatalog },
        props: {
            headers: {
                type: Array,
                required: true,
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
            disableCount: {
                type: Boolean,
                default: false,
            },
            disablePagination: {
                type: Boolean,
                default: false,
            },
            countEndings: {
                type: Array,
                default: () => [],
            },
            invokeAfterReach: {
                type: Boolean,
                default: false,
            },
            noResultMessage: {
                type: String,
                default: undefined,
            },
            itemType: {
                type: [ Object, Array ],
                default: null,
            },
            itemTypeErrorOutput: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>