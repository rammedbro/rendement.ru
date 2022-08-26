export default function( { store, redirect } ) {
    if ( !store.getters['user/userIsLogin'] ) {
        redirect( '/auth/' );
    }
}