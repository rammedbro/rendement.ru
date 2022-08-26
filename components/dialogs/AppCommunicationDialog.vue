<template>
    <app-dialog v-model="display"
                content-class="pt-8 pb-14"
                :max-width="450"
                @input="$emit('input', $event)">
        <p class="text-h5">
            Связь с кандидатом
        </p>

        <p class="text-body-2 text-center mt-8 mb-12">
            Перед тем как установить контакт убедитесь, что <br>
            резюме кандидата соответствует вашим <br>
            требованиям
        </p>
        <div class="text-small-2 d-flex pt-3 pb-3 justify-space-between">
            <p class="font-weight-bold mb-0">Телефон:</p>
            <p class="mb-0">{{ phone ? $legacy.formatPhone( phone ) : phone }}</p>
        </div>
        <v-divider/>

        <div class="text-small-2 d-flex pt-3 pb-3 justify-space-between">
            <p class="font-weight-bold mb-0">Почта:</p>
            <p class="mb-0">{{ email }}</p>
        </div>
        <v-divider/>
    </app-dialog>
</template>

<script>
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppCommunicationDialog',
        components: { AppDialog },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                default: '',
            },
            email: {
                type: String,
                default: '',
            },
        },
        computed: {
            display: {
                get: vm => vm.value,
                set( value ) {
                    if ( value ) return;
                    this.$emit( 'input', false );

                    return value;
                },
            },
        },
    };
</script>
