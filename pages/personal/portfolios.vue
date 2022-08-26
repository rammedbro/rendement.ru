<template>
    <v-card>
        <template v-if="isDesktop">
            <v-container>
                <h1 class="text-h3">{{ h1 }}</h1>
            </v-container>
            <v-divider/>
        </template>

        <v-container>
            <template v-if="userIsExecutor">
                <v-row align="center" justify="space-between">
                    <v-col cols="auto">
                        <div class="text-h5 mb-2">Всего портфолио</div>
                        <div class="text-h6 mb-6">{{ userPortfolios.length }}</div>
                    </v-col>

                    <v-col cols="auto">
                        <!-- Кнопка "Создать портфолио" -->
                        <v-btn color="primary"
                               min-width="288"
                               @click="portfolioAddDialogDisplay = true">
                            Создать портфолио
                        </v-btn>
                    </v-col>
                </v-row>

                <v-divider class="my-6"/>

                <!-- Портфолио пользователя -->
                <template v-if="userPortfolios.length">
                    <app-slider :items="userPortfolios"
                                :options="{ autoWidth: true }"
                                @click="onSliderClick">
                        <template v-slot:item="{ item }">
                            <portfolio-card :value="item"
                                            enable-edit
                                            @click:edit="onPortfolioEditClick(item)"/>
                        </template>
                    </app-slider>
                </template>

                <div v-else>У Вас пока нет портфолио</div>

                <!-- Диалог создания портфолио -->
                <app-fullscreen-dialog v-model="portfolioAddDialogDisplay"
                                       title="Создание портфолио"
                                       content-class="grey lighten-5">
                    <v-card width="100%" max-width="768"
                            class="pa-4 pa-lg-8 mx-auto">
                        <portfolio-crud-form v-if="portfolioAddDialogDisplay"
                                             @success="portfolioAddDialogDisplay = false"/>
                    </v-card>
                </app-fullscreen-dialog>

                <!-- Диалог редактирования портфолио -->
                <app-fullscreen-dialog v-model="portfolioEditDialog.display"
                                       title="Редактирование портфолио"
                                       content-class="grey lighten-5">
                    <v-card width="100%" max-width="768"
                            class="pa-4 pa-lg-8 mx-auto">
                        <portfolio-crud-form v-if="portfolioEditDialog.display"
                                             v-bind="portfolioEditDialog.item"
                                             @success="portfolioEditDialog.display = false"/>
                    </v-card>
                </app-fullscreen-dialog>

                <!-- Галерея -->
                <app-fullscreen-dialog v-model="galleryDialog.display"
                                       :title="galleryDialogTitle">
                    <app-slider v-model="galleryDialog.slide"
                                :items="galleryDialog.items"
                                item-key="detail" item-class="gallery-item"
                                controls/>
                </app-fullscreen-dialog>
            </template>

            <template v-else>
                <!-- Блок "Стать исполнителем" -->
                <div class="text-h6 mb-6">Доступно для исполнителей</div>
                <app-become-executor/>
            </template>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppFullscreenDialog from '~/components/dialogs/AppFullscreenDialog';
    import AppSlider           from '~/components/ui/AppSlider';
    import AppBecomeExecutor   from '~/components/blocks/AppBecomeExecutor';
    import PortfolioCrudForm   from '~/components/ui/portfolio/PortfolioCrudForm';
    import PortfolioCard       from '~/components/ui/portfolio/PortfolioCard';

    export default {
        components: {
            PortfolioCard,
            PortfolioCrudForm,
            AppBecomeExecutor,
            AppSlider,
            AppFullscreenDialog,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Портфолио',
            portfolioAddDialogDisplay: false,
            portfolioEditDialog: {
                display: false,
                item: null,
            },
            galleryDialog: {
                display: false,
                slide: 0,
                items: [],
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsExecutor', 'userPortfolios' ] ),
            galleryDialogTitle: vm => `${ vm.galleryDialog.slide + 1 } из ${ vm.galleryDialog.items.length }`,
        },
        async fetch( { store, error } ) {
            if ( !store.getters['user/userIsExecutor'] ) return;

            try {
                await store.dispatch( 'user/getUserPortfolios' );
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        methods: {
            onSliderClick( { item } ) {
                this.galleryDialog.display = true;
                this.galleryDialog.items = item.images;
            },
            onPortfolioEditClick( item ) {
                this.portfolioEditDialog.display = true;
                this.portfolioEditDialog.item = item;
            },
        },
    };
</script>