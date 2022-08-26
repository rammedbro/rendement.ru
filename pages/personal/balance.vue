<template>
    <v-card>
        <template v-if="isDesktop">
            <v-container>
                <h1 class="text-h3">{{ h1 }}</h1>
            </v-container>
            <v-divider/>
        </template>

        <v-container>
            <v-row align="center" justify="space-between">
                <v-col cols="auto">
                    <div class="text-h5 mb-2">Ваш баланс</div>
                    <div class="text-h6 postfix--rubles">{{ userBalance.toLocaleString() }}</div>
                </v-col>

                <!-- Кнопка "Пополнить баланс" -->
                <v-col cols="auto">
                    <v-btn color="primary"
                           min-width="288"
                           @click="addBalanceDialog.display = true">
                        Пополнить баланс
                    </v-btn>

                    <app-dialog v-model="addBalanceDialog.display">
                        <app-form url="/api/addBalance/"
                                  method="GET"
                                  :values="addBalanceDialog.values"
                                  submit-text="Продолжить"
                                  @success="onAddBalanceSuccess">
                            <template v-slot:header>
                                <div class="text-h5 mb-4">Укажите сумму</div>
                            </template>

                            <template v-slot:fields="{ rules, masks }">
                                <v-text-field v-model="addBalanceDialog.values.sum"
                                              v-mask="{ ...masks.currency, ...addBalanceDialog.masks.sum }"
                                              :rules="[rules.required, addBalanceDialog.rules.sum]"/>

                                <div class="text-small-1 text--disabled mb-4">
                                    На счет можно положить любую<br> сумму от 500 рублей.
                                </div>
                            </template>
                        </app-form>
                    </app-dialog>
                </v-col>
            </v-row>

            <v-divider class="my-6"/>

            <div class="text-h5 mb-4">История</div>

            <!-- История пополнений -->
            <app-table url="/api/getBalanceHistory/"
                       :headers="headers"
                       :item-type="$legacy.types.IntBalanceHistory"
                       no-result-message="Пусто"
                       pass-api-key
                       disable-count>
                <template v-slot:item.operation="{ value }">
                    <div class="text-ellipsis">{{ value.text }}</div>
                </template>

                <template v-slot:item.date="{ value }">
                    {{ $legacy.formatLocaleDate( value, 'date' ) }}
                </template>

                <template v-slot:item.sum="{ value, item }">
                    <div class="text-ellipsis postfix--rubles">
                        {{ item.operation.sign }} {{ value.toLocaleString() }}
                    </div>
                </template>
            </app-table>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { meta }                     from '~/mixins/meta';

    import AppTable      from '~/components/ui/AppTable';
    import AppDialog     from '~/components/dialogs/AppDialog';
    import AppForm       from '~/components/forms/AppForm';
    import { checkType } from '~/lib/classes/validation';

    export default {
        components: { AppForm, AppDialog, AppTable },
        mixins: [ meta ],
        data: () => ( {
            title: 'Баланс',
            headers: [
                { value: 'operation', text: 'Операция' },
                { value: 'date', text: 'Дата' },
                { value: 'sum', text: 'Сумма' },
            ],
            addBalanceDialog: {
                display: false,
                values: {
                    sum: 500,
                },
                masks: {
                    sum: {
                        suffix: ' руб.',
                    },
                },
                rules: {
                    sum: v => ( +v >= 500 ) || 'Минимальная сумма - 500 руб.',
                },
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userBalance' ] ),
        },
        async fetch( { store, error } ) {
            try {
                await store.dispatch( 'user/getUserBalance' );
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onAddBalanceSuccess( result ) {
                try {
                    window.location = checkType( result, String );
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
        },
    };
</script>