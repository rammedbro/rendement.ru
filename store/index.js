export const actions = {
    async nuxtServerInit( { commit, dispatch } ) {
        try {
            await dispatch( 'user/getUser' );
        } catch ( e ) {
            commit( 'ui/showAppDialog', 'error' );
            console.log( e.message );
        }
    },
};