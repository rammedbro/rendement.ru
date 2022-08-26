<template>
    <div ref="mapRoot"
         :style="mapRootStyle"
         class="l-map"
         :class="mapClass">
        <!-- Контейнер карты -->
        <div ref="mapInner"
             class="l-map__inner"
             :style="mapInnerStyle">
            <!-- Карта -->
            <yandex-map v-if="isMounted"
                        :coords.sync="coords" zoom="2"
                        :controls="['zoomControl']"
                        use-object-manager
                        class="yandex-map"
                        @map-was-initialized="onMapInit">
                <!-- Объекты на карте -->
                <template v-for="item in locationPoints">
                    <!-- Точка -->
                    <ymap-marker v-if="item.coords.length"
                                 :key="item.id"
                                 :marker-id="item.id"
                                 :coords="item.coords[0]"
                                 cluster-name="1">
                        <!-- Стандартные балуны точек -->
                        <div v-if="!useCustomBalloon"
                             slot="balloon">
                            <div class="text-right">
                                <v-icon color="primary">mdi-close</v-icon>
                            </div>
                            <slot name="balloon" v-bind="{ item }"></slot>
                        </div>
                    </ymap-marker>

                    <!-- Полигон -->
                    <ymap-marker v-if="item.coords.length > 1"
                                 :key="item.id + locationPoints.length"
                                 marker-type="Polyline"
                                 :marker-id="item.id + locationPoints.length"
                                 :coords="item.coords"/>
                </template>
            </yandex-map>

            <!-- Кнопка расстягивания/сужения карты -->
            <div v-if="resizable"
                 ref="resizeBtn"
                 v-resize="onWindowResize"
                 class="l-map-resize-btn elevation-2"
                 @mousedown="onResizeBtnMouseDown">
                <v-icon color="black">mdi-pan-horizontal</v-icon>
            </div>

            <!-- Кастомный балун: Диалоговое окно -->
            <div v-if="useCustomBalloon"
                 v-show="customBalloon.display"
                 ref="customBalloon"
                 class="l-map-dialog"
                 :style="customBalloonStyle">
                <v-card>
                    <!-- Кастомный балун: Кнопка "Закрыть" -->
                    <div class="l-map-dialog__close"
                         :style="{ height: customBalloon.sizes.minHeight + 'px' }">
                        <v-icon @click="closeBalloon">
                            mdi-close
                        </v-icon>
                    </div>

                    <!-- Кастомный балун: Содержимое -->
                    <div v-mutate.child.sub="calcBalloonPosition"
                         class="l-map-dialog__content"
                         :style="customBalloonContentStyle">
                        <slot v-if="curPoint"
                              name="balloon" v-bind="{ item: curPoint }"></slot>
                    </div>
                </v-card>
            </div>
        </div>

        <!-- Конечная линия прилипания карты -->
        <div v-if="sticky"
             v-scroll="setMapSticky"
             v-intersect="onStickyEndlineIntersect"
             class="l-map-sticky-endline"></div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    import { yandexMap, ymapMarker } from 'vue-yandex-maps';

    export default {
        name: 'AppMap',
        components: { yandexMap, ymapMarker },
        props: {
            value: {
                type: Number,
                default: null,
            },
            filter: {
                type: Array,
                default: null,
            },
            radius: {
                type: Number,
                default: 0,
            },
            resizable: {
                type: Boolean,
                default: false,
            },
            sticky: {
                type: Boolean,
                default: false,
            },
            colWidth: {
                type: Number,
                default: 6,
            },
            width: {
                type: Number,
                default: null,
            },
            minWidth: {
                type: Number,
                default: 288,
            },
            maxWidth: {
                type: Number,
                default: null,
            },
            maxWidthDecrease: {
                type: Number,
                default: 384,
            },
            height: {
                type: Number,
                default: null,
            },
            useCustomBalloon: {
                type: Boolean,
                default: true,
            },
        },
        data: vm => ( {
            map: null,
            coords: [ 0, 65.5 ],
            objectManager: null,
            activeMarker: {
                id: vm.value,
                position: {
                    clientX: null,
                    clientY: null,
                },
            },
            resizeBtnInitLeft: null,
            sizes: {
                width: vm.width,
                minWidth: vm.minWidth,
                maxWidth: vm.maxWidth,
                height: vm.height,
            },
            isMapStickyStart: false,
            isMapStickyEnd: false,
            customBalloon: {
                display: false,
                position: {
                    top: null,
                    left: null,
                },
                sizes: {
                    width: 288,
                    minHeight: 40,
                    maxHeight: 360,
                },
            },
            radiusCircle: {
                object: null,
                coords: [ 0, 0 ],
                fill: {
                    fillOpacity: 0.2,
                },
            },
        } ),
        computed: {
            ...mapGetters( 'location', [ 'locationPoints' ] ),
            mapRootStyle: vm => ( {
                width: vm.sizes.width + 'px',
            } ),
            mapInnerStyle: vm => ( {
                width: vm.sizes.width + 'px',
                minWidth: vm.sizes.minWidth + 'px',
                maxWidth: vm.sizes.maxWidth + 'px',
                height: vm.sizes.height + 'px',
            } ),
            mapClass: vm => ( {
                'l-map--sticky': vm.sticky,
                'l-map--sticky-start': vm.isMapStickyStart,
                'l-map--sticky-end': vm.isMapStickyEnd,
            } ),
            customBalloonStyle: vm => ( {
                top: vm.customBalloon.position.top + 'px',
                left: vm.customBalloon.position.left + 'px',
                width: vm.customBalloon.sizes.width + 'px',

            } ),
            customBalloonContentStyle: vm => ( {
                maxHeight: ( vm.customBalloon.sizes.maxHeight - vm.customBalloon.sizes.minHeight ) + 'px',
            } ),
            curPoint: vm =>
                ( vm.locationPoints && vm.locationPoints.find( item => item.id === vm.activeMarker.id ) ) || null,
        },
        watch: {
            value( newValue, oldValue ) {
                if ( !this.objectManager ) return;

                if ( Number.isInteger( newValue ) ) {
                    this.deactivateMarker( oldValue );
                    this.activeMarker.id = newValue;
                    this.setCenter();
                } else {
                    this.closeBalloon();
                }
            },
            filter( arId ) {
                if ( !this.objectManager ) return;

                Array.isArray( arId ) ? this.setFilter() : this.removeFilter();
            },
            radius( value ) {
                if ( !this.objectManager ) return;

                this.setRadiusCircle( value );
            },
        },
        mounted() {
            if ( this.resizable ) {
                const { resizeBtn } = this.$refs;
                this.calcMapSizes();
                resizeBtn.addEventListener( 'touchstart', this.onResizeBtnMouseDown );
            }
        },
        methods: {
            ...mapActions( 'location', [ 'getLocationPoints' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            async onMapInit( map ) {
                this.map = map;
                await this.getLocationPoints();
                // ObjectManager добавляется к карте с задержкой, поэтому чекаем по таймеру
                this.checkObjectManagerInit();
            },
            checkObjectManagerInit() {
                setTimeout( () => {
                    const objectManager = this.map.geoObjects.get( 0 );

                    if ( objectManager ) {
                        this.objectManager = objectManager;
                        this.onObjectManagerInit();
                    } else {
                        this.checkObjectManagerInit();
                    }
                }, 100 );
            },
            onObjectManagerInit() {
                this.objectManager.objects.events.add( [ 'click' ], this.onMarkerClick );
                // Добавляем круг Circle для визуализации радиуса
                this.createRadiusCircle();

                // Центрируем карту
                if ( Number.isInteger( this.value ) ) {
                    this.activeMarker.id = this.value;
                    this.setCenter();
                }

                // Фильтруем точки
                if ( Array.isArray( this.filter ) ) {
                    this.setFilter();
                }
            },
            createRadiusCircle() {
                const { ymaps } = window;
                const { coords, fill } = this.radiusCircle;

                if ( !ymaps ) return;

                this.radiusCircle.object = new ymaps.Circle( [ coords, this.radius ], {}, fill );
                this.map.geoObjects.add( this.radiusCircle.object );
            },
            onMarkerClick( event ) {
                const id = event.get( 'objectId' );
                const [ clientX, clientY ] = event.getSourceEvent().get( 'clientPixels' );

                this.deactivateMarker( this.activeMarker.id );
                Object.assign( this.activeMarker, { id, clientX, clientY } );
                this.openBalloon();
            },
            activateMarker( id ) {
                const { error } = this.$vuetify.theme.themes.light;
                this.objectManager.objects.setObjectOptions( id, { iconColor: error } );
            },
            deactivateMarker( id ) {
                const { primary } = this.$vuetify.theme.themes.light;
                this.objectManager.objects.setObjectOptions( id, { iconColor: primary } );
            },
            openBalloon() {
                if ( this.customBalloon ) {
                    this.customBalloon.display = true;

                    // Помещаем в очередь, чтобы успело появиться диалоговое окно балуна
                    Promise.resolve().then( () => {
                        this.activateMarker( this.activeMarker.id );
                        this.calcBalloonPosition();
                    } );
                } else {
                    this.objectManager.objects.balloon.open( this.activeMarker.id )
                        .catch( () => {
                            // Почему-то через раз возвращает ошибку, поэтму пробуем открыть ещё раз
                            this.objectManager.objects.balloon.open( this.activeMarker.id );
                        } );
                }
            },
            closeBalloon() {
                if ( this.customBalloon ) {
                    this.customBalloon.display = false;
                    this.deactivateMarker( this.activeMarker.id );
                } else {
                    this.objectManager.objects.balloon.close();
                }
            },
            calcBalloonPosition() {
                if ( !this.useCustomBalloon || !this.customBalloon.display ) return;

                const { mapInner, customBalloon } = this.$refs;
                const { clientX, clientY } = this.activeMarker;
                const { width: balloonWidth, minHeight: balloonMinHeight } = this.customBalloon.sizes;
                const balloonHeight = customBalloon.offsetHeight || balloonMinHeight;
                const mapInnerCoords = mapInner.getBoundingClientRect();
                const offset = 16;
                let top, left;

                if ( Number.isFinite( clientX ) && Number.isFinite( clientY ) ) {
                    // Относительно клика
                    top = clientY - mapInnerCoords.top - balloonHeight - offset;
                    left = clientX - mapInnerCoords.left - ( balloonWidth / 2 );

                    if ( top < offset ) top = clientY - mapInnerCoords.top + offset;
                    if ( left < offset ) left = offset;

                    const bottom = top + balloonHeight;
                    if ( bottom > mapInner.offsetHeight + offset ) {
                        top = mapInner.offsetHeight - balloonHeight - offset;
                    }

                    const right = left + balloonWidth;
                    if ( right > mapInner.offsetWidth + offset ) {
                        left = mapInner.offsetWidth - balloonWidth - offset;
                    }
                } else {
                    // По центру
                    const markerHeight = 32;
                    top = ( mapInner.offsetHeight / 2 ) - balloonHeight - markerHeight - offset;
                    left = ( mapInner.offsetWidth - balloonWidth ) / 2;
                }

                this.customBalloon.position.top = top;
                this.customBalloon.position.left = left;
            },
            async setCenter() {
                const point = this.curPoint || {};
                const coords = point.coords || [];

                if ( !coords.length ) return;

                await this.map.setCenter( coords[0], 15 );
                this.openBalloon();
            },
            setFilter() {
                this.objectManager.setFilter( object => this.filter.includes( object.id ) );
            },
            removeFilter() {
                this.objectManager.setFilter( null );
            },
            setRadiusCircle() {
                const coords = this.curPoint ? this.curPoint.coords[0] : this.coords;

                this.radiusCircle.object.geometry.setCoordinates( coords );
                this.radiusCircle.object.geometry.setRadius( this.radius * 1000 );
            },
            onResizeBtnMouseDown( event ) {
                if ( this.resizeBtnInitLeft === null ) {
                    const { resizeBtn } = this.$refs;
                    this.resizeBtnInitLeft = resizeBtn.getBoundingClientRect().left;
                }

                this.mapResize( event );
                document.addEventListener( 'mousemove', this.mapResize );
                document.addEventListener( 'touchmove', this.mapResize );
                document.addEventListener( 'mouseup', this.onResizeBtnMouseup );
                document.addEventListener( 'touchend', this.onResizeBtnMouseup );
            },
            onResizeBtnMouseup() {
                this.map.container.fitToViewport();
                this.calcBalloonPosition();
                document.removeEventListener( 'mousemove', this.mapResize );
                document.removeEventListener( 'touchmove', this.mapResize );
                document.removeEventListener( 'mouseup', this.onResizeBtnMouseup );
                document.removeEventListener( 'touchend', this.onResizeBtnMouseup );
            },
            mapResize( event ) {
                const pageX = event.pageX || event.touches[0].pageX;
                const { mapRoot, mapInner, resizeBtn } = this.$refs;
                const { width: initWidth, minWidth, maxWidth } = this.sizes;
                let width = initWidth - ( ( pageX - resizeBtn.offsetWidth / 2 ) - this.resizeBtnInitLeft );

                if ( width < parseInt( minWidth ) ) width = minWidth;
                if ( width > parseInt( maxWidth ) ) width = maxWidth;

                // Меняем ширину через DOM, т.к. через Vue появляются тормоза
                mapRoot.style.width = mapInner.style.width = width + 'px';
            },
            onWindowResize() {
                this.calcMapSizes();
                this.redrawMap();
                this.calcBalloonPosition();
            },
            redrawMap() {
                if ( !this.isMounted ) return;
                // Закидываем код в очередь, т.к. иначе движок не успевает обработать данные
                // и могут возникнуть баги
                setTimeout( () => {
                    const { resizeBtn } = this.$refs;
                    this.resizeBtnInitLeft = resizeBtn.getBoundingClientRect().left;
                    this.map.container.fitToViewport();
                }, 0 );
            },
            calcMapSizes() {
                const doc = document.documentElement;

                Object.assign( this.sizes, {
                    width: this.width || ( doc.clientWidth / ( 12 / this.colWidth ) ),
                    minWidth: this.minWidth,
                    maxWidth: doc.clientWidth - this.maxWidthDecrease,
                    height: this.height || ( doc.clientHeight - 64 ),
                } );
            },
            setMapSticky() {
                const { mapRoot } = this.$refs;

                if ( mapRoot.style.display === 'none' ) return;

                const top = mapRoot.getBoundingClientRect().top;
                this.isMapStickyStart = ( ( top - 64 ) < 0 ) && !this.isMapStickyEnd;
            },
            onStickyEndlineIntersect( entries, observer, isIntersecting ) {
                this.isMapStickyEnd = isIntersecting;
                this.setMapSticky();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-map {
        position: relative;
        display: flex;

        .l-map__inner {
            position: relative;
            display: flex;
            flex: 1;
        }

        &--sticky {
            height: 100%;
            min-height: calc(100vh - 64px);
        }

        &--sticky-start {
            .l-map__inner {
                position: fixed;
                z-index: 0;
                top: 64px;
                right: 32px;
            }

        }

        &--sticky-end {
            .l-map__inner {
                align-self: flex-end;
            }
        }
    }

    .l-map-dialog {
        position: absolute;
        z-index: 5;

        &__close {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 16px;
        }

        &__content {
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 320px;
        }
    }

    .l-map-sticky-endline {
        align-self: flex-end;
    }

    .l-map-resize-btn {
        position: absolute;
        z-index: 10;
        top: 50%;
        left: -20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        cursor: grab;
        border-radius: 50%;
        background: white;
        transform: translateY(-50%);

        &:active {
            cursor: grabbing;
        }
    }

    .yandex-map {
        overflow: hidden;
        flex: 1;
    }
</style>
