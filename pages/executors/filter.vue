<template>
    <app-catalog :url="url"
                 :filter="filter"
                 :item-type="$legacy.types.IntExecutorPreview"
                 :count-endings="countEndings"
                 :body-class="['container', 'container--fluid']"
                 pagination-on-top
                 pagination-path-encoding
                 invoke-after-reach>
        <!-- Хэдер -->
        <template v-slot:header="{ doFilter }">
            <!-- Блок с ссылками -->
            <div class="light-blue lighten-5">
                <v-container class="py-4">
                    <v-row justify="end">
                        <v-col cols="12" md="auto">
                            <v-btn color="primary" x-small
                                   block rounded
                                   to="/personal/?becomeExecutor=true">
                                Стать исполнителем
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </div>

            <div class="white">
                <v-container class="py-4">
                    <v-row>
                        <v-col cols="12" lg="8">
                            <div class="text-small-2">
                                Вы находитесь в разделе исполнителей. Чтобы написать сообщение и предложить работу исполнителю, перейдите в карточку исполнителя и нажмите на кнопку «Написать»
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </div>

            <div class="white elevation-1">
                <v-container>
                    <!-- Заголовок -->
                    <h1 class="text-h3 mb-4 mb-lg-8">{{ h1 }}</h1>

                    <!-- Фильтр -->
                    <executor-filter :applied.sync="filter"
                                     @apply="onFilterWrapper($event, doFilter)"/>
                </v-container>
            </div>
        </template>

        <!-- Количество -->
        <template v-slot:count="{ countFormat }">
            <div class="text-h4 mb-8">Найдено {{ countFormat }}</div>
        </template>

        <!-- Результаты -->
        <template v-slot:items="{ count, items }">
            <v-row>
                <!-- Карточки -->
                <v-col>
                    <v-row>
                        <v-col v-for="item in items" :key="item.id">
                            <executor-card-preview :value="item"
                                                   class="h-100"/>
                        </v-col>
                    </v-row>
                </v-col>

                <!-- Карта -->
                <v-col v-if="isDesktop"
                       cols="auto">
                    <app-map v-show="count > 0"
                             :filter="mapFilter"
                             :col-width="4"
                             resizable sticky>
                        <!-- Карта: Балун -->
                        <template v-slot:balloon="{ item: location }">
                            <app-catalog :key="location.id"
                                         :url="url"
                                         :limit="5"
                                         :filter="{ locationId: location.id }"
                                         :item-type="$legacy.types.IntExecutorMap"
                                         :count.sync="mapBalloonCache.count[location.id]"
                                         :cache.sync="mapBalloonCache.items[location.id]"
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
                                            <executor-card-map :value="item"/>
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
</template>

<script>
    import { mapActions } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppCatalog          from '~/components/ui/AppCatalog';
    import AppMap              from '~/components/ui/AppMap';
    import ExecutorFilter      from '~/components/ui/executor/ExecutorFilter';
    import ExecutorCardPreview from '~/components/ui/executor/ExecutorCardPreview';
    import ExecutorCardMap     from '~/components/ui/executor/ExecutorCardMap';

    export default {
        components: {
            ExecutorCardMap,
            AppCatalog,
            ExecutorCardPreview,
            ExecutorFilter,
            AppMap,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Поиск исполнителя',
            countEndings: [ 'исполнитель', 'исполнителя', 'исполнителей' ],
            url: '/api/getExecutors/',
            filter: {},
            mapFilter: [],
            mapBalloonCache: {
                count: {},
                items: {},
            },
        } ),
        mounted() {
            if ( this.isDesktop ) {
                this.getFilterLocations();
            }
        },
        methods: {
            ...mapActions( 'location', [ 'filterLocations' ] ),
            onFilterWrapper( isFilterChange, doFilter ) {
                doFilter( isFilterChange );

                if ( this.isDesktop && isFilterChange ) {
                    this.getFilterLocations();
                }
            },
            getFilterLocations() {
                const { filter } = this.$data;

                this.filterLocations( { url: '/api/getExecutors/', filter } )
                    .then( result => {
                        this.mapFilter = result;
                    } );
            },
        },
    };
</script>
