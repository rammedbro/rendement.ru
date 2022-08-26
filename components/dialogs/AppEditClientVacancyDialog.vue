<template>
    <app-dialog v-model="display"
                max-width="448"
                @input="$emit('input', $event)">
        <app-form :key="keyCount"
                  v-bind="formParams"
                  :files="fileValues"
                  :inline-success-message="false"
                  :inline-error-message="false"
                  submit-text="Редактировать вакансию"
                  pass-api-key
                  class="mb-10">
            <template v-slot:header>
                <div class="text-h5 mt-4 mb-8">
                    Редактирование вакансии
                </div>
            </template>
            <template v-slot:fields="{ rules }">

                <v-text-field v-model="values.title"
                              :rules="[rules.required]"
                              outlined label="Название вакансии"/>

                <v-textarea v-model="values.description"
                            auto-grow
                            rows="3"
                            class="v-textarea--increased-margin"
                            outlined label="Описание и требования"/>
                <section>
                    <div class="text-small-2 mb-6 text-left">
                        Загружайте файлы по кнопке ниже.<br>
                        Форматы: jpg, png, pdf, docx.<br>
                        Размер — до 1 МБ.
                    </div>

                    <app-file-input ref="fileInput"
                                    v-model="fileValues.files"
                                    :loaded="loadedFiles.files"
                                    :deleted.sync="editValues.arDeleteFileId"
                                    :accept="['jpeg', 'jpg', 'png', 'doc', 'docx', 'pdf']"
                                    chips>

                        <template v-slot:input="{ onInput, files }">
                            <v-btn v-show="!files.length"
                                   color="primary" rounded
                                   x-small
                                   tag="label" role="button">

                                <input type="file"
                                       class="d-none"
                                       multiple
                                       @input="onInput">
                                Загрузить файл
                            </v-btn>
                        </template>
                    </app-file-input>
                </section>
            </template>

            <template v-slot:success>
                <div class="text-h5 mb-4">Вы успешно отредактировали вакансию!</div>

                <div class="text-body-2">
                    Изменения скоро будут внесены
                </div>
            </template>
        </app-form>
    </app-dialog>
</template>

<script>
    import AppFileInput   from '~/components/forms/elements/AppFileInput';
    import AppForm        from '~/components/forms/AppForm';
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppEditClientVacancyDialog',
        components: { AppFileInput, AppDialog, AppForm },
        props: {
            currentVacancy: {
                type: Object,
                default: () => {},
            },
            value: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            values: {
                title: null,
                description: null,
            },
            fileValues: {
                files: [],
            },
            loadedFiles: {
                files: [],
            },
            editValues: {
                id: null,
                arDeleteFileId: [],
            },
            keyCount: 0,
        } ),
        computed: {
            display: {
                get: vm => {
                    if ( vm.value ) {
                        vm.keyCount += 1;
                        vm.fileValues.files = [];
                        vm.values.title = vm.currentVacancy.title;
                        vm.values.description = vm.currentVacancy.description;
                        vm.loadedFiles.files = vm.currentVacancy.docs;
                        vm.editValues.id = vm.currentVacancy.id;
                    }
                    return vm.value;
                },
                set( value ) {
                    if ( value ) return;

                    this.$emit( 'input', false );
                    return value;
                },
            },
            formParams: vm => {
                return {
                    url: '/api/editClientVacancy/',
                    values: { ...vm.values, ...vm.editValues },
                };
            },
            input: vm => vm.$refs.fileInput.$el.querySelector( 'input[type=file]' ) || null,
        },
    };
</script>
