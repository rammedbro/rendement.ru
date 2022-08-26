<template>
    <app-form v-bind="formParams"
              :files="files"
              pass-api-key
              @success="onSuccess">
        <template v-slot:header>
            <div class="text-body-2 mb-8">
                Вы можете создавать портфолио под выбранные категории. Продемонстрируйте пользователям свои умения.
            </div>
        </template>

        <template v-slot:fields="{ rules }">
            <!-- Название -->
            <v-text-field v-model="values.title"
                          :rules="[rules.required]"
                          outlined label="Название портфолио"/>

            <!-- Drag'n'drop поле добавления файлов -->
            <app-file-input-drag-and-drop v-model="files.images"
                                          :rules="[rules.required]"
                                          :accept="[ 'jpg', 'jpeg', 'png' ]"
                                          max-size="1"
                                          :loaded="loadedFiles"
                                          url-key="preview"
                                          :deleted.sync="editValues.arDeleteImageId"
                                          btn-text="Добавить файл"/>
        </template>

        <template v-if="isEditForm"
                  v-slot:footer>
            <span class="text-subtitle-2 grey--text text--lighten-1 pointer"
                  @click="deletePortfolio">
                Удалить портфолио
            </span>
        </template>
    </app-form>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppForm                 from '~/components/forms/AppForm';
    import AppFileInputDragAndDrop from '~/components/forms/elements/AppFileInputDragAndDrop';

    export default {
        name: 'PortfolioCrudForm',
        components: { AppFileInputDragAndDrop, AppForm },
        props: {
            id: {
                type: Number,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            images: {
                type: Array,
                default: () => [],
            },
        },
        data: vm => ( {
            values: {
                title: vm.title,
            },
            editValues: {
                id: vm.id,
                arDeleteImageId: [],
            },
            files: {
                images: [],
            },
            loadedFiles: vm.images,
        } ),
        computed: {
            isEditForm: vm => vm.id !== null,
            formParams: vm => {
                return vm.isEditForm ? {
                    url: '/api/editPortfolio/',
                    values: { ...vm.values, ...vm.editValues },
                    submitText: 'Сохранить',
                } : {
                    url: '/api/addPortfolio/',
                    values: vm.values,
                    submitText: 'Создать',
                };
            },
        },
        methods: {
            ...mapMutations( 'user', [ 'addUserPortfolio', 'editUserPortfolio', 'deleteUserPortfolio' ] ),
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            onSuccess( portfolio ) {
                try {
                    if ( this.isEditForm ) {
                        this.editUserPortfolio( portfolio );
                    } else {
                        this.addUserPortfolio( portfolio );
                    }

                    this.$emit( 'success' );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e );
                }
            },
            async deletePortfolio() {
                try {
                    const { id } = this;

                    await this.apiPost( {
                        url: '/api/deletePortfolio/',
                        data: { id },
                        passApiKey: true,
                        useLoading: true,
                    } );

                    this.deleteUserPortfolio( id );
                    this.$emit( 'success' );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
        },
    };
</script>