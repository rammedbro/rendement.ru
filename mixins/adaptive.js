export const adaptive = {
    data: () => ( {
        isMounted: false,
    } ),
    computed: {
        isDesktop: vm => vm.isMounted && vm.$vuetify.breakpoint.lgAndUp,
        isMobile: vm => vm.isMounted && vm.$vuetify.breakpoint.mdAndDown,
    },
    mounted() {
        this.isMounted = true;
    },
};