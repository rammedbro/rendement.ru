<template>
    <v-stepper :value="stepper"
               class="transparent fill-height">
        <!-- Тулбар -->
        <app-toolbar v-if="selected.type"
                     v-show="stepper && stepper > 1"
                     fixed with-back-btn
                     :title="selected.type.toolbarTitle"
                     @click:back="back"
                     @click:close="backToStart"/>

        <!-- Шаги -->
        <v-stepper-items>
            <!-- Шаг 1 -->
            <v-stepper-content step="1"
                               class="white">
                <v-container>
                    <div class="text-h3 mb-4 mb-lg-16">Выберите категорию</div>

                    <!-- Десктоп -->
                    <v-row v-if="isDesktop">
                        <v-col cols="3">
                            <v-list nav flat
                                    class="list-mb-8">
                                <category-list-item v-for="item in types"
                                                    :key="item.code"
                                                    :value="item"
                                                    :link-params="{ 'type': item.code }"
                                                    class="text-h5 font-weight-bold"/>
                            </v-list>
                        </v-col>

                        <v-col>
                            <app-catalog v-for="type in types"
                                         v-show="type === selected.type"
                                         :key="type.code"
                                         :url="type.url"
                                         :item-type="$legacy.types.IntCategoryTree"
                                         invoke-after-reach
                                         scroll-pagination
                                         disable-count
                                         @update:cache="onCatalogCacheUpdate( $event, type )">
                                <template v-slot:items="{ items }">
                                    <v-list nav flat
                                            class="list-mb-4">
                                        <category-list-item v-for="item in items"
                                                            :key="item.code"
                                                            :value="item"
                                                            :link-params="{ type: type.code, category: item.code }"
                                                            class="text-subtitle-1"/>
                                    </v-list>
                                </template>
                            </app-catalog>
                        </v-col>
                    </v-row>

                    <!-- Мобайл -->
                    <v-list v-if="isMobile"
                            class="mx-n4">
                        <category-list-item v-for="item in types"
                                            :key="item.code"
                                            :value="item"
                                            :link-params="{ 'type': item.code }"
                                            mobile/>
                    </v-list>
                </v-container>

                <template v-if="meta.afterContent && selected.type">
                    <v-container fluid
                                 class="pt-auto"
                                 v-html="meta.afterContent"/>
                </template>
            </v-stepper-content>

            <!-- Шаг 2 -->
            <v-stepper-content step="2"
                               class="white">
                <!-- Мобайл -->
                <v-container v-if="isMobile">
                    <div class="text-h3 mb-4 mb-lg-8">Выберите подкатегорию</div>

                    <app-catalog v-for="type in types"
                                 v-show="type === selected.type"
                                 :key="type.code"
                                 :url="type.url"
                                 :item-type="$legacy.types.IntCategoryTree"
                                 invoke-after-reach
                                 scroll-pagination
                                 disable-count
                                 @update:cache="onCatalogCacheUpdate( $event, type )">
                        <template v-slot:items="{ items }">
                            <v-list class="mx-n4">
                                <category-list-item v-for="item in items"
                                                    :key="item.code"
                                                    :value="item"
                                                    :link-params="{ type: type.code, category: item.code }"
                                                    mobile/>
                            </v-list>
                        </template>
                    </app-catalog>
                </v-container>

                <template v-if="meta.afterContent && selected.type">
                    <v-container fluid
                                 class="pt-auto"
                                 v-html="meta.afterContent"/>
                </template>
            </v-stepper-content>

            <!-- Шаг 3 -->
            <v-stepper-content step="3">
                <v-container class="pa-0">
                    <v-row no-gutters>
                        <!-- Форма -->
                        <v-col v-if="selected.category"
                               cols="12" lg="7">
                            <v-container class="white elevation-1 pb-0">
                                <!-- Выбранная категория -->
                                <div class="text-h6 mb-6">Вы выбрали:</div>
                                <v-chip close
                                        class="mb-8"
                                        @click:close="backToStart">
                                    <div class="text-ellipsis">
                                        {{ selected.category.name }}
                                    </div>
                                </v-chip>

                                <!-- Форма создания задания -->
                                <component :is="selected.type.formComponent"
                                           :category-code="selected.category.code"
                                           @success="onSuccess"/>
                            </v-container>
                        </v-col>

                        <!-- Полезные ссылки -->
                        <v-col>
                            <v-container>
                                <app-useful-links theme="create-work"/>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
    import { meta } from '~/mixins/meta';

    import AppToolbar                      from '~/components/layout/AppToolbar';
    import AppUsefulLinks                  from '~/components/ui/AppUsefulLinks';
    import VacancyCrudForm                 from '~/components/ui/vacancy/VacancyCrudForm';
    import ResumeCrudForm                  from '~/components/ui/resume/ResumeCrudForm';
    import AppCatalog                      from '~/components/ui/AppCatalog';
    import CategoryListItem                from '~/components/ui/category/CategoryListItem';
    import { transformObjectToPlainArray } from '~/lib/classes/utility';

    export default {
        components: {
            CategoryListItem,
            AppCatalog,
            ResumeCrudForm,
            VacancyCrudForm,
            AppUsefulLinks,
            AppToolbar,
        },
        mixins: [ meta ],
        data: () => ( {
            types: [
                {
                    code: 'vacancies',
                    name: 'Вакансия',
                    categories: [],
                    url: '/api/vacancyCategories/',
                    toolbarTitle: 'Создание вакансии',
                    formComponent: 'vacancy-crud-form',
                },
                {
                    code: 'resumes',
                    name: 'Резюме',
                    categories: [],
                    url: '/api/resumeCategories/',
                    toolbarTitle: 'Создание резюме',
                    formComponent: 'resume-crud-form',
                },
            ],
            selected: {
                type: null,
                category: null,
            },
        } ),
        computed: {
            stepper: vm => {
                if ( vm.isDesktop ) {
                    return vm.selected.type && vm.selected.category ? 3 : 1;
                } else {
                    return vm.selected.type ? vm.selected.category ? 3 : 2 : 1;
                }
            },
        },
        watch: {
            $route( value ) {
                this.onPathChange( value );
            },
        },
        created() {
            this.onPathChange( this.$route );
        },
        methods: {
            back() {
                this.$router.go( -1 );
            },
            backToStart() {
                this.$router.push( this.$route.path );
            },
            onPathChange( path ) {
                const { type, category } = path.query;
                const { types, selected } = this;
                let result;

                selected.type = null;
                selected.category = null;

                if ( !type ) return;

                result = types.find( item => item.code === type );

                if ( !result ) return;

                selected.type = result;

                if ( !category ) return;

                const { categories } = selected.type;
                result = categories.find( item => item.code === category );

                if ( !result ) return;

                selected.category = result;
            },
            onCatalogCacheUpdate( value, type ) {
                type.categories = transformObjectToPlainArray( value );
                this.onPathChange( this.$route );
            },
            onSuccess( id ) {
                const { code } = this.selected.type;
                this.$router.push( `/${ code }/${ id }/` );
            },
        },
    };
</script>