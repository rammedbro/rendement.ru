import { CLIENT_GROUP_USER }     from '~/lib/constants/user';

export default function( { store, redirect } ) {
    if ( store.getters['user/typeOfUserGroup'] === CLIENT_GROUP_USER ) {
        redirect( '/personal/vacancies' );
    }
}
