<template>
    <app-dialog :key="keyCount"
                v-model="display"
                @input="$emit('input', $event)">
        <app-form :url="url"
                  :values="values"
                  :inline-success-message="false"
                  :inline-error-message="false"
                  submit-text="Отправить" class="pb-10"
                  pass-api-key
                  @success="successResult">
            <template v-slot:header>
                <div class="text-h5 mt-4">
                    Доработать резюме
                </div>
                <p class="text-small-2 mt-7 mb-7">
                    Опишите чего не хватает в резюме кандидата
                </p>
            </template>

            <template v-slot:fields="{ rules }">
                <v-textarea v-model="values.description"
                            :rules="[rules.required]"
                            placeholder="Комментарий"
                            auto-grow
                            rows="3"
                            outlined/>
            </template>

            <template v-slot:success>
                <div class="text-h5 mb-4">Резюме отправлено на доработку</div>

                <div class="text-body-2">
                    Вы получите уведомление,<br>
                    когда резюме обновится
                </div>
            </template>
        </app-form>
    </app-dialog>
</template>

<script>
    import AppForm        from '~/components/forms/AppForm';
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppFinalizeResumeDialog',
        components: { AppDialog, AppForm },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            resumeId: {
                type: Number,
                default: null,
            },
            url: {
                type: String,
                default: null,
            },
        },
        data: () => ( {
            values: {
                id: undefined,
                description: undefined,
            },
            keyCount: 0,
        } ),
        computed: {
            display: {
                get: vm => {
                    if ( vm.value ) {
                        vm.values.id = null;
                        vm.values.description = null;
                    }
                    vm.values.id = vm.resumeId;
                    return vm.value;
                },
                set( value ) {
                    if ( value ) return;

                    this.$emit( 'input', false );

                    setTimeout( () => {
                        this.keyCount += 1;
                    }, 200 );

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
