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
                <div class="text-h3 text-lg-h1">
                    Портал для поиска исполнителей и заказчиков услуг
                    на нефтегазовых месторождениях
                </div>

                <div class="text-h6 mb-8 mb-lg-12">
                    Ускоряем процессы, экономим бюджет
                </div>

                <v-row>
                    <v-col cols="auto">
                        <v-btn id="btn-101"
                               color="primary"
                               min-width="288"
                               to="/create-task/">
                            Создать задание
                        </v-btn>
                    </v-col>

                    <v-col cols="auto">
                        <v-badge color="red" content="NEW"
                                 left offset-x="100%"
                                 offset-y="10px">
                            <v-btn id="btn-301"
                                   color="white"
                                   nuxt to="/vacancies-and-resumes/"
                                   min-width="288" outlined>
                                Вакансии и резюме
                            </v-btn>
                        </v-badge>
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
                           cols="6" md="3">
                        <svg-icon :name="item.svg" width="64" height="84"
                                  class="ds-elevation-24 mb-4"/>
                        <div class="text-subtitle-2" v-html="item.html"></div>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Youtube-ролик -->
        <section class="py-lg-8">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" lg="8">
                        <v-lazy>
                            <lazy-youtube-video src="https://www.youtube.com/embed/SPGkfvKtmGc"
                                                preview-image-size="hqdefault" autoplay/>
                        </v-lazy>
                    </v-col>
                </v-row>
            </v-container>
        </section>

        <!-- Второй экран: Категории -->
        <section class="py-lg-8">
            <v-container>
                <div class="text-h3 mb-4 mb-lg-8 text-center">
                    Каталог исполнителей
                </div>

                <div class="text-subtitle-2 text-center mb-4 mb-lg-8">
                    Выберите категорию, чтобы найти нужного исполнителя
                </div>

                <app-catalog url="/api/categories/"
                             :filter="{ showOnIndex: true }"
                             :item-type="$legacy.types.IntCategoryTree"
                             item-key-prop="code"
                             :item-col-width="{ cols: 12, sm: 6, lg: 4 }"
                             scroll-pagination
                             invoke-after-reach
                             disable-count>
                    <template v-slot:item="{ item }">
                        <category-card :value="item"
                                       section="executors"
                                       class="h-100"/>
                    </template>
                </app-catalog>
            </v-container>
        </section>

        <!-- Третий экран: Гайды для заказчика/исполнителя  -->
        <section class="py-lg-8 white text-center">
            <v-container>
                <!-- Табы -->
                <v-row no-gutters justify="center">
                    <v-col cols="auto">
                        <v-tabs v-model="activeTab.screen3"
                                class="mb-4 mb-lg-8">
                            <v-tab>Заказчикам</v-tab>
                            <v-tab>Исполнителям</v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>

                <!-- Табы: Контент -->
                <v-tabs-items v-model="activeTab.screen3"
                              touchless>
                    <!-- Заказчикам -->
                    <v-tab-item>
                        <div class="text-h3 mb-4 mb-lg-8">Как найти исполнителя?</div>

                        <div class="text-subtitle-2">
                            Три простых шага, чтобы задача была решена:
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
                               to="/create-task/"
                               class="mt-12 mt-md-16">
                            Создать задание
                        </v-btn>
                    </v-tab-item>

                    <!-- Исполнителям -->
                    <v-tab-item>
                        <div class="text-h3 mb-4 mb-lg-8">Хотите выполнять задания?</div>

                        <div class="text-subtitle-2">
                            Три простых шага, чтобы начать зарабатывать:
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
                               @click="onBecomeExecutorBtnClick">
                            Стать исполнителем
                        </v-btn>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
        </section>

        <!-- Четвертый экран: Кому мы будем полезны  -->
        <section class="position-relative text-center white--text">
            <v-container class="pt-lg-16 absolute-top">
                <v-row justify="center">
                    <v-col cols="12"
                           md="10" lg="8" xl="6">
                        <div class="text-h3 mb-4 mb-lg-8 text-center">
                            Мы точно будем полезны
                        </div>

                        <!-- Табы -->
                        <v-tabs v-model="activeTab.screen4"
                                dark hide-slider center-active
                                class="l-tabs--chips"
                                :class="{ 'l-tabs--no-overflow': $vuetify.breakpoint.mdAndUp }">
                            <v-row dense justify="center">
                                <v-col v-for="(item, index) in screen4" :key="index"
                                       cols="auto">
                                    <v-tab class="ma-0">
                                        {{ item.tab }}
                                    </v-tab>
                                </v-col>
                            </v-row>
                        </v-tabs>
                    </v-col>
                </v-row>
            </v-container>

            <!-- Табы: Контент -->
            <v-tabs-items v-model="activeTab.screen4">
                <v-tab-item v-for="(item, index) in screen4" :key="index"
                            class="screen-4-tab-item">
                    <!-- Фоновая картинка -->
                    <v-img :src="require(`~/assets/${ item.img }`)"
                           lazy-src="/images/no-img-placeholder.png"
                           height="568">
                        <!-- Оверлэй -->
                        <v-overlay absolute color="black" opacity="0.8"
                                   class="bg-noise"/>
                    </v-img>

                    <!-- Текст -->
                    <v-container class="pb-lg-16 absolute-bottom">
                        <v-row justify="center">
                            <v-col cols="12"
                                   md="10" lg="8" xl="6">
                                <div class="text-h6">
                                    {{ item.text }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
            </v-tabs-items>
        </section>

        <!-- Пятый экран: Новые задания -->
        <section class="py-lg-8">
            <v-container>
                <div class="text-h3 mb-4 mb-lg-8 text-center">
                    Что заказывают прямо сейчас
                </div>

                <v-row>
                    <!-- Задания -->
                    <v-col cols="12" lg="8"
                           order="1">
                        <app-catalog url="/api/getTasks/"
                                     :limit="4"
                                     :item-type="$legacy.types.IntTaskPreview"
                                     invoke-after-reach
                                     disable-count
                                     disable-pagination>
                            <!-- Десктоп -->
                            <template v-if="isDesktop"
                                      v-slot:item="{ item }">
                                <task-card-preview :value="item"/>
                            </template>

                            <!-- Мобилка -->
                            <template v-if="isMobile"
                                      v-slot:items="{ items }">
                                <!-- Слайдер -->
                                <app-slider :items="items"
                                            :options="{ autoWidth: true }">
                                    <template v-slot:item="{ item }">
                                        <task-card-preview :value="item"/>
                                    </template>
                                </app-slider>
                            </template>
                        </app-catalog>
                    </v-col>

                    <!-- Блок "Начни зарабатывать уже сейчас" -->
                    <v-col cols="12" lg="4"
                           order="3" order-lg="2">
                        <v-card elevation="0"
                                class="light-blue lighten-5 text-center">
                            <v-container>
                                <div class="text-h5 light-blue--text text--lighten-2 mb-8">
                                    Начни зарабатывать уже сейчас
                                </div>

                                <!-- Шаги -->
                                <v-row>
                                    <v-col cols="12" sm lg="12">
                                        <div class="step-number">1</div>

                                        <div class="text-subtitle-2">
                                            <span v-if="!userIsLogin"
                                                  class="link"
                                                  @click="showAppDialog('registration')">
                                                Зарегистрируйся
                                            </span>
                                            <template v-else>Зарегистрируйся</template>
                                            на сервисе и заполни профиль
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm lg="12">
                                        <div class="step-number">2</div>

                                        <div class="text-subtitle-2">
                                            Откликнись на понравившееся задание
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm lg="12">
                                        <div class="step-number">3</div>

                                        <div class="text-subtitle-2">
                                            Получи оплату сразу же после выполнения задания
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>

                    <!-- Кнопка "Все задания" -->
                    <v-col cols="12"
                           order="2" order-lg="3"
                           class="text-center">
                        <v-btn id="btn-104"
                               color="primary"
                               outlined min-width="288"
                               to="/tasks/filter/">
                            Все задания
                        </v-btn>
                    </v-col>
                </v-row>

                <!-- Блок "Поделитесь мнением" -->
                <div class="white elevation-1 text-center mt-8">
                    <v-row>
                        <v-col cols="12" lg="8">
                            <v-container class="container--dense">
                                <v-row align="center"
                                       justify="center">
                                    <v-col cols="12" lg="2">
                                        <v-img :src="require( '~/assets/img/logo-icon.png' )"
                                               height="66" width="100%"
                                               contain/>
                                    </v-col>

                                    <v-col>
                                        <div class="text-h6 text-lg-left">
                                            Поделитесь мнением о качестве работы сервиса
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>

                        <v-col class="position-relative pa-12 pa-lg-4">
                            <div class="light-blue lighten-5 absolute-full mx-2 mx-lg-4">
                                <v-btn color="primary" rounded outlined
                                       x-small width="200"
                                       href="https://forms.gle/WtBQCHqYRcRj8Xf49"
                                       target="_blank"
                                       class="absolute-center">
                                    Пройти опрос
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </div>
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
                                     :filter="{ showOnIndex: true }"
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
                                            <v-expansion-panel-content eager>
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

    import { meta }        from '~/mixins/meta';
    import AppCatalog      from '~/components/ui/AppCatalog';
    import AppSlider       from '~/components/ui/AppSlider';
    import TaskCardPreview from '~/components/ui/task/TaskCardPreview';
    import CategoryCard    from '~/components/ui/category/CategoryCard';

    export default {
        components: { CategoryCard, AppSlider, TaskCardPreview, AppCatalog },
        mixins: [ meta ],
        data: () => ( {
            activeTab: {
                screen3: 0,
                screen4: 0,
            },
            features: [
                { svg: 'drop-people', html: `Большая база<br> исполнителей` },
                { svg: 'drop-safe-deal', html: 'Оплата через<br> безопасную сделку' },
                { svg: 'drop-money', html: 'Дополнительный<br> заработок' },
                { svg: 'drop-save-time', html: 'Экономия<br> времени и денег' },
            ],
            screen3: {
                taskAuthor: [
                    {
                        img: 'img/main/screen-3-tab-1-step-1.png',
                        title: 'Создайте задание',
                        subtitle: 'Опишите задачу, мы оповестим всех, кто подходит вам по заданным категориям',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-2.png',
                        title: 'Выберите исполнителя',
                        subtitle: 'Сравните претендентов по цене или рейтингу. Выберите подходящего',
                    },
                    {
                        img: 'img/main/screen-3-tab-1-step-3.png',
                        title: 'Получите результат',
                        subtitle: 'Оплата за услуги сайта и выполнение задания взимается только по итогу исполненной работы',
                    },
                ],
                taskExecutor: [
                    {
                        img: 'img/main/screen-3-tab-2-step-1.png',
                        title: 'Пройдите регистрацию',
                        subtitle: 'Заполните профиль. Чем больше вы укажете достоверных данных, тем быстрее получите работу',
                    },
                    {
                        img: 'img/main/screen-3-tab-2-step-2.png',
                        title: 'Выберите задание',
                        subtitle: 'Делайте отклик на задание и выполняйте его',
                    },
                    {
                        img: 'img/main/screen-3-tab-2-step-3.png',
                        title: 'Получите результат',
                        subtitle: 'После завершения получите отплату от заказчика',
                    },
                ],
            },
            screen4: [
                {
                    img: 'img/main/screen-4-tab-1.jpg',
                    tab: 'Главным механикам',
                    text: 'Дополнительный заработок на парке строительной и транспортной техники',
                },
                {
                    img: 'img/main/screen-4-tab-2.jpg',
                    tab: 'Водителям',
                    text: 'Дополнительная подработка в свободное от основной работы время',
                },
                {
                    img: 'img/main/screen-4-tab-3.jpg',
                    tab: 'Покупателям и продавцам',
                    text: 'При реализации и приобретении необходимых материалов, оборудования и техники',
                },
                {
                    img: 'img/main/screen-4-tab-4.jpg',
                    tab: 'Заказчикам перевозки',
                    text: 'Поиск необходимой транспортной техники для перевозки грузов',
                },
                {
                    img: 'img/main/screen-4-tab-5.jpg',
                    tab: 'Руководителям проектов',
                    text: 'Поиск персонала, малых субподрядных организаций, аренда или купля - продажа имущества',
                },
            ],
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
