<template>
    <app-form v-bind="formParams"
              pass-api-key
              privacy-check
              :files="fileValues"
              :before-submit-callback="checkForLineBreak"
              @success="onSuccess">
        <template v-slot:fields="{ rules, masks }">
            <!-- Поля при "Редактировании" -->
            <template v-if="isEditForm">
                <div class="text-h6 mb-6">Вы выбрали:</div>

                <category-select v-model="values.categoryCode"
                                 :rules="[rules.required]"
                                 url="/api/resumeCategories/"/>
            </template>

            <div class="mb-8 list-mb-8">
                <div class="text-h4 mb-8">Заполните форму</div>

                <section class="l-border bwb-1">
                    <!-- Название должности -->
                    <v-text-field v-model="values.title"
                                  :rules="[rules.required]"
                                  label="Название должности" outlined
                                  placeholder="Например: Водитель погрузчика"/>

                    <!-- Описание -->
                    <v-textarea v-model="values.description"
                                :rules="[rules.required]"
                                label="Опыт работы" outlined/>

                    <!-- Опыт работы -->
                    <app-select v-model="values.experienceId"
                                :items="$legacy.constants.WORK_EXPERIENCE_LIST"
                                :rules="[rules.required]"
                                label="Стаж"/>

                    <!-- Дата рождения -->
                    <v-text-field v-model="values.birthDay"
                                  v-mask="masks.date"
                                  :rules="[rules.required]"
                                  outlined label="Дата рождения"
                                  append-icon="mdi-calendar-blank"
                                  @click:append="datePickerDialog = true"/>

                    <!-- Календарь -->
                    <v-dialog v-model="datePickerDialog"
                              width="320">
                        <app-datepicker v-model="values.birthDay"
                                        @close="datePickerDialog = false"/>
                    </v-dialog>

                    <!-- Место жительства -->
                    <location-search v-model="values.placeOfResidence"
                                     label="Место жительства"
                                     :rules="[rules.required]"
                                     is-place-of-residence
                                     with-map with-radius/>

                    <!-- Местоположение -->
                    <location-search v-model="values.locationId"
                                     :rules="[rules.required]"
                                     :radius.sync="values.locationRadius"
                                     with-map with-radius/>

                    <!-- Радиус -->
                    <app-text-field-slider v-show="values.locationId !== null"
                                           v-model="values.locationRadius"
                                           :max="500"
                                           label="Радиус от местонахождения"
                                           postfix="км."/>

                    <!-- Зарплата -->
                    <v-text-field v-model="values.salary"
                                  v-mask="masks.currency"
                                  outlined label="Желаемая зарплата"/>
                </section>

                <!-- Навыки -->
                <section class="l-border bwb-1">
                    <div class="text-h6 mb-6">Ключевые навыки</div>

                    <app-text-field-chips v-model="values.skills"
                                          placeholder="Требуемые навыки"/>
                </section>

                <!-- Публичные файлы -->
                <section class="l-border bwb-1">
                    <div class="text-h6 mb-6">
                        <span class="mr-4">Дополнительные файлы</span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>Добавьте сканы документов подтверждающих квалификацию</span>
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
            </div>
        </template>

        <!-- Кнопка "Отправить" -->
        <template v-slot:submit="{ loading, submit }">
            <v-btn color="primary" block
                   :loading="loading" type="submit"
                   @click.prevent="submitWrapper( submit )">
                Опубликовать
            </v-btn>
        </template>
    </app-form>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import LocationSearch      from '~/components/ui/location/LocationSearch';
    import AppTextFieldChips   from '~/components/forms/elements/AppTextFieldChips';
    import AppForm             from '~/components/forms/AppForm';
    import AppSelect           from '~/components/forms/elements/AppSelect';
    import AppDatepicker       from '~/components/ui/AppDatepicker';
    import CategorySelect      from '~/components/ui/category/CategorySelect';
    import AppTextFieldSlider  from '~/components/forms/elements/AppTextFieldSlider';
    import AppFileInput        from '~/components/forms/elements/AppFileInput';
    import { IntResumeDetail } from '~/lib/types/resume';
    import {
        checkType,
        checkObjectInterface,
    }                          from '~/lib/classes/validation';

    export default {
        name: 'ResumeCrudForm',
        components: {
            AppTextFieldSlider,
            CategorySelect,
            LocationSearch,
            AppSelect,
            AppDatepicker,
            AppForm,
            AppTextFieldChips,
            AppFileInput,
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
            title: {
                type: String,
                default: null,
            },
            description: {
                type: String,
                default: null,
            },
            experienceId: {
                type: Number,
                default: null,
            },
            locationId: {
                type: Number,
                default: null,
            },
            salary: {
                type: Number,
                default: null,
            },
            locationRadius: {
                type: Number,
                default: 0,
            },
            skills: {
                type: Array,
                default: () => [],
            },
            files: {
                type: Array,
                default: () => [],
            },
            birthDay: {
                type: String,
                default: null,
            },
            placeOfResidence: {
                type: Number,
                default: null,
            },
        },
        data: vm => ( {
            values: {
                categoryCode: vm.categoryCode,
                title: vm.title,
                description: vm.description,
                experienceId: vm.experienceId,
                locationId: vm.locationId,
                locationRadius: vm.locationRadius,
                salary: vm.salary,
                skills: vm.skills.concat(),
                birthDay: vm.birthDay,
                placeOfResidence: vm.placeOfResidence,
            },
            fileValues: {
                files: [],
            },
            loadedFiles: {
                files: vm.files,
            },
            editValues: {
                id: vm.id,
                arDeleteFileId: [],
            },
            datePickerDialog: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
            isEditForm: vm => vm.id !== null,
            formParams: vm => {
                return vm.isEditForm ? {
                    url: '/api/editResume/',
                    values: { ...vm.values, ...vm.editValues },
                } : {
                    url: '/api/createResume/',
                    values: vm.values,
                };
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onSuccess( result ) {
                try {
                    if ( this.isEditForm ) {
                        result = checkObjectInterface( result, IntResumeDetail );
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
