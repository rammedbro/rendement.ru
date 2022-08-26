import { checkType } from '~/lib/classes/validation';

export const actions = {
    createChat( { commit, dispatch }, { type, arUserId } ) {
        return dispatch( 'api/apiPost', {
            url: '/api/createChat/',
            data: { type, arUserId },
            passApiKey: true,
        }, { root: true } )
            .then( chatId => {
                return checkType( chatId, String );
            } );
    },
};