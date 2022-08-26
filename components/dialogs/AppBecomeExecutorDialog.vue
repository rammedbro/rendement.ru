<template>
    <app-fullscreen-dialog v-model="display"
                           :title="title"
                           content-class="grey lighten-5"
                           :with-back-btn="stepper > 1"
                           @click:back="prevStep">
        <v-card width="100%" max-width="768"
                class="pa-4 pa-lg-8 mx-auto">
            <app-form url="/api/executorRegistration/"
                      :values="values"
                      :files="files"
                      disable-default-submit
                      pass-api-key
                      :after-submit-callback="handleResult"
                      @success="hideAppDialog( 'becomeExecutor' )">
                <template v-slot:fields="{ rules, validate, loading }">
                    <!-- Заголовок -->
                    <div class="text-h4 primary--text text-lg-center mb-4 mb-lg-8">
                        Регистрация исполнителя
                    </div>

                    <!-- Пошаговая регистрация -->
                    <v-stepper v-model="stepper"
                               class="transparent">
                        <v-stepper-items>
                            <!-- Шаг 1 -->
                            <v-stepper-content step="1">
                                <p class="text-body-2">
                                    Выберите категории из списка, по которым хотите выполнть задания.
                                    Заказчики будут находить вас только по выбранным категориям.
                                </p>

                                <p class="text-small-1 mb-6">Вы всегда их сможете изменить в редактировании профиля.</p>

                                <!-- Категория -->
                                <category-select v-model="values.arCategoryCode"
                                                 url="/api/categories/"
                                                 :rules="[rules.required]"
                                                 :sub-categories.sync="subCategories"
                                                 multiple/>

                                <!-- Подкатегория -->
                                <app-select v-model="values.arSubcategoryId"
                                            :items="subCategories"
                                            :rules="[rules.required]"
                                            item-text="name" item-value="id"
                                            multiple label="Подкатегория"
                                            no-data-text="Выберите категорию"/>

                                <v-btn color="primary" block
                                       @click="nextStep(validate)">
                                    Продолжить
                                </v-btn>
                            </v-stepper-content>

                            <!-- Шаг 2 -->
                            <v-stepper-content step="2">
                                <p class="text-body-2">
                                    Вы можете создавать портфолио под выбранные категории.
                                    Продемонстрируйте пользователям свои умения.
                                </p>

                                <p class="text-body-2 mb-6">
                                    Этот шаг не обязательный, вы всегда сможете вернуться к нему в личном кабинете,
                                    перейдя по вкладке “Портфолио”.
                                </p>

                                <template v-if="stepper > 1">
                                    <!-- Название портфолио -->
                                    <v-text-field v-model="values.portfolioTitle"
                                                  :rules="files.portfolioImages.length ? [rules.required] : []"
                                                  outlined label="Название портфолио"/>

                                    <!-- Drag'n'drop поле добавления файлов в портфолио -->
                                    <app-file-input-drag-and-drop v-model="files.portfolioImages"
                                                                  :rules="values.portfolioTitle ? [rules.required] : []"
                                                                  :accept="[ 'jpg', 'jpeg', 'png' ]"
                                                                  max-size="1"
                                                                  btn-text="Добавить файл"/>
                                </template>

                                <v-row>
                                    <v-col>
                                        <v-btn color="primary"
                                               block
                                               @click="nextStep(validate)">
                                            Продолжить
                                        </v-btn>
                                    </v-col>

                                    <v-col>
                                        <v-btn color="primary"
                                               block outlined
                                               @click="skipStepTwo">
                                            Пропустить шаг
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-stepper-content>

                            <!-- Шаг 3 -->
                            <v-stepper-content step="3">
                                <p class="text-body-2 mb-6">
                                    Добавьте адрес месторождения на котором сейчас находитесь.
                                    Благодаря этому, вас быстрее будут находить заказчики.
                                </p>

                                <!-- Месторождение -->
                                <location-search v-if="stepper > 2"
                                                 v-model="values.locationId"
                                                 :rules="[rules.required]"
                                                 :radius.sync="values.locationRadius"
                                                 with-map with-radius/>

                                <!-- Радиус -->
                                <app-text-field-slider v-show="values.locationId !== null"
                                                       v-model="values.locationRadius"
                                                       :max="500"
                                                       label="Радиус от местонахождения"
                                                       postfix="км."/>

                                <v-btn color="primary" block
                                       :loading="loading" type="submit">
                                    Завершить регистрацию
                                </v-btn>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </template>
            </app-form>
        </v-card>
    </app-fullscreen-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppFullscreenDialog     from '~/components/dialogs/AppFullscreenDialog';
    import CategorySelect          from '~/components/ui/category/CategorySelect';
    import AppSelect               from '~/components/forms/elements/AppSelect';
    import AppForm                 from '~/components/forms/AppForm';
    import AppFileInputDragAndDrop from '~/components/forms/elements/AppFileInputDragAndDrop';
    import LocationSearch          from '~/components/ui/location/LocationSearch';
    import AppTextFieldSlider      from '~/components/forms/elements/AppTextFieldSlider';

    export default {
        name: 'AppBecomeExecutorDialog',
        components: {
            AppTextFieldSlider,
            CategorySelect,
            LocationSearch,
            AppFileInputDragAndDrop,
            AppForm,
            AppSelect,
            AppFullscreenDialog,
        },
        data: () => ( {
            stepper: 1,
            subCategories: [],
            values: {
                arCategoryCode: [],
                arSubcategoryId: [],
                portfolioTitle: null,
                locationId: null,
                locationRadius: null,
            },
            files: {
                portfolioImages: [],
            },
        } ),
        computed: {
            ...mapGetters( 'ui', [ 'appBecomeExecutorDialogDisplay' ] ),
            display: {
                get: vm => vm.appBecomeExecutorDialogDisplay,
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'becomeExecutor' );
                },
            },
            title: vm => `${ vm.stepper } из 3`,
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
            ...mapMutations( 'user', [ 'setUserAsExecutor', 'setUserPortfolios', 'updateUser' ] ),
            prevStep() {
                if ( this.stepper > 1 ) this.stepper--;
            },
            nextStep( validate ) {
                if ( this.stepper < 3 && validate() ) this.stepper++;
            },
            skipStepTwo() {
                this.values.portfolioTitle = null;
                this.files.portfolioImages = [];
                this.stepper = 3;
            },
            handleResult( result ) {
                const { portfolios, ...user } = result;
                this.updateUser( user );
                this.setUserPortfolios( portfolios );
            },
        },
    };
</script>