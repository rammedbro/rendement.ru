<template>
    <div class="page">
        <!-- Первый экран: Главный -->
        <section class="h-fullscreen overflow-hidden position-relative white--text">
            <!-- Картинка -->
            <v-lazy>
                <v-img v-if="isMobile"
                       :src="require('~/assets/img/main/screen-1.jpg')"
                       class="absolute-full"/>

                <!-- Видео -->
                <video v-if="isDesktop"
                       autoplay loop muted
                       src="~/assets/video/main-page.mp4"
                       width="2560"
                       class="absolute-center">
                </video>
            </v-lazy>

            <!-- Оверлей -->
            <v-overlay absolute color="black" opacity="0.8"
                       class="bg-noise"/>

            <!-- Текст -->
            <v-container class="absolute-center list-mb-8">
                <v-row no-gutters>
                    <v-col cols="12" lg="8">
                        <div class="text-h3 text-lg-h1">
                            Поиск работы
                            и сотрудников
                            на нефтегазовых месторождениях
                        </div>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="auto">
                        <v-btn id="btn-101"
                               color="primary"
                               min-width="288"
                               to="/find-work/filter/?type=vacancies">
                            Найти работу
                        </v-btn>
                    </v-col>

                    <v-col cols="auto">
                        <v-btn id="btn-301"
                               color="white"
                               nuxt to="/find-work/filter/?type=resumes"
                               min-width="288" outlined>
                            Найти сотрудника
                        </v-btn>
                    </v-col>
                </v-row>
                <br>

                <nuxt-link to="/about/" class="link white--text">
                    Подробнее о сервисе
                </nuxt-link>
            </v-container>
        </section>

        <!-- Преимущества -->
        <section class="features text-center">
            <v-container>
                <v-row>
                    <v-col v-for="(item, index) in features" :key="index"
                           cols="12" lg="4">
                        <svg-icon :name="item.svg" width="64" height="84"
                                  class="ds-elevation-24 mb-4"/>
                        <div class="text-h6 mb-4" v-html="item.title"></div>
                        <div class="text-subtitle-2">
                            {{ item.desc }}
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Третий экран: Гайды для соискателя/работодателя  -->
        <section class="py-lg-8 white text-center">
            <v-container>
                <!-- Табы -->
                <v-row no-gutters justify="center">
                    <v-col cols="auto">
                        <v-tabs v-model="activeTab.screen3"
                                class="mb-4 mb-lg-8">
                            <v-tab>Соискателям</v-tab>
                            <v-tab>Работодателям</v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>

                <!-- Табы: Контент -->
                <v-tabs-items v-model="activeTab.screen3"
                              touchless>
                    <!-- Соискателям -->
                    <v-tab-item>
                        <div class="text-h3 mb-4 mb-lg-8">Как найти работу?</div>

                        <div class="text-subtitle-2">
                            Три простых шага для того, чтобы ваша задача была решена
                        </div>

                        <v-row>
                            <v-col v-for="(item, index) in screen3.taskAuthor" :key="index"
                                   cols="12" md="4">
                                <v-img :src="require(`~/assets/${ item.img }`)"
                                       lazy-src="/images/no-img-placeholder.png"
                                       width="233" height="233"
                                       class="mx-auto mb-8"/>
                                <div class="text-h6 mb-6">{{ item.title }}</div>
                                <div class="text-subtitle-2">{{ item.subtitle }}</div>
                            </v-col>
                        </v-row>

                        <v-btn id="btn-102"
                               color="primary"
                               min-width="288"
                               to="/find-work/filter/?type=vacancies"
                               class="mt-12 mt-md-16">
                            Найти работу
                        </v-btn>
                    </v-tab-item>

                    <!-- Работодателям -->
                    <v-tab-item>
                        <div class="text-h3 mb-4 mb-lg-8">Как найти сотрудника?</div>

                        <div class="text-subtitle-2">
                            Три простых шага для того, чтобы ваша задача была решена
                        </div>

                        <v-row>
                            <v-col v-for="(item, index) in screen3.taskExecutor" :key="index"
                                   cols="12" md="4">
                                <v-img :src="require(`~/assets/${ item.img }`)"
                                       lazy-src="/images/no-img-placeholder.png"
                                       width="233" height="233"
                                       class="mx-auto mb-8"/>
                                <div class="text-h6 mb-6">{{ item.title }}</div>
                                <div class="text-subtitle-2">{{ item.subtitle }}</div>
                            </v-col>
                        </v-row>

                        <v-btn v-if="!userIsExecutor"
                               id="btn-103"
                               color="primary"
                               min-width="288"
                               class="mt-12 mt-md-16"
                               to="/find-work/filter/?type=resumes">
                            Найти сотрудника
                        </v-btn>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
        </section>

        <!-- Новые вакансии -->
        <section v-show="activeTab.screen3 === 0" class="py-lg-8">
            <v-container>
                <div class="text-h3 mb-4 mb-lg-8 text-center">
                    Кого ищут прямо сейчас
                </div>

                <v-row>
                    <!-- Задания -->
                    <v-col cols="12"
                           order="1">
                        <app-catalog url="/api/getVacancies/"
                                     :limit="6"
                                     :item-type="$legacy.types.IntVacancyPreview"
                                     invoke-after-reach
                                     disable-count
                                     disable-pagination>
                            <!-- Десктоп -->
                            <template v-if="isDesktop"
                                      v-slot:item="{ item }">
                                <vacancy-card-preview :value="item"/>
                            </template>

                            <!-- Мобилка -->
                            <template v-if="isMobile"
                                      v-slot:items="{ items }">
                                <!-- Слайдер -->
                                <app-slider :items="items"
                                            :options="{ autoWidth: true }">
                                    <template v-slot:item="{ item }">
                                        <vacancy-card-preview :value="item"/>
                                    </template>
                                </app-slider>
                            </template>
                        </app-catalog>
                    </v-col>

                    <!-- Кнопка "Все задания" -->
                    <v-col cols="12"
                           order="2" order-lg="3"
                           class="text-center">
                        <v-btn color="primary"
                               outlined min-width="288"
                               to="/find-work/filter/?type=vacancies">
                            Все вакансии
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Новые резюме -->
        <section v-show="activeTab.screen3 === 1" class="py-lg-8">
            <v-container>
                <div class="text-h3 mb-4 mb-lg-8 text-center">
                    Ищут работу прямо сейчас
                </div>

                <v-row>
                    <!-- Задания -->
                    <v-col cols="12"
                           order="1">
                        <app-catalog url="/api/getResumes/"
                                     :limit="6"
                                     :item-type="$legacy.types.IntResumePreview"
                                     invoke-after-reach
                                     disable-count
                                     disable-pagination>
                            <!-- Десктоп -->
                            <template v-if="isDesktop"
                                      v-slot:item="{ item }">
                                <resume-card-preview :value="item"/>
                            </template>

                            <!-- Мобилка -->
                            <template v-if="isMobile"
                                      v-slot:items="{ items }">
                                <!-- Слайдер -->
                                <app-slider :items="items"
                                            :options="{ autoWidth: true }">
                                    <template v-slot:item="{ item }">
                                        <resume-card-preview :value="item"/>
                                    </template>
                                </app-slider>
                            </template>
                        </app-catalog>
                    </v-col>

                    <!-- Кнопка "Все задания" -->
                    <v-col cols="12"
                           order="2" order-lg="3"
                           class="text-center">
                        <v-btn color="primary"
                               outlined min-width="288"
                               to="/find-work/filter/?type=resumes">
                            Все резюме
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Шестой экран: Ответы на частые вопросы  -->
        <section class="py-lg-8">
            <v-container>
                <div class="text-h3 mb-4 mb-lg-8 text-center">
                    Ответы на частые вопросы
                </div>

                <v-row>
                    <!-- Аккордион -->
                    <v-col cols="12" md="8">
                        <app-catalog url="/api/getSectionItems/"
                                     :filter="{ showOnLanding: true }"
                                     :item-type="$legacy.types.IntSectionItem"
                                     :request-params="{ path: '/faq/', tree: false }"
                                     scroll-pagination
                                     invoke-after-reach
                                     disable-count>
                            <template v-slot:items="{ items: sections }">
                                <v-expansion-panels accordion multiple
                                                    class="list-mb-2">
                                    <template v-for="section in sections">
                                        <v-expansion-panel v-for="( item, index ) in section.items"
                                                           :key="`${ section.url }-${ index }`">
                                            <!-- Заголовок -->
                                            <v-expansion-panel-header hide-actions>
                                                <template v-slot:default="{ open }">
                                                    <div class="text-subtitle-2"
                                                         :class="{ 'primary--text': open }">
                                                        {{ item.title }}
                                                    </div>

                                                    <v-icon class="v-expansion-panel-header__icon"
                                                            :class="{ 'primary--text': open }">
                                                        {{ open ? 'mdi-minus' : 'mdi-plus' }}
                                                    </v-icon>
                                                </template>
                                            </v-expansion-panel-header>

                                            <!-- Контент -->
                                            <v-expansion-panel-content>
                                                <div class="text-body-2" v-html="item.body"></div>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </template>
                                </v-expansion-panels>
                            </template>
                        </app-catalog>
                    </v-col>

                    <!-- Блок "Не нашли ответ?" -->
                    <v-col>
                        <v-card elevation="0"
                                class="light-blue lighten-5">
                            <v-container>
                                <div class="text-h5 mb-4 light-blue--text text--lighten-2">
                                    Не нашли ответ?
                                </div>

                                Вы можете перейти в раздел
                                <nuxt-link to="/faq/">Помощь</nuxt-link>
                                для поиска.
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import { meta }           from '~/mixins/meta';
    import AppCatalog         from '~/components/ui/AppCatalog';
    import AppSlider          from '~/components/ui/AppSlider';
    import VacancyCardPreview from '~/components/ui/vacancy/VacancyCardPreview';
    import ResumeCardPreview  from '~/components/ui/resume/ResumeCardPreview';

    export default {
        components: { AppSlider, VacancyCardPreview, ResumeCardPreview, AppCatalog },
        mixins: [ meta ],
        data: () => ( {
            activeTab: {
                screen3: 0,
            },
            features: [
                {
                    svg: 'drop-people',
                    title: `Бесплатный доступ <br> к базе резюме и вакансий`,
                    desc: 'Мы ведем активную рекламную компанию по привлечению на сервис профильных специалистов. И предоставляем возможность пользоваться всеми услугами сайта абсолютно бесплатно',
                },
                {
                    svg: 'drop-save-time',
                    title: `Автоматическая система оповещений`,
                    desc: 'Разместите вакансию или резюме, и сервис автоматически оповестит вас о появлении новой работы или подходящих сотрудников',
                },
                {
                    svg: 'drop-money',
                    title: `Надежность <br> и безопасность`,
                    desc: 'Администрация сервиса проверяет и контролирует достоверность размещенной пользователями информации',
                },
            ],
            screen3: {
                taskAuthor: [
                    {
                        img: 'img/main/screen-3-tab-1-step-2.png',
                        title: 'Используйте поиск',
                        subtitle: 'Ищите идеальную работу на интересующих месторождениях',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-1.png',
                        title: 'Публикуйте резюме',
                        subtitle: 'Собирайте отклики и приглашения от работодателей или отправляйте сами ',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-3.png',
                        title: 'Получайте результат',
                        subtitle: 'Сравните всех, кто откликнулся и выберите подходящую работу',
                    },
                ],
                taskExecutor: [
                    {
                        img: 'img/main/screen-3-tab-1-step-2.png',
                        title: 'Используйте поиск',
                        subtitle: 'Ищите необходимых сотрудников по заданным параметрам',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-1.png',
                        title: 'Публикуйте вакансии',
                        subtitle: 'Собирайте отклики и приглашайте подходящих кандидатов на собеседование ',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-3.png',
                        title: 'Получайте результат',
                        subtitle: 'Сравните всех, кто откликнулся и выберите лучшего кандидата',
                    },
                ],
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin', 'userIsExecutor' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onBecomeExecutorBtnClick() {
                if ( !this.userIsLogin ) {
                    this.showAppDialog( 'auth' );
                } else if ( !this.userIsExecutor ) {
                    this.showAppDialog( 'becomeExecutor' );
                }
            },
        },
    };
</script>
