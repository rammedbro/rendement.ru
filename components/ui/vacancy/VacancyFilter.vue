<template>
    <app-filter v-model="values"
                :url="curType.url"
                path-encoding
                :encoding-description="description"
                @update:applied="$emit( 'update:applied', $event )"
                @apply="$emit( 'apply', $event )">
        <template v-slot:body="{ apply, clear, loading, count, appliedValuesCount, onValuesChange, isFilterEmpty }">
            <v-row class="filter__body"
                   :class="isMobile ? { 'mt-8 mb-20': !isFilterEmpty, 'mb-20': isFilterEmpty } : {}">
                <!-- Категория -->
                <v-col cols="12" lg="6"
                       order="2" order-lg="1"
                       class="filter__field">
                    <!-- Десктоп: Категория -->
                    <app-select v-if="isDesktop"
                                :value="curType"
                                :items="types"
                                item-text="name"
                                return-object
                                hide-details
                                label="Категория"
                                @input="onTypeSelect( $event, onValuesChange )"/>

                    <!-- Мобайл -->
                    <v-list v-if="isMobile">
                        <!-- Категория -->
                        <v-list-item class="l-border bwb-1"
                                     @click="dialogs.category = true">
                            <v-list-item-content class="d-block subtitle-1">
                                <v-badge color="primary"
                                         inline
                                         content="1">
                                    Категория
                                </v-badge>
                            </v-list-item-content>


                            <v-list-item-action>
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-list-item-action>
                        </v-list-item>

                        <!-- Подкатегория -->
                        <v-list-item class="l-border bwb-1"
                                     :disabled="!curType"
                                     @click="dialogs.subCategory = true">
                            <v-list-item-content class="d-block subtitle-1">
                                <v-badge :value="values.arCategoryCode.length > 0"
                                         color="primary"
                                         inline
                                         :content="values.arCategoryCode.length">
                                    Подкатегория
                                </v-badge>
                            </v-list-item-content>


                            <v-list-item-action>
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-list-item-action>
                        </v-list-item>

                        <!-- Месторождение -->
                        <v-list-item class="l-border bwb-1"
                                     @click="dialogs.location = true">
                            <v-list-item-content class="d-block subtitle-1">
                                <v-badge :value="Number.isInteger( values.locationId )"
                                         color="primary"
                                         inline
                                         :content="1">
                                    Месторождение
                                </v-badge>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-col>

                <!-- Подкатегория -->
                <v-col v-if="isDesktop"
                       cols="12" lg="6"
                       order="2"
                       class="filter__field">
                    <category-select v-for="( item, index ) in types"
                                     v-show="item === curType"
                                     :key="index"
                                     v-model="values.arCategoryCode"
                                     :url="item.categoriesUrl"
                                     item-text="name"
                                     item-value="code"
                                     hide-details multiple
                                     label="Подкатегория"
                                     @input="onValuesChange"/>
                </v-col>

                <!-- Поиск по ключевым словам -->
                <v-col cols="12" lg="4"
                       order="1" order-lg="3"
                       class="filter__field">
                    <v-text-field v-model="values.searchQuery"
                                  outlined prepend-inner-icon="mdi-magnify"
                                  hide-details label="Поиск по ключевым словам"
                                  @input="onValuesChange"/>
                </v-col>

                <!-- Бюджет -->
                <v-col cols="12" lg="4"
                       :order="isMobile?6:4"
                       class="filter__field">
                    <app-text-field-range-slider v-model="values.salaryRange"
                                                 :max="5e5" :step="1000"
                                                 hide-details
                                                 label="Желаемая зарплата"
                                                 @input="onValuesChange"/>
                </v-col>

                <!-- Поиск по месторождению -->
                <v-col v-if="isDesktop"
                       cols="12" lg="4"
                       order="5" order-lg="6"
                       class="filter__field pt-lg-0">
                    <location-search v-model="values.locationId"
                                     label="Поиск по месторождению"
                                     :hide-details="true"
                                     @input="onValuesChange">
                        <template v-slot:prepend-inner>
                            <v-icon class="material-icons-outlined">place</v-icon>
                        </template>
                    </location-search>
                </v-col>

                <!-- Радиус поиска месторождений -->
                <v-col cols="12" lg="4"
                       :order="isMobile?4:6" order-lg="7"
                       class="filter__field pt-lg-0">
                    <app-text-field-slider v-model="values.locationRadius"
                                           :max="1000"
                                           hide-details
                                           label="Радиус от местоположения"
                                           postfix="км."
                                           @input="onValuesChange"/>
                </v-col>

                <!-- Очистить фильтр -->
                <v-col v-if="isDesktop"
                       cols="12" lg="4"
                       order="7" order-lg="5"
                       class="filter__btn mt-auto mt-lg-0">
                    <v-btn color="primary" outlined block
                           :disabled="isFilterEmpty"
                           @click="clear">
                        Очистить фильтр
                    </v-btn>
                </v-col>

                <!-- Применить фильтр -->
                <v-col cols="12" lg="4"
                       order="8"
                       class="filter__btn pt-lg-0"
                       :class="{ 'fixed-bottom pa-4 blue lighten-5': isMobile }">
                    <v-btn :id="curType.submitId"
                           color="primary" block
                           :loading="loading"
                           @click="apply">
                        {{ formatCount(count) }}
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Мобайл -->
            <template v-if="isMobile">
                <!-- Очистить фильтр -->
                <v-container v-show="!isFilterEmpty"
                             :style="{ top: '56px' }"
                             class="container--dense blue lighten-5 text-small-1 absolute-top">
                    <v-row align="center" justify="space-between">
                        <v-col cols="auto">
                            Выбрано: {{ appliedValuesCount }}
                        </v-col>

                        <v-col cols="auto">
                            <div class="primary--text"
                                 @click="clear">
                                Очистить фильтр
                            </div>
                        </v-col>
                    </v-row>
                </v-container>

                <!-- Диалог выбора категорий -->
                <app-fullscreen-dialog v-model="dialogs.category"
                                       title="Категория"
                                       with-back-btn
                                       eager
                                       @click:back="dialogs.category = false">
                    <v-radio-group :value="curType"
                                   mandatory
                                   hide-details
                                   @change="onTypeSelect($event, onValuesChange)">
                        <v-list>
                            <v-list-item v-for="item in types" :key="item.code"
                                         class="l-border bwb-1">
                                <v-radio :value="item"
                                         class="w-100">
                                    <template v-slot:label>
                                        <div class="subtitle-1">{{ item.name }}</div>
                                    </template>
                                </v-radio>
                            </v-list-item>
                        </v-list>
                    </v-radio-group>

                    <v-container class="container--dense white fixed-bottom">
                        <v-row>
                            <v-col cols="12">
                                <v-btn color="primary" outlined block
                                       :disabled="isFilterEmpty"
                                       @click="clear">
                                    Очистить фильтр
                                </v-btn>
                            </v-col>

                            <v-col cols="12">
                                <v-btn color="primary" block
                                       @click="dialogs.category = false">
                                    Выбрать
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </app-fullscreen-dialog>

                <!-- Диалог выбора подкатегорий -->
                <app-fullscreen-dialog v-model="dialogs.subCategory"
                                       title="Подкатегория"
                                       with-back-btn
                                       @click:back="dialogs.subCategory = false">
                    <category-select v-for="( type, index ) in types"
                                     v-show="type === curType"
                                     :key="index"
                                     v-model="values.arCategoryCode"
                                     :url="type.categoriesUrl"
                                     item-text="name"
                                     item-value="code"
                                     hide-details multiple
                                     theme="custom"
                                     label="Подкатегория"
                                     @input="onValuesChange">
                        <template v-slot:items="{ items }">
                            <v-list style="margin-bottom: 160px">
                                <v-list-item v-for="item in items" :key="item.id"
                                             class="l-border bwb-1">
                                    <v-checkbox v-model="values.arCategoryCode"
                                                :value="item.code"
                                                hide-details
                                                class="w-100"
                                                @change="onValuesChange">
                                        <template v-slot:label>
                                            <div class="subtitle-1">{{ item.name }}</div>
                                        </template>
                                    </v-checkbox>
                                </v-list-item>
                            </v-list>

                            <v-container class="container--dense white fixed-bottom">
                                <v-row>
                                    <v-col cols="12">
                                        <v-btn color="primary" outlined block
                                               :disabled="isFilterEmpty"
                                               @click="clear">
                                            Очистить фильтр
                                        </v-btn>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn color="primary" block
                                               @click="dialogs.subCategory = false">
                                            Выбрать
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </template>
                    </category-select>
                </app-fullscreen-dialog>

                <!-- Диалог выбора месторождения -->
                <app-fullscreen-dialog v-model="dialogs.location"
                                       title="Месторождение"
                                       with-back-btn
                                       eager
                                       @click:back="dialogs.location = false">
                    <v-container class="container--dense">
                        <location-search v-model="values.locationId"
                                         label="Поиск по месторождению"
                                         :hide-details="true"
                                         @input="onLocationSelect( $event, onValuesChange )">
                            <template v-slot:prepend-inner>
                                <v-icon class="material-icons-outlined">place</v-icon>
                            </template>
                        </location-search>
                    </v-container>

                    <v-container class="container--dense white fixed-bottom">
                        <v-row>
                            <v-col cols="12">
                                <v-btn color="primary" outlined block
                                       :disabled="isFilterEmpty"
                                       @click="clear">
                                    Очистить фильтр
                                </v-btn>
                            </v-col>

                            <v-col cols="12">
                                <v-btn color="primary" block
                                       @click="dialogs.location = false">
                                    Выбрать
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </app-fullscreen-dialog>
            </template>
        </template>
    </app-filter>
</template>

<script>
    import LocationSearch          from '~/components/ui/location/LocationSearch';
    import AppTextFieldRangeSlider from '~/components/forms/elements/AppTextFieldRangeSlider';
    import AppSelect               from '~/components/forms/elements/AppSelect';
    import AppFilter               from '~/components/ui/AppFilter';
    import CategorySelect          from '~/components/ui/category/CategorySelect';
    import AppTextFieldSlider      from '~/components/forms/elements/AppTextFieldSlider';
    import AppFullscreenDialog     from '~/components/dialogs/AppFullscreenDialog';
    import { pickNumeralEnding }   from '~/lib/classes/utility';

    export default {
        name: 'VacancyFilter',
        components: {
            AppFullscreenDialog,
            AppTextFieldSlider,
            CategorySelect,
            LocationSearch,
            AppFilter,
            AppSelect,
            AppTextFieldRangeSlider,
        },
        data: vm => ( {
            curType: null,
            types: [
                {
                    url: '/api/getVacancies/',
                    categoriesUrl: '/api/vacancyCategories/',
                    code: 'vacancies',
                    name: 'Вакансии',
                    countEndings: [ 'вакансия', 'вакансии', 'вакансий' ],
                    submitId: 'btn-305',
                },
                {
                    url: '/api/getResumes/',
                    categoriesUrl: '/api/resumeCategories/',
                    code: 'resumes',
                    name: 'Резюме',
                    countEndings: [ 'резюме', 'резюме', 'резюме' ],
                    submitId: 'btn-306',
                },
            ],
            values: {
                arCategoryCode: [],
                salaryRange: [],
                searchQuery: undefined,
                locationId: undefined,
                locationRadius: undefined,
            },
            description: [
                {
                    code: 'arCategoryCode',
                    type: Array,
                    arrayOf: String,
                    name: 'category',
                },
                {
                    code: 'locationId',
                    type: Number,
                    name: 'location',
                },
                {
                    code: 'salaryRange',
                    type: Array,
                    arrayOf: Number,
                    name: 'salary',
                },
                {
                    code: 'searchQuery',
                    type: String,
                    ignore: true,
                },
            ],
            dialogs: {
                category: false,
                subCategory: false,
                location: false,
            },
        } ),
        watch: {
            $route() {
                this.decodePath();
            },
        },
        created() {
            this.decodePath();
        },
        methods: {
            onTypeSelect( value, callback ) {
                const type = value || this.types[0];

                this.encodePath( type.code );

                if ( typeof callback === 'function' ) {
                    callback();
                }
            },
            formatCount( count ) {
                let text = 'Показать';

                if ( count === null ) return text;

                const ending = pickNumeralEnding( count, this.curType.countEndings );
                text += ` ${ count } ${ ending }`;

                return text;
            },
            encodePath( code ) {
                const { path } = this.$route;
                const query = Object.assign( {}, this.$route.query, { type: code } );

                this.$router.push( { path, query } );
            },
            decodePath() {
                const { query } = this.$route;
                const code = query.type || 'vacancies';

                if ( this.curType && this.curType.code === code ) return;

                const type =
                    this.types.find( item => item.code === query.type ) ||
                    this.types[0];

                this.curType = type;
                this.values.arCategoryCode = [];
                this.$emit( 'update:type', type.code );
            },
            onLocationSelect( value, callback ) {
                if ( Number.isInteger( value ) ) {
                    this.dialogs.location = false;
                }

                callback();
            },
        },
    };
</script>
