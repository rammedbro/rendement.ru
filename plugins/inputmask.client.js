import Vue                from 'vue';
import InputMask          from 'inputmask';

Vue.directive( 'mask', {
    name: 'mask',
    bind( el, binding ) {
        const input = ( el instanceof HTMLInputElement ) ? el : el.querySelector( 'input' );
        const mask = InputMask( binding.value ).mask( input );
        let unmaskedValue = '';

        input.addEventListener( 'input', () => {
            unmaskedValue = mask.unmaskedvalue();
        } );

        input.addEventListener( 'blur', e => {
            if ( !unmaskedValue ) return;
            input.value = unmaskedValue;
            input.dispatchEvent( new Event( 'input' ) );
        } );
    },
} );
