<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <template v-if="isDesktop">
                    <v-container>
                        <h1 class="text-h3">{{ h1 }}</h1>
                    </v-container>
                    <v-divider/>
                </template>

                <v-container class="list-mb-6">
                    <!-- Статус бар -->
                    <executor-card-status-bar :value="userData"/>

                    <!-- Краткая информация -->
                    <executor-rating-big :value="userData"/>
                    <v-divider/>

                    <v-list>
                        <!-- Редактирование профиля -->
                        <v-list-item @click="profileEditDialog = true">
                            <v-list-item-content>
                                Редактирование профиля
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-icon color="primary">mdi-chevron-right</v-icon>
                            </v-list-item-action>

                            <!-- Редактирование профиля: Диалог -->
                            <app-fullscreen-dialog v-model="profileEditDialog"
                                                   title="Редактирование профиля"
                                                   transition="scroll-x-transition"
                                                   content-class="grey lighten-5">
                                <v-card width="100%" max-width="768"
                                        class="pa-4 pa-lg-8 mx-auto">
                                    <!-- Редактирование профиля: Форма -->
                                    <personal-profile-edit-form v-if="profileEditDialog"
                                                                v-bind="profileEditData"
                                                                @success="profileEditDialog = false"/>
                                </v-card>
                            </app-fullscreen-dialog>
                        </v-list-item>
                        <v-divider/>

                        <!-- Настройки аккаунта -->
                        <v-list-item @click="accountSettingsDialog = true">
                            <v-list-item-content>
                                Настройки аккаунта
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-icon color="primary">mdi-chevron-right</v-icon>
                            </v-list-item-action>

                            <!-- Настройки аккаунта: Диалог -->
                            <app-fullscreen-dialog v-model="accountSettingsDialog"
                                                   title="Настройки аккаунта"
                                                   transition="scroll-x-transition"
                                                   content-class="grey lighten-5">
                                <v-card width="100%" max-width="768"
                                        class="pa-4 pa-lg-8 mx-auto">
                                    <!-- Настройки аккаунта: Форма -->
                                    <personal-account-settings-form v-if="accountSettingsDialog"
                                                                    v-bind="accountSettingsData"
                                                                    @success="accountSettingsDialog = false"/>
                                </v-card>
                            </app-fullscreen-dialog>
                        </v-list-item>
                        <v-divider/>

                        <v-list-item nuxt :to="`/executors/${userData.id}/`">
                            <v-list-item-content class="primary--text">
                                Как выглядит моя страница
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider/>
                    </v-list>
                </v-container>
            </v-card>
        </v-col>

        <!-- Блок "Стать исполнителем" -->
        <v-col v-if="!userIsExecutor && appBecomeExecutorShow"
               cols="12">
            <app-become-executor template="blue" class="mb-4"/>

            <div class="text-center">
                <span class="text-subtitle-1 link grey--text"
                      @click="setAppBecomeExecutor(false)">
                    Больше не показывать
                </span>
            </div>
        </v-col>
    </v-row>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { meta }                     from '~/mixins/meta';

    import AppFullscreenDialog         from '~/components/dialogs/AppFullscreenDialog';
    import PersonalProfileEditForm     from '~/components/ui/personal/PersonalProfileEditForm';
    import PersonalAccountSettingsForm from '~/components/ui/personal/PersonalAccountSettingsForm';
    import ExecutorCardStatusBar       from '~/components/ui/executor/ExecutorCardStatusBar';
    import ExecutorRatingBig           from '~/components/ui/executor/ExecutorRatingBig';
    import AppBecomeExecutor           from '~/components/blocks/AppBecomeExecutor';
    import { formatLocaleDate }        from '~/lib/classes/utility';

    export default {
        components: {
            AppBecomeExecutor,
            ExecutorRatingBig,
            ExecutorCardStatusBar,
            PersonalAccountSettingsForm,
            PersonalProfileEditForm,
            AppFullscreenDialog,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Профиль',
            profileEditDialog: false,
            accountSettingsDialog: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userData', 'userIsExecutor' ] ),
            ...mapGetters( 'ui', [ 'appBecomeExecutorShow' ] ),
            profileEditData: vm => {
                const {
                    avatar, sexId, name, lastName, about, isExecutor,
                    personTypeId, secondName, companyName, inn, birthDay,
                } = vm.userData;

                const result = {
                    avatar,
                    sexId,
                    name,
                    lastName,
                    about,
                    personTypeId,
                    isExecutor,
                    secondName,
                    companyName,
                    inn,
                    birthDay,
                };

                if ( result.birthDay !== null ) {
                    result.birthDay = formatLocaleDate( birthDay, 'date' );
                }

                if ( isExecutor ) {
                    const { location, locationRadius, categories } = vm.userData;

                    result.locationId = location.id;
                    result.locationRadius = locationRadius;
                    result.arSubcategoryId = [];
                    result.arCategoryCode = categories.map( item => {
                        item.subCategories.forEach( item => result.arSubcategoryId.push( item.id ) );
                        return item.code;
                    } );
                }

                return result;
            },
            accountSettingsData: vm => {
                const { email, phone, emailNotification, phoneNotification } = vm.userData;
                return { email, phone, emailNotification, phoneNotification };
            },
        },
        async fetch( { store, error } ) {
            try {
                await store.dispatch( 'user/getUserFull' );
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        created() {
            this.getAppBecomeExecutor();
        },
        methods: {
            ...mapMutations( 'ui', [ 'getAppBecomeExecutor', 'setAppBecomeExecutor' ] ),
        },
    };
</script>