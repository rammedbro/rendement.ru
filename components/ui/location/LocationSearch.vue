<template>
    <v-autocomplete :value="value" :loading="loading"
                    :search-input.sync="searchInput"
                    :items="isPlaceOfResidence ? homeLocationPoints : locationPoints"
                    :hide-no-data="loading"
                    :rules="rules"
                    :messages="warningMessage"
                    no-data-text="Ничего не найдено"
                    item-text="title" item-value="id"
                    outlined :hide-details="hideDetails"
                    :prepend-inner-icon="prependInnerIcon"
                    :label="label"
                    :menu-props="listOptions"
                    :class="{ 'warning--text': warningMessage.length }"
                    @input="onInput">
        <!-- Элементы выпадающего списка -->
        <template v-slot:item="{ item, on }">
            <v-list-item class="l-border bwb-1" v-on="on">
                <v-list-item-content>
                    <div class="text-subtitle-1">{{ item.title }}</div>
                    <div class="text-body-2 grey--text text--lighten-1">{{ item.address }}</div>
                </v-list-item-content>
            </v-list-item>
        </template>

        <!-- Левая иконка -->
        <template v-slot:prepend-inner>
            <slot name="prepend-inner"></slot>
        </template>

        <!-- Правая иконка -->
        <template v-slot:append>
            <v-icon v-show="searchInput"
                    @click.stop="clearInput">
                mdi-close
            </v-icon>

            <div v-show="!searchInput">
                <slot name="append"></slot>

                <template v-if="withMap">
                    <v-icon class="material-icons-outlined"
                            @click.stop="mapDialog.display = true">
                        place
                    </v-icon>

                    <app-fullscreen-dialog v-model="mapDialog.display"
                                           title="Карта">
                        <div class="d-flex flex-column h-100">
                            <!-- Поиск по карте -->
                            <v-container>
                                <v-row>
                                    <v-col cols="12" :lg="withRadius && !isPlaceOfResidence ? 12 : 9"
                                           :class="{ 'pb-0': mapDialog.value !== null }">
                                        <!-- Поиск по карте: Поиск -->
                                        <location-search v-model="mapDialog.value"
                                                         :hide-details="withRadius && mapDialog.value === null"
                                                         :warning-rules="mapDialog.warningRules"
                                                         :label="label"
                                                         is-place-of-residence
                                                         prepend-inner-icon="mdi-magnify"/>
                                    </v-col>

                                    <v-col v-if="isPlaceOfResidence" cols="12" lg="3"
                                           :class="{ 'pb-0': mapDialog.value !== null }">
                                        <v-btn color="primary" block
                                               @click="onMapSelectAccept( mapDialog.value )">
                                            Подтвердить
                                        </v-btn>
                                    </v-col>

                                    <template v-if="mapDialog.value !== null && isPlaceOfResidence === false">
                                        <v-col v-if="withRadius"
                                               cols="12" lg="9"
                                               class="pt-0">
                                            <!-- Поиск по карте: Радиус -->
                                            <app-text-field-slider v-model="mapDialog.radius"
                                                                   v-bind="radiusProps"
                                                                   hide-details
                                                                   label="Радиус от местонахождения"
                                                                   postfix="км."/>
                                        </v-col>

                                        <v-col cols="12" lg="3"
                                               :class="{ 'pt-0': withRadius }">
                                            <v-btn color="primary" block
                                                   @click="onMapSelectAccept( mapDialog.value )">
                                                Подтвердить
                                            </v-btn>
                                        </v-col>
                                    </template>
                                </v-row>
                            </v-container>

                            <!-- Карта -->
                            <app-map :value="mapDialog.value"
                                     :radius="mapDialog.radius"
                                     class="flex-grow-1">
                                <!-- Карта: Балун -->
                                <template v-slot:balloon="{ item }">
                                    <location-card-map :value="item"
                                                       @click:accept="onMapSelectAccept($event.id)"/>
                                </template>
                            </app-map>
                        </div>
                    </app-fullscreen-dialog>
                </template>
            </div>
        </template>

        <!-- Неудачная загрузка данных -->
        <template v-slot:no-data>
            <v-list-item v-if="isError"
                         class="d-block px-0">
                <div class="pa-4">
                    <div class="text-subtitle-1 mb-4">Ошибка! Не удалось загрузить данные.</div>
                    <v-btn color="primary" x-small
                           @click="getDataFromApi">
                        Попробовать ещё раз
                    </v-btn>
                </div>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    import AppFullscreenDialog from '~/components/dialogs/AppFullscreenDialog';
    import AppMap              from '~/components/ui/AppMap';
    import AppTextFieldSlider  from '~/components/forms/elements/AppTextFieldSlider';
    import LocationCardMap     from '~/components/ui/location/LocationCardMap';

    export default {
        name: 'LocationSearch',
        components: { LocationCardMap, AppTextFieldSlider, AppMap, AppFullscreenDialog },
        props: {
            value: {
                type: Number,
                default: null,
            },
            hideDetails: {
                type: Boolean,
                default: false,
            },
            prependInnerIcon: {
                type: String,
                default: '',
            },
            withMap: {
                type: Boolean,
                default: false,
            },
            withRadius: {
                type: Boolean,
                default: false,
            },
            radius: {
                type: Number,
                default: undefined,
            },
            radiusProps: {
                type: Object,
                default: () => ( {
                    max: 500,
                } ),
            },
            rules: {
                type: Array,
                default: () => [],
            },
            warningRules: {
                type: Array,
                default: () => [],
            },
            label: {
                type: String,
                default: 'Желаемое месторождение или нас. пункт',
            },
            isPlaceOfResidence: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            isError: false,
            loading: false,
            searchInput: null,
            warningMessage: '',
            mapDialog: {
                isPlaceOfResidence: vm.isPlaceOfResidence,
                display: false,
                value: vm.value,
                radius: vm.radius,
                warningRules: [
                    v => {
                        if ( v === null ) return true;

                        let point = {};

                        if ( vm.isPlaceOfResidence ) {
                            point = vm.homeLocationPoints.find( item => item.id === v ) || {};
                        } else {
                            point = vm.locationPoints.find( item => item.id === v ) || {};
                        }
                        const coords = point.coords || [];
                        return !!coords.length || 'Отсутствуют координаты';
                    },
                ],
            },
            listMaxWidth: null,
        } ),
        computed: {
            ...mapGetters( 'location', [ 'locationPoints', 'homeLocationPoints' ] ),
            listOptions: vm => ( {
                offsetY: true,
                maxWidth: vm.listMaxWidth || ( vm.$el && vm.$el.offsetWidth ) || undefined,
            } ),
        },
        watch: {
            radius( value ) {
                this.mapDialog.radius = value;
            },
        },
        created() {
            this.getDataFromApi();
        },
        mounted() {
            this.listMaxWidth = this.$el.offsetWidth;
        },
        methods: {
            ...mapActions( 'location', [ 'getLocationPoints' ] ),
            getDataFromApi() {
                this.loading = true;

                const url = this.isPlaceOfResidence ? '/api/homeLocations/' : '/api/locations/';

                this.getLocationPoints( url )
                    .then( () => {
                        this.isError = false;
                    } )
                    .catch( e => {
                        this.isError = true;
                        console.log( e.message );
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            clearInput() {
                this.searchInput = null;
                this.onInput( null );
                this.$emit( 'update:radius', 0 );
            },
            onInput( value ) {
                this.checkWarnings( value );
                this.mapDialog.value = value;
                this.$emit( 'input', value );
            },
            onMapSelectAccept( id ) {
                this.mapDialog.display = false;
                this.onInput( id );
                this.$emit( 'update:radius', this.mapDialog.radius );
            },
            checkWarnings( value ) {
                this.warningMessage = '';

                for ( const rule of this.warningRules ) {
                    const result = rule( value );

                    if ( result !== true ) {
                        this.warningMessage = result;
                        break;
                    }
                }
            },
        },
    };
</script>
