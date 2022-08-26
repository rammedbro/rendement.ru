<template>
    <v-list-item nuxt :to="link"
                 class="notification-list-item">
        <v-list-item-content>
            <div class="text-small-2 mb-2" v-html="value.text"></div>

            <div class="text-small-3 grey--text text--lighten-1">
                {{ datePublishingFormat }}
            </div>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
    import { formatLocaleDate } from '~/lib/classes/utility';

    export default {
        name: 'NotificationListItem',
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            link: vm => {
                const { subjectType, subjectId } = vm.value;

                if ( subjectType !== null ) {
                    return `/${ subjectType }/${ subjectId }/`;
                } else {
                    return null;
                }
            },
            datePublishingFormat: vm => formatLocaleDate( vm.value.datePublishing, 'date', {
                day: 'numeric', month: 'long', year: 'numeric',
            } ),
        },
    };
</script>

<style lang="scss" scoped>
    .notification-list-item {
        align-items: flex-start;
    }
</style>