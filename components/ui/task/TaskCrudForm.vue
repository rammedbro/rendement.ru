<template>
    <app-form v-bind="formParams"
              :files="fileValues"
              pass-api-key
              :before-submit-callback="checkForLineBreak"
              @success="onSuccess">
        <template v-slot:fields="{ rules }">
            <template v-if="isEditForm">
                <div class="text-h6 mb-6">Вы выбрали:</div>

                <v-row no-gutters>
                    <v-col cols="12" md="6"
                           class="pr-md-4">
                        <category-select v-model="values.categoryCode"
                                         url="/api/categories/"
                                         :sub-categories.sync="subCategories"
                                         readonly
                                         @input="values.subCategoryId = null"/>
                    </v-col>

                    <v-col cols="12" md="6"
                           class="pl-md-4">
                        <app-select v-model="values.subCategoryId"
                                    :rules="[rules.required]"
                                    :items="subCategories"
                                    item-text="name"
                                    item-value="id"
                                    readonly
                                    label="Подкатегория"
                                    no-data-text="Выберите категорию"/>
                    </v-col>
                </v-row>
            </template>

            <div class="mb-8 list-mb-8">
                <div class="text-h4 mb-8">Заполните заявку</div>

                <section class="l-border bwb-1">
                    <!-- Заголовок задания -->
                    <v-text-field v-model="values.title"
                                  :rules="[rules.required]"
                                  label="Мне нужно" outlined/>

                    <!-- Описание -->
                    <v-textarea v-model="values.description"
                                label="Опишите задачу" outlined/>

                    <!-- Местоположение -->
                    <location-search v-model="values.locationId"
                                     :radius.sync="values.locationRadius"
                                     with-map with-radius/>

                    <!-- Радиус -->
                    <app-text-field-slider v-show="values.locationId !== null"
                                           v-model="values.locationRadius"
                                           :max="500"
                                           label="Радиус от местонахождения"
                                           postfix="км."/>

                    <!-- Дата -->
                    <app-text-field-range-datepicker v-model="values.dateRange"
                                                     :min="new Date().toLocaleDateString()"
                                                     label="Выберите дату"/>

                    <!-- Бюджет -->
                    <app-text-field-slider v-model="values.price"
                                           :rules="[rules.required]"
                                           :min="0" :max="5e6" :step="1000"
                                           label="Желаемый бюджет"
                                           postfix="руб."/>
                </section>

                <!-- Способ оплаты -->
                <section>
                    <div class="text-h6 mb-6">
                        <span class="mr-4">Способ оплаты</span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>
                                При выборе "Безопасной сделки" оплата спишется с вашей банковской карты при выборе
                                исполнителя и будет надёжно храниться до завершения задания
                            </span>
                        </v-tooltip>
                    </div>

                    <v-radio-group v-model="values.safeDeal"
                                   :hide-details="!values.safeDeal">
                        <v-radio :value="true"
                                 label="Оплата через безопасную сделку (функция временно недоступна)"
                                 disabled/>
                        <v-radio :value="false" label="По договоренности с исполнителем"/>
                    </v-radio-group>

                    <div v-if="!values.safeDeal"
                         class="ml-7 mt-4 list-mb-2">
                        <v-checkbox v-for="(item, index) in $legacy.constants.TASK_PAYMENT_LIST"
                                    :key="index"
                                    v-model="values.paymentsByAgreement"
                                    :value="item.value"
                                    :label="item.text"
                                    hide-details/>
                    </div>
                </section>
                <v-divider/>

                <!-- Требования -->
                <section>
                    <div class="text-h6 mb-6">
                        <span class="mr-4">Требования</span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>Это поможет найти исполнителей, готовых взяться за ваш заказ</span>
                        </v-tooltip>
                    </div>

                    <app-text-field-chips v-model="values.requirements"
                                          placeholder="Например, Опыт работы от 5 лет"/>
                </section>
                <v-divider/>

                <!-- Публичные файлы -->
                <section class="l-border bwb-1">
                    <div class="text-h6 mb-6">
                        <span class="mr-4">Публичные файлы</span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>Вы можете добавить файлы к заданию которые будут видны всем пользователям</span>
                        </v-tooltip>
                    </div>

                    <div class="text-small-2 mb-6">
                        Загружайте файлы по кнопке ниже. Форматы: jpg, png, pdf, docx.<br>
                        Размер — до 1 МБ.
                    </div>

                    <app-file-input v-model="fileValues.files"
                                    :accept="['jpeg', 'jpg', 'png', 'doc', 'docx', 'pdf']"
                                    multiple chips max-size="1"
                                    :loaded="loadedFiles.files"
                                    :deleted.sync="editValues.arDeleteFileId"
                                    btn-text="Загрузить файл"/>
                </section>

                <!-- Скрытые файлы -->
                <section class="l-border bwb-1">
                    <div class="text-h6 mb-6">
                        <span class="mr-4">Скрытые файлы</span>
                        <v-tooltip bottom max-width="188">
                            <template v-slot:activator="{ on }">
                                <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>Вы можете добавить файлы к заданию, которые будут видны только исполнителю</span>
                        </v-tooltip>
                    </div>

                    <div class="text-small-2 mb-6">
                        Загружайте файлы по кнопке ниже. Форматы: jpg, png, pdf, doc, docx.<br>
                        Размер — до 1 МБ.
                    </div>

                    <app-file-input v-model="files.hiddenFiles"
                                    :accept="['jpeg', 'jpg', 'png', 'doc', 'docx', 'pdf']"
                                    multiple chips max-size="1"
                                    :loaded="loadedFiles.hiddenFiles"
                                    :deleted.sync="editValues.arDeleteHiddenFileId"
                                    btn-text="Загрузить файл"/>
                </section>

                <!-- Чекбоксы -->
                <section class="l-border bwb-1">
                    <v-checkbox v-model="values.offersFromLegalOnly"
                                label="Хочу получать предложения только от юридических лиц или ИП"/>
                </section>
            </div>
        </template>

        <!-- Кнопка "Отправить" -->
        <template v-slot:submit="{ loading, submit }">
            <v-btn :id="submitId"
                   color="primary" block
                   type="submit"
                   :loading="loading"
                   @click.prevent="submitWrapper( submit )">
                Опубликовать
            </v-btn>
        </template>
    </app-form>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppTextFieldRangeDatepicker  from '~/components/forms/elements/AppTextFieldRangeDatepicker';
    import LocationSearch               from '~/components/ui/location/LocationSearch';
    import AppTextFieldSlider           from '~/components/forms/elements/AppTextFieldSlider';
    import AppTextFieldChips            from '~/components/forms/elements/AppTextFieldChips';
    import AppForm                      from '~/components/forms/AppForm';
    import AppFileInput                 from '~/components/forms/elements/AppFileInput';
    import CategorySelect               from '~/components/ui/category/CategorySelect';
    import AppSelect                    from '~/components/forms/elements/AppSelect';
    import { IntTaskDetail }            from '~/lib/types/task';
    import {
        checkType,
        checkObjectInterface,
    }                                   from '~/lib/classes/validation';

    export default {
        name: 'TaskCrudForm',
        components: {
            CategorySelect,
            LocationSearch,
            AppSelect,
            AppFileInput,
            AppForm,
            AppTextFieldChips,
            AppTextFieldSlider,
            AppTextFieldRangeDatepicker,
        },
        props: {
            id: {
                type: Number,
                default: null,
            },
            categoryCode: {
                type: String,
                default: null,
            },
            subCategoryId: {
                type: Number,
                default: null,
            },
            locationId: {
                type: Number,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            price: {
                type: Number,
                default: null,
            },
            description: {
                type: String,
                default: null,
            },
            dateRange: {
                type: Array,
                default: () => [],
            },
            locationRadius: {
                type: Number,
                default: null,
            },
            safeDeal: {
                type: Boolean,
                default: false,
            },
            paymentsByAgreement: {
                type: Array,
                default: () => [],
            },
            requirements: {
                type: Array,
                default: () => [],
            },
            offersFromLegalOnly: {
                type: Boolean,
                default: false,
            },
            files: {
                type: Array,
                default: () => [],
            },
            hiddenFiles: {
                type: Array,
                default: () => [],
            },
        },
        data: vm => ( {
            subCategories: [],
            values: {
                categoryCode: vm.categoryCode,
                subCategoryId: vm.subCategoryId,
                locationId: vm.locationId,
                title: vm.title,
                price: vm.price,
                description: vm.description,
                dateRange: vm.dateRange,
                locationRadius: vm.locationRadius,
                safeDeal: vm.safeDeal,
                paymentsByAgreement: vm.paymentsByAgreement.concat(),
                requirements: vm.requirements.concat(),
                offersFromLegalOnly: vm.offersFromLegalOnly,
            },
            editValues: {
                id: vm.id,
                arDeleteFileId: [],
                arDeleteHiddenFileId: [],
            },
            fileValues: {
                files: [],
                hiddenFiles: [],
            },
            loadedFiles: {
                files: vm.files,
                hiddenFiles: vm.hiddenFiles,
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
            isEditForm: vm => vm.id !== null,
            formParams: vm => {
                return vm.isEditForm ? {
                    url: '/api/editTask/',
                    values: { ...vm.values, ...vm.editValues },
                } : {
                    url: '/api/createTask/',
                    values: vm.values,
                };
            },
            submitId: vm => vm.isEditForm ? 'btn-301' : 'btn-302',
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onSuccess( result ) {
                try {
                    if ( this.isEditForm ) {
                        result = checkObjectInterface( result, IntTaskDetail );
                    } else {
                        result = checkType( result.id, Number );
                    }

                    this.$emit( 'success', result );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e );
                }
            },
            submitWrapper( callback ) {
                this.userIsLogin ? callback() : this.showAppDialog( 'auth' );
            },
            checkForLineBreak() {
                this.values.description = this.values.description.replace( /\n/g, '<br>' );
            },
        },
    };
</script>
