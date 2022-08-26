<template>
    <v-card class="executor-card-detail">
        <v-container class="list-mb-4 list-mb-lg-8">
            <!-- Краткая информация -->
            <executor-rating-big :value="value"/>

            <!-- Предложить задание -->
            <template v-if="!isUserProfile">
                <!-- Кнопка -->
                <v-row>
                    <v-col>
                        <v-btn color="primary"
                               outlined block
                               @click="onChatBtnClick">
                            Написать
                        </v-btn>
                    </v-col>

                    <v-col>
                        <v-btn color="primary" block
                               @click="onOfferTaskBtnClick">
                            Предложить задание
                        </v-btn>
                    </v-col>
                </v-row>

                <!-- Диалог -->
                <app-dialog v-model="offerTaskDialog.display"
                            max-width="768">
                    <!-- Форма -->
                    <app-form url="/api/offerTaskToExecutor/"
                              :values="offerTaskDialog.values"
                              :inline-success-message="false"
                              pass-api-key
                              class="w-100">
                        <!-- Шапка -->
                        <template v-slot:header>
                            <div class="text-h5 mb-4">Выберите задание для исполнителя</div>

                            <p v-if="offerTaskDialog.count > 0"
                               class="text-body-2">
                                Выберите из списка задание, которое хотите предложить исполнителю
                            </p>
                        </template>

                        <!-- Поля -->
                        <template v-slot:fields="{ rules }">
                            <app-catalog url="/api/getTasks/"
                                         :filter="{ authorId: userId }"
                                         :limit="5"
                                         :item-type="$legacy.types.IntTaskMap"
                                         :count.sync="offerTaskDialog.count"
                                         :count-endings="tasks.countEndings"
                                         class="mb-8">
                                <!-- Задания -->
                                <template v-slot:items="{ items }">
                                    <v-radio-group v-model="offerTaskDialog.values.taskId"
                                                   :rules="[rules.required]"
                                                   class="max-w-100 mx-n4 mx-lg-0">
                                        <v-radio v-for="item in items" :key="item.id"
                                                 :value="item.id"
                                                 class="l-radio l-radio--unstyled l-border bwb-1">
                                            <template v-slot:label>
                                                <task-card-map :value="item"
                                                               :is-link="false"
                                                               class="transparent w-100"/>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                </template>

                                <template v-slot:no-result>
                                    <div class="text-body-2">
                                        У вас нет заданий для отправки,<br>
                                        перейдите в
                                        <nuxt-link to="/personal/tasks/">личный кабинет</nuxt-link>
                                        и создайте задание
                                    </div>
                                </template>
                            </app-catalog>
                        </template>

                        <!-- Кнопка "Отправить" -->
                        <template v-slot:submit="{ loading }">
                            <v-btn color="primary" block
                                   :loading="loading"
                                   :disabled="!offerTaskDialog.count"
                                   type="submit">
                                Отправить
                            </v-btn>
                        </template>

                        <!-- Успешная отправка -->
                        <template v-slot:success>
                            <v-icon color="primary" size="60"
                                    class="mb-6">
                                mdi-check-circle
                            </v-icon>

                            <div class="text-h5 mb-6">Ваше задание отправлено исполнителю</div>

                            <p class="mb-6">
                                После того, как исполнитель согласится выполнять задание,
                                вам придет уведомление
                            </p>

                            <v-btn color="primary" text
                                   width="320" max-width="100%"
                                   @click="offerTaskDialog.display = false">
                                Ок
                            </v-btn>
                        </template>
                    </app-form>
                </app-dialog>
            </template>

            <!-- Табы -->
            <v-tabs ref="tabs"
                    v-model="activeTab.main"
                    grow>
                <v-tab>Информация</v-tab>
                <v-tab>Задания</v-tab>
                <v-tab>Отзывы</v-tab>
            </v-tabs>

            <!-- Табы: Контент -->
            <v-tabs-items v-model="activeTab.main"
                          touchless>
                <!-- Информация -->
                <v-tab-item class="list-mb-6">
                    <!-- О себе -->
                    <section>
                        <div class="text-h5 mb-4">О себе</div>

                        <app-optional-field :value="value.about"
                                            component="p"/>
                    </section>
                    <v-divider/>

                    <!-- Возраст -->
                    <section>
                        <div class="text-h5 mb-4">Возраст</div>

                        <app-optional-field :value="ageFormat"/>
                    </section>

                    <template v-if="value.isExecutor">
                        <v-divider/>

                        <!-- Категория -->
                        <section>
                            <div class="text-h5 mb-4">Услуги и выполняемые работы</div>

                            <app-optional-field :value="value.categories">
                                <template v-slot="{ value: categories }">
                                    <div v-for="(item, index) in categories" :key="index"
                                         class="mb-4">
                                        <div class="text-subtitle-1">{{ item.name }}</div>
                                        <div class="text-body-1">
                                            {{ item.subCategories.map( item => item.name ).join(', ') }}
                                        </div>
                                    </div>
                                </template>
                            </app-optional-field>
                        </section>
                        <v-divider/>

                        <!-- Адрес месторождения -->
                        <section>
                            <div class="text-h5 mb-4">Месторождение или населенный пункт</div>

                            <app-optional-field :value="value.location">
                                <template v-slot="{ value: location }">
                                    <p>
                                        {{ location.title }},<br>
                                        {{ location.address }}
                                    </p>

                                    <v-btn color="primary"
                                           outlined rounded small
                                           @click="mapDialogDisplay = true">
                                        Показать на карте
                                    </v-btn>

                                    <!-- Карта -->
                                    <app-fullscreen-dialog v-model="mapDialogDisplay"
                                                           title="Карта">
                                        <app-map :value="location.id"
                                                 :filter="[ location.id ]"
                                                 class="flex-grow-1">
                                            <template v-slot:balloon>
                                                <executor-card-map :value="value"/>
                                            </template>
                                        </app-map>
                                    </app-fullscreen-dialog>
                                </template>
                            </app-optional-field>
                        </section>
                        <v-divider/>

                        <!-- Портфолио -->
                        <section>
                            <div class="text-h5 mb-4">Портфолио</div>

                            <app-optional-field :value="value.portfolios"
                                                message="У пользователя нет ни одного портфолио">
                                <template v-slot="{ value: portfolios }">
                                    <app-slider :items="portfolios"
                                                :options="{ autoWidth: true }"
                                                @click="onSliderClick">
                                        <template v-slot:item="{ item }">
                                            <portfolio-card :value="item"/>
                                        </template>
                                    </app-slider>

                                    <app-fullscreen-dialog v-model="galleryDialog.display"
                                                           :title="galleryDialogTitle">
                                        <app-slider v-model="galleryDialog.slide"
                                                    :items="galleryDialog.items"
                                                    item-key="detail" item-class="gallery-item"
                                                    controls/>
                                    </app-fullscreen-dialog>
                                </template>
                            </app-optional-field>
                        </section>
                    </template>
                </v-tab-item>

                <!-- Задания -->
                <v-tab-item>
                    <v-tabs v-if="value.isExecutor"
                            v-model="activeTab.tasks"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Я создал</v-tab>
                        <v-tab>Я выполнил</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="activeTab.tasks">
                        <!-- Задания: Автор -->
                        <v-tab-item>
                            <app-catalog :url="tasks.url"
                                         :filter="{ authorId: value.id }"
                                         :count-endings="tasks.countEndings"
                                         :item-type="$legacy.types.IntTaskPreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Задания: Исполнитель -->
                        <v-tab-item>
                            <app-catalog :url="tasks.url"
                                         :filter="{ executorId: value.id }"
                                         :count-endings="tasks.countEndings"
                                         :item-type="$legacy.types.IntTaskPreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Отзывы -->
                <v-tab-item>
                    <app-catalog :url="reviews.url"
                                 :filter="{ userId: value.id, isRecipient: true }"
                                 :count-endings="reviews.countEndings"
                                 :item-type="$legacy.types.IntReview"
                                 item-col-width="12"
                                 no-result-message="У данного пользователя ещё нет отзывов">
                        <template v-slot:item="{ item, index, length }">
                            <review-card :value="item"/>
                            <v-divider v-if="index < length - 1"
                                       class="mt-4 mt-lg-8"/>
                        </template>
                    </app-catalog>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    import AppMap              from '~/components/ui/AppMap';
    import ReviewCard          from '~/components/ui/review/ReviewCard';
    import AppSlider           from '~/components/ui/AppSlider';
    import AppFullscreenDialog from '~/components/dialogs/AppFullscreenDialog';
    import AppCatalog          from '~/components/ui/AppCatalog';
    import TaskCardPreview     from '~/components/ui/task/TaskCardPreview';
    import ExecutorRatingBig   from '~/components/ui/executor/ExecutorRatingBig';
    import ExecutorCardMap     from '~/components/ui/executor/ExecutorCardMap';
    import AppDialog           from '~/components/dialogs/AppDialog';
    import AppForm             from '~/components/forms/AppForm';
    import TaskCardMap         from '~/components/ui/task/TaskCardMap';
    import AppOptionalField    from '~/components/ui/AppOptionalField';
    import PortfolioCard       from '~/components/ui/portfolio/PortfolioCard';
    import {
        formatLocaleDate,
        pickNumeralEnding,
    }                          from '~/lib/classes/utility';

    export default {
        name: 'ExecutorCardDetail',
        components: {
            PortfolioCard,
            AppOptionalField,
            TaskCardMap,
            AppForm,
            AppDialog,
            ExecutorCardMap,
            ExecutorRatingBig,
            TaskCardPreview,
            AppCatalog,
            AppFullscreenDialog,
            AppSlider,
            ReviewCard,
            AppMap,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        data: vm => ( {
            activeTab: {
                main: null,
                tasks: vm.value.isExecutor ? null : 0,
            },
            mapDialogDisplay: false,
            galleryDialog: {
                display: false,
                slide: 0,
                items: [],
            },
            tasks: {
                url: '/api/getTasks/',
                countEndings: [ 'задание', 'задания', 'заданий' ],
            },
            reviews: {
                url: '/api/getReviews/',
                countEndings: [ 'отзыв', 'отзыва', 'отзывов' ],
            },
            offerTaskDialog: {
                display: false,
                count: undefined,
                values: {
                    executorId: vm.value.id,
                    taskId: null,
                },
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin', 'userId' ] ),
            isUserProfile: vm => vm.value.id === vm.userId,
            galleryDialogTitle: vm => `${ vm.galleryDialog.slide + 1 } из ${ vm.galleryDialog.items.length }`,
            ageFormat: vm => {
                const { birthDay } = vm.value;

                if ( birthDay === null ) {
                    return null;
                }

                const birthYear = formatLocaleDate( birthDay ).getFullYear();
                const curYear = new Date().getFullYear();
                const diff = curYear - birthYear;

                return `${ diff } ${ pickNumeralEnding( diff, [ 'год', 'года', 'лет' ] ) }`;
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            ...mapActions( 'chat', [ 'createChat' ] ),
            onSliderClick( { item } ) {
                this.galleryDialog.display = true;
                this.galleryDialog.items = item.images;
            },
            onOfferTaskBtnClick() {
                if ( this.userIsLogin ) {
                    this.offerTaskDialog.display = true;
                } else {
                    this.showAppDialog( 'auth' );
                }
            },
            onChatBtnClick() {
                if ( this.userIsLogin ) {
                    this.createChat( {
                        type: 'user',
                        arUserId: [ this.userId, this.value.id ],
                    } )
                        .then( id => this.$router.push( `/personal/chats/${ id }/` ) )
                        .catch( () => {
                            this.showAppDialog( 'error' );
                        } );
                } else {
                    this.showAppDialog( 'auth' );
                }
            },
        },
    };
</script>