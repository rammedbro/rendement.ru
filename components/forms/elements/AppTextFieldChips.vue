<template>
    <div class="l-text-field-chips l-input-chips">
        <!-- Текстовое поле -->
        <v-combobox :value="value"
                    :placeholder="placeholder"
                    multiple outlined append-icon=""
                    hide-details
                    @input="onInput">
            <template v-slot:selection></template>
        </v-combobox>

        <div v-if="value.length > 0"
             class="l-input-chips__chips">
            <v-row dense>
                <!-- Чипсы с результатми -->
                <v-col v-for="(text, index) in value" :key="index"
                       cols="auto">
                    <v-chip close
                            @click:close="remove( index )">
                        {{ text }}
                    </v-chip>
                </v-col>

                <!-- Кнопка "Очистить -->
                <v-col cols="12">
                    <v-btn color="primary"
                           rounded outlined x-small
                           @click="clear">
                        Очистить
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppTextFieldChips',
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            placeholder: {
                type: String,
                default: '',
            },
        },
        methods: {
            onInput( value ) {
                this.$emit( 'input', value );
            },
            remove( index ) {
                const value = this.value.concat();

                value.splice( index, 1 );
                this.onInput( value );
            },
            clear() {
                this.onInput( [] );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-text-field-chips {
        .v-select {
            &.v-input--is-dirty:not(.v-input--is-focused) {
                ::-webkit-input-placeholder {
                    color: map_get($grey, 'lighten-1') !important;
                }
            }
        }
    }
</style>