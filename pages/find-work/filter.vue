<template>
    <div class="h-fill">
        <div class="white elevation-1">
            <!-- Блок с ссылками -->
            <div class="fixed-top vw-100 mt-14 mt-md-16 light-blue lighten-5">
                <v-container class="py-4">
                    <v-row justify="space-between">
                        <v-col cols="12" lg="6" align-self="center">
                            <v-row>
                                <v-col cols="12">
                                    <span class="info-text mr-1">HR специалистам и кадровым агенствам</span>
                                    <v-tooltip bottom min-width="240px">
                                        <template v-slot:activator="{ on }">
                                            <v-icon color="light-blue lighten-4" v-on="on">mdi-help-circle</v-icon>
                                        </template>
                                        <span class="d-block text-left">1. При резмещении объявлений учитывайте тематику сайта.<br> <br>2. Политикой сайта запрещается взымать деньги с соискателей работы.</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" lg="5">
                            <v-row>
                                <v-col cols="6">
                                    <v-btn color="primary" outlined
                                           x-small rounded
                                           block to="/create-work/?type=vacancies">
                                        Создать вакансию
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn color="primary" x-small block
                                           rounded to="/create-work/?type=resumes">
                                        Создать резюме
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </div>

            <v-container>
                <!-- Заголовок -->
                <h1 class="text-h3 mt-24 mt-md-26 mt-lg-16 mb-4 mb-lg-8">{{ h1 }}</h1>

                <!-- Фильтр -->
                <vacancy-filter :type.sync="filter.type"
                                :applied.sync="filter.values"
                                @update:type="onTypeSelect"
                                @apply="onFilter"/>
            </v-container>
        </div>

        <app-catalog v-for="type in types"
                     v-show="type === curType"
                     :ref="`catalog-${ type.code }`"
                     :key="type.code"
                     :url="type.url"
                     :filter="filter.values"
                     :count-endings="type.countEndings"
                     :body-class="['container', 'container--fluid']"
                     invoke-after-reach
                     pagination-on-top
                     pagination-path-encoding>
            <!-- Количество -->
            <template v-slot:count="{ countFormat }">
                <div class="text-h4 mb-8">Найдено {{ countFormat }}</div>
            </template>

            <!-- Результаты -->
            <template v-slot:items="{ items }">
                <v-row>
                    <!-- Карточки -->
                    <v-col>
                        <v-row>
                            <v-col v-for="item in items" :key="item.id">
                                <component :is="type.cardComponent"
                                           :value="item"
                                           class="h-100"/>
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- Карта -->
                    <v-col v-if="isDesktop"
                           cols="auto">
                        <app-map :filter="type.map.filter"
                                 :col-width="4"
                                 resizable sticky>
                            <!-- Карта: Балун -->
                            <template v-slot:balloon="{ item: location }">
                                <app-catalog :key="location.id"
                                             :url="type.url"
                                             :limit="5"
                                             :filter="{ locationId: location.id }"
                                             :item-type="type.map.cardType"
                                             :count.sync="type.map.count[location.id]"
                                             :cache.sync="type.map.items[location.id]"
                                             invoke-after-reach
                                             scroll-pagination
                                             disable-count>
                                    <!-- Карта: Задания в балуне -->
                                    <template v-slot:items="{ items: locations }">
                                        <v-row>
                                            <v-col v-for="(item, index) in locations"
                                                   :key="item.id"
                                                   cols="12"
                                                   class="l-border bwa-0"
                                                   :class="{ 'bwb-1': index < locations.length - 1 }">
                                                <component :is="type.map.cardComponent"
                                                           :value="item"/>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </app-catalog>
                            </template>
                        </app-map>
                    </v-col>
                </v-row>
            </template>

            <template v-if="meta.afterContent"
                      v-slot:footer>
                <v-container fluid
                             class="pt-0"
                             v-html="meta.afterContent"/>
            </template>
        </app-catalog>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';
    import { meta }                     from '~/mixins/meta';

    import AppMap             from '~/components/ui/AppMap';
    import AppCatalog         from '~/components/ui/AppCatalog';
    import VacancyFilter      from '~/components/ui/vacancy/VacancyFilter';
    import VacancyCardPreview from '~/components/ui/vacancy/VacancyCardPreview';
    import ResumeCardPreview  from '~/components/ui/resume/ResumeCardPreview';
    import VacancyCardMap     from '~/components/ui/vacancy/VacancyCardMap';
    import ResumeCardMap      from '~/components/ui/resume/ResumeCardMap';
    import {
        IntVacancyMap,
        IntVacancyPreview,
    }                         from '~/lib/types/vacancy';
    import {
        IntResumeMap,
        IntResumePreview,
    }                         from '~/lib/types/resume';

    export default {
        components: {
            AppMap,
            AppCatalog,
            VacancyFilter,
            VacancyCardPreview,
            ResumeCardPreview,
            VacancyCardMap,
            ResumeCardMap,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Поиск работы',
            types: [
                {
                    code: 'vacancies',
                    url: '/api/getVacancies/',
                    countEndings: [ 'вакансия', 'вакансии', 'вакансий' ],
                    cardType: IntVacancyPreview,
                    cardComponent: VacancyCardPreview,
                    map: {
                        cardType: IntVacancyMap,
                        cardComponent: VacancyCardMap,
                        filter: undefined,
                        count: {},
                        items: {},
                    },
                },
                {
                    code: 'resumes',
                    url: '/api/getResumes/',
                    countEndings: [ 'резюме', 'резюме', 'резюме' ],
                    cardType: IntResumePreview,
                    cardComponent: ResumeCardPreview,
                    map: {
                        cardType: IntResumeMap,
                        cardComponent: ResumeCardMap,
                        filter: undefined,
                        count: {},
                        items: {},
                    },
                },
            ],
            filter: {
                type: undefined,
                values: {},
            },
        } ),
        computed: {
            curType: vm => vm.types.find( item => item.code === vm.filter.type ),
        },
        mounted() {
            this.onTypeSelect();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'location', [ 'filterLocations' ] ),
            onTypeSelect() {
                const { filter } = this.curType.map;

                if ( this.isDesktop && !filter ) {
                    this.getFilterLocations();
                }
            },
            onFilter( isFilterChange ) {
                try {
                    const { code } = this.curType;
                    const catalog = this.$refs[`catalog-${ code }`][0];

                    catalog.doFilter( isFilterChange );

                    if ( this.isDesktop && isFilterChange ) {
                        this.getFilterLocations();
                    }
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
            getFilterLocations() {
                const { url } = this.curType;
                const { values } = this.filter;

                this.filterLocations( { url, filter: values } )
                    .then( result => {
                        this.curType.map.filter = result;
                    } );
            },
        },
    };
</script>

<style lang="scss" scoped>
    @include media-breakpoint-down(xs) {
        .info-text {
            font-size: 11px;
            letter-spacing: .2px;
        }
    }
</style>
