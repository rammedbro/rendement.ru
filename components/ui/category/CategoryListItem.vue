<template>
    <v-list-item nuxt exact :to="link"
                 :ripple="mobile"
                 :class="{ 'l-border bwb-1': mobile }">
        <v-list-item-content>
            {{ value.name }}
        </v-list-item-content>

        <v-list-item-action v-if="mobile">
            <v-icon color="primary">mdi-chevron-right</v-icon>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
    import { encodeToUriParams } from '~/lib/classes/utility';

    export default {
        name: 'CategoryListItem',
        props: {
            value: {
                type: Object,
                required: true,
            },
            linkParams: {
                type: Object,
                required: true,
            },
            mobile: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            link: vm => ( vm.linkParams !== null ) ? encodeToUriParams( vm.linkParams ) : null,
        },
    };
</script>