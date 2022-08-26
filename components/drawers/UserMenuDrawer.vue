<template>
    <app-drawer :value="appUserMenuDrawerDisplay"
                right
                @input="onInput">
        <user-menu with-arrow
                   @click:item="hideAppDrawer('userMenu')"/>
    </app-drawer>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppDrawer from '~/components/drawers/AppDrawer';
    import UserMenu  from '~/components/menus/UserMenu';

    export default {
        name: 'UserMenuDrawer',
        components: { UserMenu, AppDrawer },
        computed: {
            ...mapGetters( 'ui', [ 'appUserMenuDrawerDisplay' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDrawer', 'hideAppDrawer' ] ),
            onInput( value ) {
                value ? this.showAppDrawer( 'userMenu' ) : this.hideAppDrawer( 'userMenu' );
            },
        },
    };
</script>