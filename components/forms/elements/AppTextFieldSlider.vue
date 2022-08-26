<template>
    <div v-click-outside="onOutsideClick"
         class="l-text-field-slider"
         @click="onInsideClick">
        <v-input :value="value"
                 :rules="rules"
                 :hide-details="hideDetails"
                 :disabled="disabled"
                 class="l-text-field v-text-field v-text-field--outlined v-text-field--is-booted v-text-field--enclosed"
                 :class="{'v-input--is-focused': isFocused, 'l-input--is-filled': isFilled}">
            <!-- Рамка -->
            <fieldset>
                <legend></legend>
            </fieldset>

            <div ref="inputSlot"
                 class="v-text-field__slot">
                <!-- Заголовок -->
                <div class="v-label"
                     :class="{'v-label--active': isFocused || isFilled}">
                    {{ label }}
                </div>

                <!-- Поле ввода -->
                <div v-show="isFilled || isFocused"
                     class="l-text-field__slot">
                    <input ref="input"
                           v-model="compValue"
                           v-mask="mask"
                           class="l-text-field__input">
                    <div class="l-text-field__input-buffer"></div>

                    <span v-if="postfix"
                          class="grey--text text--lighten-1 ml-2">{{ postfix }}</span>
                </div>
            </div>
        </v-input>

        <!-- Диапазоновый ползунок -->
        <v-slider :value="compValue"
                  :min="min" :max="max"
                  track-color="light-blue lighten-2"
                  :hide-details="true"
                  :disabled="disabled"
                  class="l-range-slider"
                  @start="isFocused = true"
                  @end="isFocused = false"
                  @input="onSliderInput"
                  @change="onChange">
            <template v-slot:prepend>
                <span class="text-small-3">{{ min }}</span>
            </template>

            <template v-slot:append>
                <span class="text-small-3">{{ max }}</span>
            </template>
        </v-slider>
    </div>
</template>

<script>
    export default {
        name: 'AppTextFieldSlider',
        props: {
            value: {
                type: Number,
                default: null,
            },
            label: {
                type: String,
                default: undefined,
            },
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                required: true,
            },
            step: {
                type: [ Number, String ],
                default: 1,
            },
            postfix: {
                type: String,
                default: undefined,
            },
            rules: {
                type: Array,
                default: () => [],
            },
            hideDetails: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            isFocused: false,
            mask: {
                alias: 'currency',
                groupSeparator: ' ',
                digits: 0,
                rightAlign: false,
                autoUnmask: true,
                unmaskAsNumber: false,
                showMaskOnHover: false,
                min: vm.min,
                max: vm.max,
            },
        } ),
        computed: {
            isFilled: vm => vm.value !== null,
            compValue: {
                get: vm => {
                    const value = vm.value || vm.min;
                    const input = vm.$refs.input;

                    if ( input ) {
                        vm.resizeInput( value, input );
                    }

                    return value;
                },
                set( value ) {
                    this.$emit( 'input', +value || null );
                },
            },
        },
        mounted() {
            this.resizeInput( this.value || this.min, this.$refs.input );
        },
        methods: {
            onInsideClick() {
                const input = this.$refs.input;

                setTimeout( () => {
                    input.focus();
                }, 0 );

                this.isFocused = true;
            },
            onOutsideClick() {
                this.isFocused = false;
            },
            onSliderInput( value ) {
                this.compValue = Math.round( value / this.step ) * this.step;
            },
            onChange( value ) {
                this.$emit( 'change', value );
            },
            resizeInput( value, input ) {
                const inputBuffer = input.nextElementSibling;

                inputBuffer.innerHTML = value.toLocaleString();

                if ( inputBuffer.clientWidth ) {
                    input.style.width = inputBuffer.clientWidth + 'px';
                } else {
                    const clone = inputBuffer.cloneNode( true );
                    this.$el.append( clone );

                    this.$nextTick( () => {
                        input.style.width = clone.clientWidth + 'px';
                        clone.remove();
                    } );
                }
            },
        },
    };
</script>