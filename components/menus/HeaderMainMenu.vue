<template>
    <v-list nav flat
            class="l-list l-list--horizontal list-mr-8">
        <v-list-item v-for="(item, index) in menu" :key="index"
                     :ripple="false"
                     nuxt :to="item.link"
                     class="text-button font-weight-bold pointer">
            <template v-if="item.submenu">
                <v-menu open-on-hover offset-y
                        bottom right origin="top right"
                        min-width="255" tile>
                    <template v-slot:activator="{ on }">
                        <span class="header-submenu-activator" v-on="on">
                            {{ item.text }}
                        </span>
                    </template>

                    <!-- Подменю -->
                    <v-list>
                        <v-list-item v-for="( submenuItem, submenuindex) in item.submenu" :key="submenuindex"
                                     nuxt :to="submenuItem.link" exact
                                     class="l-border bwb-1 text-subtitle-2">
                            {{ submenuItem.text }}
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template v-else>
                {{ item.text }}
            </template>
        </v-list-item>
    </v-list>
</template>

<script>
    export default {
        name: 'HeaderMainMenu',
        data: () => ( {
            menu: [
                { text: 'Создать задание', link: '/create-task/' },
                {
                    text: 'Задания',
                    link: '/tasks/filter/',
                    submenu: [
                        { text: 'Аренда транспорта', link: '/tasks/filter/category-is-remont/' },
                        { text: 'Выполнение работ', link: '/tasks/filter/category-is-vypolnenie-rabot/' },
                        { text: 'Предоставление услуг', link: '/tasks/filter/category-is-predostavlenie-uslug/' },
                        { text: 'Аренда имущества', link: '/tasks/filter/category-is-virtual-assistant/' },
                        { text: 'Аренда оборудования', link: '/tasks/filter/category-is-web-development/' },
                        { text: 'Купля-продажа', link: '/tasks/filter/category-is-kuplya-prodazha/' },
                        { text: 'Юридические услуги', link: '/tasks/filter/category-is-uridicheskie-uslugi/' },
                    ],
                },
                {
                    text: 'Исполнители',
                    link: '/executors/filter/',
                    submenu: [
                        { text: 'Аренда транспорта', link: '/executors/filter/category-is-remont/' },
                        { text: 'Выполнение работ', link: '/executors/filter/category-is-vypolnenie-rabot/' },
                        { text: 'Предоставление услуг', link: '/executors/filter/category-is-predostavlenie-uslug/' },
                        { text: 'Аренда имущества', link: '/executors/filter/category-is-virtual-assistant/' },
                        { text: 'Аренда оборудования', link: '/executors/filter/category-is-web-development/' },
                        { text: 'Купля-продажа', link: '/executors/filter/category-is-kuplya-prodazha/' },
                        { text: 'Юридические услуги', link: '/executors/filter/category-is-uridicheskie-uslugi/' },
                    ],
                },
                {
                    text: 'Вакансии и резюме',
                    link: '/vacancies-and-resumes/',
                    submenu: [
                        { text: 'Найти вакансию', link: '/find-work/filter/?type=vacancies' },
                        { text: 'Найти резюме', link: '/find-work/filter/?type=resumes' },
                        { text: 'Создать вакансию', link: '/create-work/?type=vacancies' },
                        { text: 'Создать резюме', link: '/create-work/?type=resumes' },
                    ],
                },
            ],
        } ),
    };
</script>

<style>
    .header-submenu-activator {
        display: flex;
        align-items: center;
        height: 64px;
    }
</style>
