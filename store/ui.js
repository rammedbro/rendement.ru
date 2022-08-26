export const state = () => ( {
    dialogs: {
        auth: false,
        registration: false,
        recruitingAgencyRegistration: false,
        forgotPassword: false,
        becomeExecutor: false,
        error: false,
        support: false,
        createClientVacancy: false,
    },
    drawers: {
        mainMenu: false,
        userMenu: false,
    },
    becomeExecutorShow: true,
} );

export const getters = {
    appAuthDialogDisplay: state => state.dialogs.auth,
    appRegistrationDialogDisplay: state => state.dialogs.registration,
    appRecruitingAgencyRegistrationDialogDisplay: state => state.dialogs.recruitingAgencyRegistration,
    appForgotPasswordDialogDisplay: state => state.dialogs.forgotPassword,
    appBecomeExecutorDialogDisplay: state => state.dialogs.becomeExecutor,
    appErrorDialogDisplay: state => state.dialogs.error,
    appMainMenuDrawerDisplay: state => state.drawers.mainMenu,
    appUserMenuDrawerDisplay: state => state.drawers.userMenu,
    appBecomeExecutorShow: state => state.becomeExecutorShow,
    appSupportDialogDisplay: state => state.dialogs.support,
    appCreateClientVacancyDialogDisplay: state => state.dialogs.createClientVacancy,
};

export const mutations = {
    showAppDialog( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( dialog => {
            state.dialogs[dialog] = true;
        } );
    },
    hideAppDialog( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( dialog => {
            state.dialogs[dialog] = false;
        } );
    },
    toggleAppDialog( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( dialog => {
            state.dialogs[dialog] = !state.dialogs[dialog];
        } );
    },
    showAppDrawer( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( drawer => {
            state.drawers[drawer] = true;
        } );
    },
    hideAppDrawer( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( drawer => {
            state.drawers[drawer] = false;
        } );
    },
    toggleAppDrawer( state, payload ) {
        payload = Array.isArray( payload ) ? payload : [ payload ];
        payload.forEach( drawer => {
            state.drawers[drawer] = !state.drawers[drawer];
        } );
    },
    getAppBecomeExecutor( state ) {
        const becomeExecutorShow = this.$cookies.get( 'becomeExecutorShow' );
        if ( typeof becomeExecutorShow !== 'boolean' ) return;

        state.becomeExecutorShow = becomeExecutorShow;
    },
    setAppBecomeExecutor( state, payload ) {
        state.becomeExecutorShow = payload;

        const options = { path: '/', maxAge: 60 * 60 * 24 * 365 };
        this.$cookies.set( 'becomeExecutorShow', state.becomeExecutorShow, options );
    },
};
