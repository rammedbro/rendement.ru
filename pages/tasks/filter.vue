<template>
    <app-catalog :url="url"
                 :filter="filter"
                 :item-type="$legacy.types.IntTaskPreview"
                 :count-endings="countEndings"
                 :body-class="['container', 'container--fluid']"
                 pagination-on-top
                 pagination-path-encoding
                 invoke-after-reach>
        <template v-slot:header="{ doFilter }">
            <div class="white elevation-1">
                <v-container>
                    <!-- Заголовок -->
                    <h1 class="text-h3 mb-4 mb-lg-8">{{ h1 }}</h1>

                    <!-- Фильтр -->
                    <task-filter :applied.sync="filter"
                                 @apply="onFilterWrapper( $event, doFilter )"/>
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
                        <v-col v-for="item in items"
                               :key="item.id">
                            <task-card-preview :value="item"
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
                                         :item-type="$legacy.types.IntTaskMap"
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
                                            <task-card-map :value="item"/>
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

    import AppMap          from '~/components/ui/AppMap';
    import TaskCardPreview from '~/components/ui/task/TaskCardPreview';
    import AppCatalog      from '~/components/ui/AppCatalog';
    import TaskCardMap     from '~/components/ui/task/TaskCardMap';
    import TaskFilter      from '~/components/ui/task/TaskFilter';

    export default {
        components: {
            TaskCardMap,
            AppCatalog,
            TaskCardPreview,
            AppMap,
            TaskFilter,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Поиск задания',
            countEndings: [ 'задание', 'задания', 'заданий' ],
            url: '/api/getTasks/',
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
                const { filter } = this;

                this.filterLocations( { url: '/api/getTasks/', filter } )
                    .then( result => {
                        this.mapFilter = result;
                    } );
            },
        },
    };
</script>
