<template>
    <v-stepper :value="stepper"
               class="transparent fill-height">
        <!-- Тулбар -->
        <app-toolbar v-show="stepper && stepper > 1"
                     fixed with-back-btn
                     title="Создание задания"
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
                    <app-catalog url="/api/categories/"
                                 :item-type="$legacy.types.IntCategoryTree"
                                 scroll-pagination
                                 disable-count
                                 @update:cache="onCatalogCacheUpdate">
                        <template v-slot:items="{ items }">
                            <v-row v-if="isDesktop">
                                <v-col cols="4">
                                    <v-list nav flat
                                            class="list-mb-8">
                                        <category-list-item v-for="item in items"
                                                            :key="item.code"
                                                            :value="item"
                                                            :link-params="{ category: item.code }"
                                                            class="text-h5 font-weight-bold"/>
                                    </v-list>
                                </v-col>

                                <v-col>
                                    <v-list v-for="category in categories"
                                            v-show="category === selected.category"
                                            :key="category.code"
                                            nav flat
                                            class="list-mb-4">
                                        <category-list-item v-for="item in category.subCategories"
                                                            :key="item.id"
                                                            :value="item"
                                                            :link-params="{ category: category.code, subcategory: item.id }"
                                                            class="text-subtitle-1"/>
                                    </v-list>
                                </v-col>
                            </v-row>

                            <!-- Мобайл -->
                            <v-list v-if="isMobile"
                                    class="mx-n4">
                                <category-list-item v-for="item in items"
                                                    :key="item.code"
                                                    :value="item"
                                                    :link-params="{ category: item.code }"
                                                    mobile/>
                            </v-list>
                        </template>
                    </app-catalog>
                </v-container>

                <template v-if="meta.afterContent && selected.category === null">
                    <v-container fluid
                                 class="pt-0"
                                 v-html="meta.afterContent"/>
                </template>
            </v-stepper-content>

            <!-- Шаг 2 -->
            <v-stepper-content step="2"
                               class="white">
                <!-- Мобайл -->
                <v-container v-if="isMobile"
                             class="h-fill">
                    <div class="text-h3 mb-4 mb-lg-8">Выберите подкатегорию</div>

                    <v-list v-for="category in categories"
                            v-show="category === selected.category"
                            :key="category.code"
                            class="mx-n4">
                        <category-list-item v-for="item in category.subCategories"
                                            :key="item.id"
                                            :value="item"
                                            :link-params="{ category: category.code, subcategory: item.id }"
                                            mobile/>
                    </v-list>
                </v-container>
            </v-stepper-content>

            <!-- Шаг 3 -->
            <v-stepper-content step="3">
                <v-container class="pa-0">
                    <v-row no-gutters>
                        <!-- Форма -->
                        <v-col v-if="selected.subCategory"
                               cols="12" lg="7">
                            <v-container class="white elevation-1 pb-0">
                                <!-- Выбранная категория -->
                                <div class="text-h6 mb-6">Вы выбрали:</div>
                                <v-chip close
                                        class="mb-8"
                                        @click:close="backToStart">
                                    <div class="text-ellipsis">
                                        {{ selected.category.name }} - {{ selected.subCategory.name }}
                                    </div>
                                </v-chip>

                                <!-- Форма создания задания -->
                                <task-crud-form :category-code="selected.category.code"
                                                :sub-category-id="selected.subCategory.id"
                                                @success="onSuccess"/>
                            </v-container>
                        </v-col>

                        <!-- Полезные ссылки -->
                        <v-col>
                            <v-container>
                                <app-useful-links theme="create-task"/>
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
    import TaskCrudForm                    from '~/components/ui/task/TaskCrudForm';
    import AppCatalog                      from '~/components/ui/AppCatalog';
    import CategoryListItem                from '~/components/ui/category/CategoryListItem';
    import { transformObjectToPlainArray } from '~/lib/classes/utility';

    export default {
        components: {
            CategoryListItem,
            AppCatalog,
            TaskCrudForm,
            AppUsefulLinks,
            AppToolbar,
        },
        mixins: [ meta ],
        data: () => ( {
            categories: [],
            selected: {
                category: undefined,
                subCategory: undefined,
            },
        } ),
        computed: {
            stepper: vm => {
                if ( vm.isDesktop ) {
                    return vm.selected.category && vm.selected.subCategory ? 3 : 1;
                } else {
                    return vm.selected.category ? vm.selected.subCategory ? 3 : 2 : 1;
                }
            },
        },
        watch: {
            $route( value ) {
                this.onPathChange( value );
            },
        },
        methods: {
            back() {
                this.$router.go( -1 );
            },
            backToStart() {
                this.$router.push( this.$route.path );
            },
            onPathChange( path ) {
                const { category, subcategory } = path.query;
                const { categories, selected } = this;
                let result;

                selected.category = null;
                selected.subCategory = null;

                if ( !category ) return;

                result = categories.find( item => item.code === category );

                if ( !result ) return;

                selected.category = result;

                if ( !subcategory ) return;

                const { subCategories } = selected.category;
                result = subCategories.find( item => item.id === +subcategory );

                if ( !result ) return;

                selected.subCategory = result;
            },
            onCatalogCacheUpdate( value ) {
                this.categories = transformObjectToPlainArray( value );
                this.onPathChange( this.$route );
            },
            onSuccess( id ) {
                this.$router.push( `/tasks/${ id }/` );
            },
        },
    };
</script>