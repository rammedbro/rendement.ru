<template>
    <app-drawer :value="appMainMenuDrawerDisplay"
                @input="onInput">
        <v-list class="mb-4">
            <v-list-item v-for="(item, index) in menuPrimary" :key="index"
                         :nuxt="!item.submenu" :to="!item.submenu ? item.link : undefined"
                         class="text-subtitle-1 l-border bwb-1">

                <template v-if="item.submenu">
                    <v-expansion-panels v-model="submenuPanel[index]" class="submenu-panel"
                                        accordion flat>
                        <v-expansion-panel>
                            <!-- Заголовок -->
                            <v-expansion-panel-header hide-actions>
                                <template v-slot:default="{ open }">
                                    <div v-if="item.submenu"
                                         @click.stop="hideAppDrawer('mainMenu')">
                                        <nuxt-link :to="item.link"
                                                   class="text-subtitle-1 text--primary text-decoration-none">
                                            {{ item.text }}
                                        </nuxt-link>
                                    </div>
                                    <span v-else class="text-subtitle-1">
                                        {{ item.text }}
                                    </span>

                                    <v-icon class="v-expansion-panel-header__icon pa-2 ma-n2"
                                            :class="{ 'primary--text': open }">
                                        {{ open ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                    </v-icon>
                                </template>
                            </v-expansion-panel-header>

                            <!-- Контент -->
                            <v-expansion-panel-content>
                                <v-list>
                                    <v-list-item v-for="( submenuItem, submenuIndex ) in item.submenu" :key="submenuIndex"
                                                 nuxt :to="submenuItem.link"
                                                 exact class="text-subtitle-2"
                                                 @click="hideAppDrawer('mainMenu')">
                                        {{ submenuItem.text }}
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>

                <template v-else>
                    <span @click="hideAppDrawer('mainMenu')">
                        {{ item.text }}
                    </span>
                </template>

            </v-list-item>
        </v-list>

        <v-list class="grey--text text--lighten-1">
            <v-list-item v-for="item in menuSecondary" :key="item.id"
                         nuxt :to="item.link"
                         class="text-subtitle-2"
                         @click="hideAppDrawer('mainMenu')">
                {{ item.text }}
            </v-list-item>
        </v-list>
    </app-drawer>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppDrawer from '~/components/drawers/AppDrawer';

    export default {
        name: 'MainMenuDrawer',
        components: { AppDrawer },
        data: () => ( {
            submenuPanel: [0, 1, 1, 0],
            menuPrimary: [
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
            menuSecondary: [
                { text: 'О компании', link: '/about/' },
                { text: 'Как стать исполнителем', link: '/become-executor/' },
                { text: 'Часто задаваемые вопросы', link: '/faq/' },
                { text: 'Контакты', link: '/contacts/' },
            ],
        } ),
        computed: {
            ...mapGetters( 'ui', [ 'appMainMenuDrawerDisplay' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDrawer', 'hideAppDrawer' ] ),
            onInput( value ) {
                value ? this.showAppDrawer( 'mainMenu' ) : this.hideAppDrawer( 'mainMenu' );
            },
        },
    };
</script>

<style lang="scss">
    .submenu-panel {
        .v-expansion-panel .v-expansion-panel-header {
            min-height: auto;
            padding: 0;
        }

        .v-expansion-panel-content__wrap {
            padding-bottom: 0;
        }
    }
</style>
