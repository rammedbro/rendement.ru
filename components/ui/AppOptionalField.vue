<template>
    <component :is="component"
               class="l-option-field">
        <slot v-if="isNotEmpty"
              name="default"
              v-bind="{ value }">
            {{ value }}
        </slot>

        <slot v-else
              name="empty">
            <span class="grey--text lighten-4">{{ message }}</span>
        </slot>
    </component>
</template>

<script>
    import { checkNotEmpty } from '~/lib/classes/validation';

    export default {
        name: 'AppOptionalField',
        props: {
            value: {
                type: [ Number, String, Array, Object ],
                default: null,
            },
            message: {
                type: String,
                default: 'Информация отсутствует',
            },
            component: {
                type: [ String, Function ],
                default: 'div',
            },
        },
        computed: {
            isNotEmpty: vm => {
                if ( checkNotEmpty( vm.value ) ) {
                    return Array.isArray( vm.value ) ? !!vm.value.length : true;
                } else {
                    return false;
                }
            },
        },
    };
</script>