<template>
    <div class="page">
        <v-container>
            <h1 class="text-h3">{{ h1 }}</h1>
        </v-container>

        <!-- Первый экран: Почему пользователи выбирают -->
        <section class="white text-center py-lg-8">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" lg="6">
                        <div class="text-h5 mb-12">
                            Почему пользователи выбирают сервис Rendement
                        </div>
                    </v-col>
                </v-row>

                <v-tabs v-model="activeTab.screen1"
                        hide-slider center-active
                        class="l-tabs--chips mb-8">
                    <v-row dense justify="center">
                        <v-col v-for="(item, index) in screen1" :key="index"
                               cols="auto">
                            <v-tab class="ma-0">{{ item.tab }}</v-tab>
                        </v-col>
                    </v-row>
                </v-tabs>

                <v-tabs-items v-model="activeTab.screen1"
                              class="mb-8">
                    <v-tab-item v-for="(item, index) in screen1" :key="index">
                        <v-row justify="center">
                            <v-col cols="12" md="8" xl="6">
                                <div class="text-subtitle-2 mb-8">
                                    {{ item.text }}
                                </div>
                            </v-col>
                        </v-row>

                        <v-row justify="center">
                            <v-col v-for="(feature, featureIndex) in item.features"
                                   :key="featureIndex"
                                   cols="auto" sm="4">
                                <svg-icon :name="feature.svg"
                                          width="32" height="32" class="mb-4"/>
                                <div class="text-subtitle-2">{{ feature.text }}</div>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
        </section>

        <!-- Второй экран: О компании -->
        <section>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6">
                        <p class="text-subtitle-1">
                            Отработав более 15 лет в качестве подрядчика
                            по обустройству нефтяных, газовых и нефтегазоконденсатных месторождений в ЯНАО и ХМАО, наша
                            команда приобрела большой опыт в организации производства работ в данной сфере.
                        </p>

                        <p>
                            Нами был накоплен опыт работы по взаимодействию с другими подрядными организациями,
                            работающими на месторождениях.
                        </p>

                        <p>
                            Результатом систематизации знаний и анализа проблем, возникающих при обустройстве или
                            разработке месторождений, стало создание портала услуг - Rendement. Цель которого помочь
                            оперативно решать возникающие проблемы по поиску организаций, предоставляющих сервисные
                            услуги внутри месторождений, помочь с поиском исполнителей для ваших задач.
                        </p>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script>
    import { meta } from '~/mixins/meta';

    export default {
        mixins: [ meta ],
        data: () => ( {
            title: 'О компании',
            activeTab: {
                screen1: 0,
            },
            screen1: [
                {
                    tab: 'Быстро',
                    text:
                        'Кандидаты уже находятся на месторождениях, значит, вам не придется тратить время и деньги ' +
                        'на оформление пропусков, заниматься перебазировкой техники с места на место, искать ' +
                        'попутный транспорт.',
                    features: [
                        {
                            svg: 'timer',
                            text: 'Вы найдете исполнителя для выполнения задания в кратчайшие сроки.',
                        },
                        {
                            svg: 'map',
                            text:
                                'Вы получаете квалифицированного исполнителя и технику, которые ждут задания ' +
                                'в нужном вам месте.',
                        },
                        {
                            svg: 'power-button',
                            text: 'Исполнители готовы приступить к работе в день получения заказа.',
                        },
                    ],
                },
                {
                    tab: 'Надежно',
                    text: 'Пользуйтесь только достоверной информацией',
                    features: [
                        {
                            svg: 'person',
                            text: 'Все личные данные, указанные в профилях исполнителей и заказчиков, проверяются.',
                        },
                        {
                            svg: 'safe-deal',
                            text: 'Все денежные операции, ведущиеся на сайте, защищены.',
                        },
                    ],
                },
                {
                    tab: 'Выгодно',
                    text:
                        'Заказчику не придется тратить время на просмотр сайтов с предложениями услуг и ' +
                        'звонки кандидатам, а потом платить за плохую работу.',
                    features: [
                        {
                            svg: 'save-time',
                            text: 'Исполнитель не тратит время на поиск работы и продвижение себя',
                        },
                        {
                            svg: 'secure-payments',
                            text: 'Мы взимаем плату только по итогу качественного исполнения заказа',
                        },
                        {
                            svg: 'money',
                            text: 'Вы зарабатываете на собственном профессионализме!',
                        },
                    ],
                },
            ],
        } ),
    };
</script>

<style scoped lang="scss">
    .page {
        section:nth-child(3) {
            background: url("~assets/img/contacts-bg.png") no-repeat center left;

            @include media-breakpoint-up(md) {
                background-position: center right 32px;
            }

            @include media-breakpoint-up(lg) {
                background-position: bottom 32px right 32px;
            }
        }
    }
</style>