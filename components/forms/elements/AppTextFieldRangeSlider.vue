<template>
    <div v-click-outside="onOutsideClick"
         class="l-text-field-slider"
         @click="onInsideClick">
        <v-input :value="value"
                 :rules="rules"
                 :hide-details="hideDetails"
                 :disabled="disabled"
                 class="l-text-field l-text-field--range v-text-field v-text-field--outlined v-text-field--is-booted v-text-field--enclosed"
                 :class="{'v-input--is-focused': isFocused, 'l-input--is-filled': isFilled}">
            <!-- Рамка -->
            <fieldset>
                <legend></legend>
            </fieldset>

            <div class="v-text-field__slot">
                <!-- Заголовок -->
                <div class="v-label"
                     :class="{'v-label--active': isFocused || isFilled}">
                    {{ label }}
                </div>

                <!-- Поля ввода -->
                <div v-show="isFilled || isFocused"
                     class="l-text-field__slot">
                    <!-- Поле: От -->
                    <span class="grey--text text--lighten-1 mr-2">от</span>
                    <input ref="min"
                           v-mask="mask"
                           :value="compValue[0]"
                           class="l-text-field__input"
                           @input="onInput">
                    <div class="l-text-field__input-buffer"></div>

                    <!-- Поле: До -->
                    <span class="grey--text text--lighten-1 mx-2">до</span>
                    <input ref="max"
                           v-mask="mask"
                           :value="compValue[1]"
                           class="l-text-field__input"
                           @input="onInput">
                    <div class="l-text-field__input-buffer"></div>

                    <span v-if="postfix"
                          class="grey--text text--lighten-1 ml-2">{{ postfix }}</span>
                </div>
            </div>
        </v-input>

        <!-- Диапазоновый ползунок -->
        <v-range-slider :value="compValue"
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
        </v-range-slider>
    </div>
</template>

<script>
    export default {
        name: 'AppTextFieldRangeSlider',
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            label: {
                type: String,
                default: undefined,
            },
            step: {
                type: Number,
                default: 1,
            },
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                required: true,
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
                showMaskOnHover: false,
                min: vm.min,
                max: vm.max,
            },
            defaultValue: [ vm.min, vm.max ],
        } ),
        computed: {
            isFilled: vm => vm.value.length,
            compValue: {
                get: vm => vm.value.length ? vm.value : vm.defaultValue,
                set( value ) {
                    value = value.length ? value : this.defaultValue;

                    const { min, max } = this;
                    const [ from, to ] = value;

                    this.resizeInputs( value );
                    this.$emit( 'input', ( from !== min || to !== max ) ? value : [] );
                },
            },
        },
        mounted() {
            this.resizeInputs( this.value.length ? this.value : this.defaultValue );
        },
        methods: {
            onInsideClick( event ) {
                const input = event.target.closest( 'input' ) || this.$refs.min;

                setTimeout( () => {
                    input.focus();
                }, 0 );

                this.isFocused = true;
            },
            onOutsideClick() {
                this.isFocused = false;
            },
            onInput( event ) {
                const { target } = event;
                const { inputmask } = target;
                const index = +( target === this.$refs.max );
                const copy = this.compValue.concat();

                copy[index] = +inputmask.unmaskedvalue();
                this.compValue = copy;
            },
            onSliderInput( value ) {
                this.compValue = value.map( item => Math.round( item / this.step ) * this.step );
            },
            onChange( value ) {
                this.$emit( 'change', value );
            },
            resizeInputs( value ) {
                const inputs = [ this.$refs.min, this.$refs.max ];

                inputs.forEach( ( input, index ) => {
                    this.resizeInput( value[index], input );
                } );
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
