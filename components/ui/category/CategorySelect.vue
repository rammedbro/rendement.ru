<template>
    <app-catalog :url="url"
                 :limit="limit"
                 :filter="filter"
                 :item-type="$legacy.types.IntCategoryTree"
                 :invoke-after-reach="invokeAfterReach"
                 disable-count
                 disable-pagination
                 @update:cache="onCatalogCacheUpdate">
        <template v-if="theme === 'select'"
                  v-slot:body="{ loading }">
            <app-select :value="value"
                        :items="items"
                        :rules="rules"
                        :loading="loading"
                        :readonly="readonly"
                        :hide-details="hideDetails"
                        item-text="name"
                        item-value="code"
                        :multiple="multiple"
                        label="Категория"
                        @input="onSelect"/>
        </template>

        <template v-slot:items="data">
            <slot name="items" v-bind="{ onSelect, ...data }"></slot>
        </template>
    </app-catalog>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppCatalog                      from '~/components/ui/AppCatalog';
    import AppSelect                       from '~/components/forms/elements/AppSelect';
    import { transformObjectToPlainArray } from '~/lib/classes/utility';

    export default {
        name: 'CategorySelect',
        components: { AppCatalog, AppSelect },
        props: {
            value: {
                type: [ String, Array ],
                default: undefined,
            },
            url: {
                type: String,
                required: true,
            },
            limit: {
                type: Number,
                default: 0,
            },
            filter: {
                type: Object,
                default: () => ( {} ),
            },
            rules: {
                type: Array,
                default: () => [],
            },
            hideDetails: {
                type: Boolean,
                default: false,
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            theme: {
                type: String,
                default: 'select',
            },
            invokeAfterReach: {
                type: Boolean,
                default: true,
            },
        },
        data: () => ( {
            items: [],
        } ),
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            onCatalogCacheUpdate( cache ) {
                try {
                    this.items = transformObjectToPlainArray( cache );
                    this.$emit( 'update:categories', this.items );

                    if ( this.value && this.value.length ) {
                        this.onSelect( this.value );
                    }
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
            onSelect( value ) {
                const subCategories = [];

                this.items.forEach( item => {
                    if (
                        ( this.multiple && value.includes( item.code ) ) ||
                        value === item.code
                    ) {
                        subCategories.push( ...item.subCategories );
                    }
                } );

                if ( value !== this.value ) {
                    this.$emit( 'input', value );
                }

                this.$emit( 'update:sub-categories', subCategories );
            },
        },
    };
</script>
