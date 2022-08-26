<template>
    <app-dialog :key="keyCount"
                v-model="display"
                max-width="448">
        <app-form :key="keyCount"
                  url="/api/createClientVacancy/"
                  :values="{ id: userId, ...values }"
                  :files="fileValues"
                  :inline-success-message="false"
                  :inline-error-message="false"
                  submit-text="Создать вакансию"
                  pass-api-key
                  class="mb-10">
            <template v-slot:header>
                <div class="text-h5 mt-4 mb-4">
                    Создать вакансию
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

                    <app-file-input v-model="fileValues.files"
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

                        <template v-slot:files="{ files, remove }">
                            <div v-if="files.length"
                                 :class="files ? 'mt-0' : ''"
                                 class="l-file-input__files mb-5">
                                <v-row dense>
                                    <v-col v-for="(item, index) in files" :key="index"
                                           cols="auto">
                                        <v-chip close
                                                @click:close="remove(index)">
                                            <div :title="item.name"
                                                 class="text-ellipsis">
                                                {{ item.name }}
                                            </div>
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </div>
                        </template>

                    </app-file-input>
                </section>
            </template>

            <template v-slot:success>
                <div class="text-h5 mb-4">Запрос на создание вакансии отправлен!</div>

                <div class="text-body-2">
                    Вакансия будет добавлена в<br>
                    ближайшее время
                </div>
            </template>
        </app-form>
    </app-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppFileInput   from '~/components/forms/elements/AppFileInput';
    import AppForm        from '~/components/forms/AppForm';
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppCreateClientVacancyDialog',
        components: { AppFileInput, AppDialog, AppForm },
        data: () => ( {
            values: {
                title: null,
                description: null,
            },
            fileValues: {
                files: [],
            },
            keyCount: 0,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            ...mapGetters( 'ui', [ 'appCreateClientVacancyDialogDisplay' ] ),
            display: {
                get: vm => {
                    vm.values.title = null;
                    vm.values.description = null;
                    vm.fileValues.files = [];

                    return vm.appCreateClientVacancyDialogDisplay;
                },
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'createClientVacancy' );
                    this.keyCount += 1;
                },
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
        },
    };
</script>

<style>
    .v-textarea--increased-margin .v-text-field__slot textarea {
        margin-top: 26px !important;
    }
</style>
