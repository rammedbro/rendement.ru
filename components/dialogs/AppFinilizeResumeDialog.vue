<template>
    <app-dialog :key="keyCount" v-model="display">
        <app-form url="/api/finalizeResume/"
                  :values="values"
                  pass-api-key
                  :inline-success-message="false"
                  :inline-error-message="false"
                  submit-text="Отправить" class="pb-10"
                  @success="reloadVacanciesData">
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
    import { mapGetters, mapMutations } from 'vuex';

    import AppForm        from '~/components/forms/AppForm';
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppFinalizeResumeDialog',
        components: { AppDialog, AppForm },
        data: () => ( {
            values: {
                id: undefined,
                description: undefined,
            },
            functionOnSuccess: undefined,
            keyCount: 0,
        } ),
        computed: {
            ...mapGetters( 'ui', [ 'appFinalizeResumeDialogDisplay', 'appFinalizeResumeInnerDialogFunctionOnSuccess', 'appFinalizeResumeInnerDialogId' ] ),
            display: {
                get: vm => {
                    vm.values.description = null;
                    vm.values.id = vm.appFinalizeResumeInnerDialogId;
                    vm.functionOnSuccess = vm.appFinalizeResumeInnerDialogFunctionOnSuccess;
                    return vm.appFinalizeResumeDialogDisplay;
                },
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'finalizeResume' );

                    setTimeout( () => {
                        this.keyCount += 1;
                    }, 100 );
                },
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
            reloadVacanciesData( data ) {
                if ( !data ) return;
                this.functionOnSuccess( data );
                this.$emit( 'update:finalize', true );
            },
        },
    };
</script>
