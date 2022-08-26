<template>
    <div v-click-outside="onOutsideClick"
         class="l-text-field-datepicker"
         @click="onInsideClick">
        <v-input :value="value"
                 class="l-text-field l-text-field--range v-text-field v-text-field--outlined v-text-field--is-booted v-text-field--enclosed"
                 :class="{'v-input--is-focused': isFocused, 'l-input--is-filled': isFilled}"
                 :rules="rules">
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
                    <input ref="min"
                           v-mask="mask"
                           :value="compValue[0]"
                           class="l-text-field__input"
                           @input="onInput">
                    <div class="l-text-field__input-buffer"></div>

                    <span class="black--text mx-2">-</span>

                    <input ref="max"
                           v-mask="mask"
                           :value="compValue[1]"
                           class="l-text-field__input"
                           @input="onInput">
                    <div class="l-text-field__input-buffer"></div>
                </div>
            </div>

            <!-- Иконка -->
            <div class="v-input__append-inner">
                <div class="v-input__icon v-input__icon--append">
                    <v-icon @click="dialog = true">mdi-calendar-blank</v-icon>
                </div>
            </div>
        </v-input>

        <!-- Календарь -->
        <v-dialog v-model="dialog"
                  width="320">
            <app-datepicker v-model="compValue"
                            range :min="min" :max="max"
                            @close="dialog = false"
                            @change="onChange"/>
        </v-dialog>
    </div>
</template>

<script>
    import AppDatepicker from '~/components/ui/AppDatepicker';

    export default {
        name: 'AppTextFieldRangeDatepicker',
        components: { AppDatepicker },
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            label: {
                type: String,
                default: '',
            },
            min: {
                type: String,
                default: undefined,
            },
            max: {
                type: String,
                default: undefined,
            },
            rules: {
                type: Array,
                default: () => ( [] ),
            },
        },
        data: vm => ( {
            isFocused: false,
            dialog: false,
            mask: {
                alias: 'datetime',
                inputFormat: 'dd.mm.yyyy',
                placeholder: '_',
                min: vm.min,
                max: vm.max,
                showMaskOnHover: false,
            },
        } ),
        computed: {
            isFilled: vm => vm.value.length,
            compValue: {
                get: vm => vm.value,
                set( value ) {
                    const { min, max } = this;

                    if ( value.length === 2 && this.compareDates( ...value ) === 1 ) {
                        value.reverse();
                    }

                    const [ from, to ] = value;

                    this.resizeInputs( value );
                    this.$emit( 'input', ( from !== min || to !== max ) ? value : [] );
                },
            },
        },
        mounted() {
            this.resizeInputs( this.value.length
                ? this.value
                : [
                    this.min || this.mask.inputFormat,
                    this.max || this.mask.inputFormat,
                ],
            );
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

                if ( inputmask.isValid() ) {
                    const value = inputmask.unmaskedvalue();

                    if ( this.compValue.length ) {
                        copy[index] = value;
                    } else {
                        copy.push( value );
                    }

                    this.compValue = copy;
                } else if ( target.value ) {
                    this.resizeInput( this.compValue[index], target );
                } else {
                    copy.splice( index, 1 );
                    this.compValue = copy;
                }
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

                inputBuffer.innerHTML = value;

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
            compareDates( date1, date2 ) {
                date1 = new Date( date1.split( '.' ).reverse().join( '-' ) );
                date2 = new Date( date2.split( '.' ).reverse().join( '-' ) );

                return ( date1 > date2 ) ? 1 : ( date1 === date2 ) ? 0 : -1;
            },
        },
    };
</script>
