import { ADMIN_USER_GROUP, LEGAL_PERSON }      from '~/lib/constants/user';
import { checkType, checkObjectInterface }     from '~/lib/classes/validation';
import { IntProfileDetail, IntProfilePreview } from '~/lib/types/profile';
import { IntPortfolio }                        from '~/lib/types/other';
import { IntUnseenChatMessageCount }           from '~/lib/types/chat';

export const state = () => ( {
    isFullInit: false,
    user: {
        id: undefined,
        name: undefined,
        lastName: undefined,
        isExecutor: undefined,
        avatar: undefined,
        email: undefined,
        phone: undefined,
        isOnline: undefined,
        viewCount: undefined,
        dateRegistration: undefined,
        dateLastVisit: undefined,
        userGroup: undefined,
        personTypeId: undefined,
        rating: undefined,
        sexId: undefined,
        birthDay: undefined,
        about: undefined,
        secondName: undefined,
        companyName: undefined,
        categories: undefined,
        location: undefined,
        locationRadius: undefined,
        emailNotification: undefined,
        phoneNotification: undefined,
        isCardBind: undefined,
        typeOfUserGroup: undefined,
    },
    portfolios: undefined,
    unseenMessages: undefined,
    balance: undefined,
} );

export const getters = {
    userIsLogin: state => state.user.id !== undefined,
    userId: state => state.user.id,
    userData: state => state.user,
    userIsLegalPerson: state => state.user.personTypeId === LEGAL_PERSON,
    userIsExecutor: state => state.user.isExecutor,
    userIsCardBind: state => state.user.isCardBind,
    userPortfolios: state => state.portfolios,
    userUnseenMessages: state => state.unseenMessages,
    userUnseenMessageCount: state =>
        ( state.unseenMessages || [] ).reduce( ( sum, item ) => sum + item.count, 0 ),
    userBalance: state => state.balance,
    userIsAdmin: ( state, getters ) =>
        getters.userIsLogin && state.user.userGroup.value === ADMIN_USER_GROUP,
    typeOfUserGroup: state => state.user.typeOfUserGroup,
};

export const mutations = {
    /**
     * @throws ValidationError
     */
    setUserPreview( state, payload ) {
        Object.assign( state.user, checkObjectInterface( payload, IntProfilePreview ) );
    },
    /**
     * @throws ValidationError
     */
    setUserDetail( state, payload ) {
        Object.assign( state.user, checkObjectInterface( payload, IntProfileDetail ) );
        state.isFullInit = true;
    },
    /**
     * @throws ValidationError
     */
    updateUser( state, payload ) {
        const user = Object.assign( {}, state.user, payload );
        const type = state.isFullInit ? IntProfileDetail : IntProfilePreview;

        Object.assign( state.user, checkObjectInterface( user, type ) );
    },
    /**
     * @throws ValidationError
     */
    setUserPortfolios( state, payload ) {
        state.portfolios = checkType( payload, Array, { arrayOf: IntPortfolio } );
    },
    /**
     * @throws ValidationError
     */
    addUserPortfolio( state, payload ) {
        state.portfolios.push( checkObjectInterface( payload, IntPortfolio ) );
    },
    /**
     * @throws ValidationError
     */
    editUserPortfolio( state, payload ) {
        const portfolio = checkObjectInterface( payload, IntPortfolio );
        const portfolioToUpdate = state.portfolios.find( item => item.id === portfolio.id );

        Object.assign( portfolioToUpdate, portfolio );
    },
    deleteUserPortfolio( state, payload ) {
        const portfolioToDeleteIndex = state.portfolios.findIndex( item => item.id === payload );
        state.portfolios.splice( portfolioToDeleteIndex, 1 );
    },
    /**
     * @throws ValidationError
     */
    setUserCardBind( state, payload ) {
        state.user.isCardBind = checkType( payload, Boolean );
    },
    /**
     * @throws ValidationError
     */
    setUserBalance( state, payload ) {
        state.balance = checkType( payload, Number );
    },
    /**
     * @throws ValidationError
     */
    setUserUnseenMessages( state, payload ) {
        state.unseenMessages = checkType( payload, Array, { arrayOf: IntUnseenChatMessageCount } );
    },
    setUserSeenMessages( state, payload ) {
        const seenChatIndex = state.unseenMessages.findIndex( item => item.chatId === payload );
        state.unseenMessages.splice( seenChatIndex, 1 );
    },
};

export const actions = {
    getUser( { commit, dispatch } ) {
        const appKey = process.env.appKey;
        const headers = { 'X-Api-Key': appKey };

        return dispatch( 'api/apiGet', { url: '/api/getUser/', headers }, { root: true } )
            .then( result => {
                if ( result === null ) return;

                const { apiKey, user } = result;

                commit( 'api/setApiKey', apiKey, { root: true } );
                commit( 'setUserPreview', user );
            } );
    },
    getUserFull( { state, commit, dispatch } ) {
        if ( state.isFullInit ) {
            return Promise.resolve();
        }

        return dispatch( 'api/apiGet', { url: '/api/getUserFull/', passApiKey: true }, { root: true } )
            .then( user => {
                commit( 'setUserDetail', user );
            } );
    },
    async logout( { commit, dispatch } ) {
        try {
            await dispatch( 'api/apiGet', { url: '/api/logout/' }, { root: true } );
            window.location.reload();
        } catch ( e ) {
            commit( 'ui/showAppDialog', 'error', { root: true } );
            console.log( e.message );
        }
    },
    getUserPortfolios( { state, commit, dispatch } ) {
        if ( state.portfolios !== undefined ) {
            return Promise.resolve();
        }

        return dispatch( 'api/apiGet', { url: '/api/getPortfolios/', passApiKey: true }, { root: true } )
            .then( portfolios => {
                commit( 'setUserPortfolios', portfolios );
            } );
    },
    getUserUnseenMessageCount( { state, commit, dispatch } ) {
        if ( state.unseenMessages !== undefined ) {
            return Promise.resolve();
        }

        return dispatch( 'api/apiGet', { url: '/api/getUnseenMessageCount/', passApiKey: true }, { root: true } )
            .then( unseenMessages => {
                commit( 'setUserUnseenMessages', unseenMessages );
            } )
            .catch( e => {
                commit( 'ui/showAppDialog', 'error', { root: true } );
                console.log( e.message );
            } );
    },
    setUserSeenMessages( { state, commit, dispatch }, chatId ) {
        return dispatch(
            'api/apiGet', { url: '/api/seenMessages/', data: { chatId }, passApiKey: true }, { root: true } )
            .then( () => {
                commit( 'setUserSeenMessages', chatId );
            } );
    },
    listenToNewMessage( { commit, dispatch } ) {
        return dispatch( 'api/apiSSE', {
            url: '/api/listenToNewMessage/',
            onMessageCallback: unseenMessages => {
                commit( 'setUserUnseenMessages', unseenMessages );
            },
        }, { root: true } )
            .catch( e => {
                commit( 'ui/showAppDialog', 'error', { root: true } );
                console.log( e.message );
            } );
    },
    getUserCardBind( { commit, dispatch } ) {
        return dispatch( 'api/apiGet', { url: '/api/checkCardBind/', passApiKey: true }, { root: true } )
            .then( result => {
                commit( 'setUserCardBind', result.isBind );
                return result;
            } );
    },
    getUserBalance( { state, commit, dispatch } ) {
        if ( state.balance !== undefined ) {
            return Promise.resolve;
        }

        return dispatch( 'api/apiGet', { url: '/api/getBalance/', passApiKey: true }, { root: true } )
            .then( balance => {
                commit( 'setUserBalance', balance );
            } );
    },
    setVacancyStatus( { commit, dispatch }, data ) {
        return dispatch( 'api/apiPost', { url: '/api/setVacancyStatus/', data, passApiKey: true, useLoading: true }, { root: true } )
            .catch( e => {
                commit( 'ui/showAppDialog', 'error', { root: true } );
                console.log( e.message );
            } );
    },
    setResumeStatus( { commit, dispatch }, data ) {
        return dispatch( 'api/apiPost', { url: '/api/setResumeStatus/', data, passApiKey: true, useLoading: true }, { root: true } )
            .catch( e => {
                commit( 'ui/showAppDialog', 'error', { root: true } );
                console.log( e.message );
            } );
    },
};
