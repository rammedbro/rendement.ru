<template>
    <v-select :value="value"
              :items="items"
              :loading="loading"
              :item-text="itemText"
              :item-value="itemValue"
              :return-object="returnObject"
              :rules="rules"
              :multiple="multiple"
              :hide-details="hideDetails"
              :clearable="clearable"
              outlined
              :readonly="readonly"
              :no-data-text="noDataText"
              append-icon="mdi-chevron-down"
              :label="label"
              :menu-props="listOptions"
              @input="onInput"
              @change="onChange">
        <template v-if="multiple"
                  v-slot:selection="{ index }">
            <div v-if="index === 0"
                 class="text-subtitle-2">
                Выбрано: {{ value.length }}
            </div>
        </template>

        <template v-slot:no-data>
            <slot name="no-data"></slot>
        </template>
    </v-select>
</template>

<script>
    export default {
        name: 'AppSelect',
        props: {
            value: {
                type: [ Number, String, Array, Object ],
                default: null,
            },
            items: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            label: {
                type: String,
                default: '',
            },
            itemText: {
                type: String,
                default: 'text',
            },
            itemValue: {
                type: String,
                default: 'value',
            },
            noDataText: {
                type: String,
                default: '',
            },
            hideDetails: {
                type: Boolean,
                default: false,
            },
            rules: {
                type: Array,
                default: () => [],
            },
            clearable: {
                type: Boolean,
                default: false,
            },
            returnObject: {
                type: Boolean,
                default: false,
            },
            returnIndex: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            listMaxWidth: null,
        } ),
        computed: {
            listOptions: vm => ( {
                offsetY: true,
                maxWidth: vm.listMaxWidth || ( vm.$el && vm.$el.offsetWidth ) || undefined,
            } ),
        },
        watch: {
            items( items ) {
                if ( !Array.isArray( this.value ) || !this.value.length ) return;

                let isValueChange = false;
                const filteredValue = this.value.filter( value => {
                    const item = items.find( item => item[this.itemValue] === value );
                    isValueChange = !item;

                    return item;
                } );

                if ( isValueChange ) {
                    this.$emit( 'input', filteredValue );
                }
            },
        },
        mounted() {
            this.listMaxWidth = this.$el.offsetWidth;
        },
        methods: {
            onInput( value ) {
                const result = this.returnIndex ? this.findIndex( value ) : value;
                this.$emit( 'input', result );
            },
            onChange( value ) {
                const result = this.returnIndex ? this.findIndex( value ) : value;
                this.$emit( 'change', result );
            },
            findIndex( value ) {
                return this.items.findIndex( item => item === value );
            },
        },
    };
</script>