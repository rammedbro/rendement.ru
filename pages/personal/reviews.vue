<template>
    <v-card>
        <template v-if="isDesktop">
            <v-container>
                <h1 class="text-h3">{{ h1 }}</h1>
            </v-container>
            <v-divider/>
        </template>

        <v-container class="list-mb-6">
            <!-- Табы -->
            <v-tabs ref="tabs"
                    v-model="activeTab.main"
                    grow>
                <v-tab>Обо мне</v-tab>
                <v-tab>Мои отзывы</v-tab>
            </v-tabs>

            <!-- Табы: Контент -->
            <v-tabs-items v-model="activeTab.main"
                          touchless>
                <!-- Обо мне -->
                <v-tab-item>
                    <!-- Обо мне: Шапка -->
                    <div class="text-h5 mb-2">Всего отзывов</div>
                    <div class="text-h6 mb-6">{{ targetAllReviewsCount }}</div>

                    <v-divider class="my-6"/>

                    <!-- Обо мне: Табы -->
                    <v-tabs v-if="targetAllReviewsCount > 0"
                            v-model="activeTab.target"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Все</v-tab>
                        <v-tab>Я заказчик</v-tab>
                        <v-tab>Я исполнитель</v-tab>
                    </v-tabs>

                    <!-- Обо мне: Результаты -->
                    <v-tabs-items v-model="activeTab.target">
                        <!-- Обо мне: Все -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isRecipient: true }"
                                         :count.sync="targetAllReviewsCount"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12"
                                         no-result-message="У вас пока нет отзывов">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Обо мне: Я заказчик -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isRecipient: true, isTaskAuthor: true }"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Обо мне: Я исполнитель -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isRecipient: true, isTaskExecutor: true }"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Мои отзывы -->
                <v-tab-item>
                    <!-- Мои отзывы: Шапка -->
                    <div class="text-h5 mb-2">Всего отзывов</div>
                    <div class="text-h6 mb-6">{{ authorAllReviewsCount }}</div>

                    <v-divider class="my-6"/>

                    <!-- Мои отзывы: Табы -->
                    <v-tabs v-if="authorAllReviewsCount > 0"
                            v-model="activeTab.author"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Все</v-tab>
                        <v-tab>Я заказчик</v-tab>
                        <v-tab>Я исполнитель</v-tab>
                    </v-tabs>

                    <!-- Мои отзывы: Результаты -->
                    <v-tabs-items v-model="activeTab.author">
                        <!-- Мои отзывы: Все -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isReviewer: true }"
                                         :count.sync="authorAllReviewsCount"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12"
                                         no-result-message="Вы еще не оставили ни один отзыв">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Мои отзывы: Я заказчик -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isReviewer: true, isTaskAuthor: true }"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Мои отзывы: Я исполнитель -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ userId, isReviewer: true, isTaskExecutor: true }"
                                         :count-endings="countEndings"
                                         :item-type="$legacy.types.IntReview"
                                         item-col-width="12">
                                <template v-slot:item="{ item, index, length }">
                                    <review-card :value="item"/>
                                    <v-divider v-if="index < length - 1"
                                               class="mt-4 mt-lg-8"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppCatalog from '~/components/ui/AppCatalog';
    import ReviewCard from '~/components/ui/review/ReviewCard';

    export default {
        components: { ReviewCard, AppCatalog },
        mixins: [ meta ],
        data: () => ( {
            title: 'Отзывы',
            activeTab: {
                main: null,
                target: 0,
                author: 0,
            },
            url: '/api/getReviews/',
            targetAllReviewsCount: undefined,
            authorAllReviewsCount: undefined,
            countEndings: [ 'отзыв', 'отзыва', 'отзывов' ],
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
        },
    };
</script>