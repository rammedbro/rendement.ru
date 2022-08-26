<template>
    <app-catalog url="/api/getNotifications/"
                 :limit="10"
                 :item-type="$legacy.types.IntNotification"
                 pass-api-key
                 scroll-pagination
                 disable-count>
        <template v-slot:items="{ items }">
            <v-list>
                <notification-list-item v-for="item in items"
                                        :key="item.id"
                                        :value="item"
                                        class="l-border bwb-1"/>
            </v-list>
        </template>

        <template v-slot:no-result>
            <div class="pa-4">Новых уведомлений нет</div>
        </template>
    </app-catalog>
</template>

<script>
    import { mapGetters } from 'vuex';

    import AppCatalog           from '~/components/ui/AppCatalog';
    import NotificationListItem from '~/components/ui/notification/NotificationListItem';

    export default {
        name: 'NotificationMenu',
        components: { NotificationListItem, AppCatalog },
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
        },
    };
</script>