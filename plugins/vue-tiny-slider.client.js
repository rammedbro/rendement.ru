import Vue         from 'vue';
import vTinySlider from 'vue-tiny-slider';
import 'tiny-slider/src/tiny-slider.scss';

const VueTinySlider = {
    install( Vue ) {
        Vue.component( 'VueTinySlider', vTinySlider );
    },
};
Vue.use( VueTinySlider );