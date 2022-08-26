<template>
    <app-dialog v-model="display"
                @input="$emit('input', $event)">
        <app-form :key="keyCount"
                  :url="url"
                  :values="{ id: resumeId, statusId: actionStatus, ...values }"
                  :inline-success-message="false"
                  :inline-error-message="false"
                  submit-text="Отказать соискателю"
                  pass-api-key
                  @success="successResult">
            <template v-slot:header>
                <div class="text-h5 mt-4 mb-8">
                    Отказать соискателю
                </div>
            </template>
            <template v-slot:fields="{ rules }">

                <v-textarea v-model="values.description"
                            auto-grow
                            :rules="[ rules.required, customRules.length ]"
                            rows="3"
                            class="v-textarea--increased-margin"
                            outlined label="Причина отказа"/>
            </template>

            <template v-slot:success>
                <div class="text-h5 mb-4">Отказ на резюме успешно произведен!</div>
            </template>
        </app-form>
    </app-dialog>
</template>

<script>
    import AppDialog from '~/components/dialogs/AppDialog';
    import AppForm   from '~/components/forms/AppForm';
    export default {
        name: 'AppActionDescriptionDialog',
        components: { AppForm, AppDialog },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            resumeId: {
                type: Number,
                default: null,
            },
            actionStatus: {
                type: Number,
                default: null,
            },
            url: {
                type: String,
                default: null,
            },
        },
        data() {
            return {
                values: {
                    description: null,
                },
                customRules: {
                    length: v => !v || v.length >= 50 || 'Введите минимум 50 символов',
                },
                keyCount: 0,
            };
        },
        computed: {
            display: {
                get: vm => {
                    if ( vm.value ) {
                        vm.keyCount += 1;
                        vm.values.description = null;
                    }
                    return vm.value;
                },
                set( value ) {
                    if ( value ) return;
                    this.$emit( 'input', false );

                    return value;
                },
            },
        },
        methods: {
            successResult( resumeObject ) {
                this.$emit( 'success', resumeObject );
            },
        },
    };
</script>
