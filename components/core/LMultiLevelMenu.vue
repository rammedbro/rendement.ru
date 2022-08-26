<template>
    <div class="l-multi-level-menu">
        <!-- Десктоп: Список -->
        <v-list v-if="isDesktop"
                class="transparent">
            <!-- Кнопка назад -->
            <v-list-item v-if="current"
                         class="text-subtitle-1 l-border bwb-1"
                         @click="onChangeSection( current.sectionId )">
                Назад
            </v-list-item>

            <!-- Пунткы меню -->
            <v-list-item v-for="item in parsed[sectionId]" :key="item.id"
                         nuxt :to="item.url" exact
                         class="text-subtitle-1 l-border bwb-1">
                <v-list-item-content>
                    {{ item.name }}
                </v-list-item-content>

                <v-list-item-action v-if="parsed[item.id]">
                    <v-btn icon x-small
                           @click.prevent="onChangeSection( item.id )">
                        <v-icon color="primary">mdi-chevron-right</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>

        <!-- Мобайл: Табы -->
        <v-tabs v-if="isMobile">
            <!-- Кнопка назад -->
            <v-tab v-if="current"
                   @click="onChangeSection( current.sectionId )">
                Назад
            </v-tab>

            <!-- Пунткы меню -->
            <v-tab v-for="item in parsed[sectionId]" :key="item.id"
                   nuxt :to="item.url" exact>
                {{ item.name }}
            </v-tab>
        </v-tabs>
    </div>
</template>

<script>
    export default {
        name: 'LMultiLevelMenu',
        props: {
            value: {
                type: Number,
                default: null,
            },
            items: {
                type: Array,
                required: true,
            },
        },
        data: vm => ( {
            sectionId: vm.value,
        } ),
        computed: {
            current: vm => vm.items.find( item => item.id === vm.sectionId ),
            parsed: vm => {
                const result = {};

                vm.items.forEach( item => {
                    const { sectionId } = item;

                    if ( !( sectionId in result ) ) {
                        result[sectionId] = [];
                    }

                    result[sectionId].push( item );
                } );

                return result;
            },
        },
        watch: {
            value( value ) {
                this.sectionId = value;
            },
        },
        methods: {
            onChangeSection( sectionId ) {
                this.sectionId = sectionId;
                this.$emit( 'input', sectionId );
            },
        },
    };
</script>