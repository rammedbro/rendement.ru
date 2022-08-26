import Vue          from 'vue';
import constants    from '~/lib/constants';
import types        from '~/lib/types';
import utility      from '~/lib/classes/utility';
import validation   from '~/lib/classes/validation';
import { adaptive } from '~/mixins/adaptive';

Vue.prototype.$legacy = {
    constants,
    types,
    ...utility,
    ...validation,
};

Vue.mixin( adaptive );