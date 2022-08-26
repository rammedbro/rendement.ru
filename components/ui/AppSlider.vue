<template>
    <div class="l-slider">
        <v-row no-gutters justify="center">
            <!-- Кнопка "Предыдущий слайд" -->
            <v-col v-if="controls"
                   cols="1" align-self="center"
                   class="d-none text-center" :class="{'d-lg-block': items.length > 1}">
                <div class="pointer" @click="goTo('prev')">
                    <slot name="prev">
                        <v-icon size="32">
                            mdi-chevron-left
                        </v-icon>
                    </slot>
                </div>
            </v-col>

            <!-- Слайдер -->
            <v-col v-if="slides.length"
                   :cols="controls ? 10 : 12">
                <client-only>
                    <vue-tiny-slider ref="slider"
                                     v-bind="fullOptions"
                                     @dragStart="onSliderDragStart"
                                     @dragMove="onSliderDragMove"
                                     @indexChanged="onSlideChange">
                        <div v-for="(item, index) in slides" :key="index"
                             @click="onSliderClick(item, index)">
                            <slot name="item" v-bind="{ item, index }">
                                <v-img :src="Array.isArray(item) ? item : item[itemKey]"
                                       lazy-src="/images/no-img-placeholder.png" contain
                                       :class="itemClass"/>
                            </slot>
                        </div>
                    </vue-tiny-slider>
                </client-only>
            </v-col>

            <!-- Кнопка "Следующий слайд" -->
            <v-col v-if="controls"
                   cols="1" align-self="center"
                   class="d-none text-center" :class="{'d-lg-block': items.length > 1}">
                <div class="pointer" @click="goTo('next')">
                    <slot name="prev">
                        <v-icon size="32">
                            mdi-chevron-right
                        </v-icon>
                    </slot>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'AppSlider',
        props: {
            value: {
                type: Number,
                default: 0,
            },
            items: {
                type: Array,
                required: true,
            },
            itemKey: {
                type: String,
                default: 'src',
            },
            itemClass: {
                type: String,
                default: null,
            },
            controls: {
                type: Boolean,
                default: false,
            },
            options: {
                type: Object,
                default: () => ( {} ),
            },
        },
        data: vm => ( {
            isSliderInit: false,
            slides: vm.items,
            defaultOptions: {
                mouseDrag: true,
                gutter: 16,
                items: 1,
                loop: false,
                nav: false,
                controls: false,
                swipeAngle: false,
                arrowKeys: true,
                preventScrollOnTouch: 'force',
                onInit: vm.onSliderInit,
            },
        } ),
        computed: {
            fullOptions: vm => ( {
                ...vm.defaultOptions,
                ...vm.options,
                autoWidth: vm.options.autoWidth && vm.items.length > 1,
                onInit: vm.onSliderInit,
            } ),
        },
        watch: {
            value( value ) {
                this.goTo( value );
            },
            items() {
                this.updateSliderItems();
                this.goTo( 0 );
            },
        },
        methods: {
            onSliderDragStart() {
                this.isSliderMove = false;
                this.isSliderDrag = true;
            },
            onSliderDragMove() {
                if ( this.isSliderDrag ) {
                    this.isSliderMove = true;
                }
            },
            onSliderClick( item, index ) {
                this.isSliderDrag = false;
                if ( this.isSliderMove ) return;

                this.$emit( 'click', { item, index } );
            },
            goTo( where ) {
                if ( !this.isSliderInit ) return;
                this.$refs.slider.goTo( where );
            },
            onSlideChange( info ) {
                if ( info.index === this.value ) return;
                this.$emit( 'input', info.index );
            },
            onSliderInit() {
                this.isSliderInit = true;
                setTimeout( () => {
                    this.goTo( this.value );
                }, 0 );
            },
            updateSliderItems() {
                /* Костыль для обновления слайдера при изменении входящих элементов */
                this.slides = [];
                setTimeout( () => {
                    this.slides = this.items;
                }, 0 );
            },
        },
    };
</script>