<template>
    <div class="l-catalog">
        <slot v-if="value"
              name="default">
            <v-container>
                <slot v-if="!disableBreadcrumbs"
                      name="breadcrumbs">
                    <app-breadcrumbs v-if="value.breadcrumbs && value.breadcrumbs.length"
                                     :items="value.breadcrumbs"
                                     class="mb-8"/>
                </slot>

                <slot name="title">
                    <h1 v-if="meta"
                        class="text-h3 mb-4 mb-lg-8">
                        {{ value.meta.h1 }}
                    </h1>
                </slot>

                <v-row>
                    <!-- Сайдбар -->
                    <v-col v-if="!disableSidebar"
                           cols="12" lg="4">
                        <slot name="sidebar">
                            <!-- Меню -->
                            <l-catalog-menu v-if="!disableMenu"
                                            :info-block-id="value.infoBlockId"
                                            :section-id="value.sectionId"
                                            :content="value.menu"
                                            :item-type="menuItemType">
                                <template v-slot:items="data">
                                    <slot name="menu" v-bind="data"></slot>
                                </template>
                            </l-catalog-menu>
                        </slot>
                    </v-col>

                    <!-- Контент -->
                    <v-col>
                        <v-row v-if="value.type === 'section'"
                               dense>
                            <!-- Разделы -->
                            <v-col v-if="!disableSections"
                                   cols="12">
                                <l-catalog-sections v-bind="sections"
                                                    :info-block-id="value.infoBlockId"
                                                    :section-id="value.sectionId"
                                                    :content="value.content.sections"
                                                    :item-type="sectionPreviewType">
                                    <template v-slot:items="data">
                                        <slot name="sections" v-bind="data"></slot>
                                    </template>

                                    <template v-slot:item="data">
                                        <slot name="section.preview" v-bind="data"></slot>
                                    </template>
                                </l-catalog-sections>
                            </v-col>

                            <!-- Элементы -->
                            <v-col v-if="!disableElements"
                                   cols="12">
                                <l-catalog-elements v-bind="elements"
                                                    :info-block-id="value.infoBlockId"
                                                    :section-id="value.sectionId"
                                                    :content="value.content.elements"
                                                    :item-type="elementPreviewType">
                                    <template v-slot:items="data">
                                        <slot name="elements" v-bind="data"></slot>
                                    </template>

                                    <template v-slot:item="data">
                                        <slot name="element.preview" v-bind="data"></slot>
                                    </template>
                                </l-catalog-elements>
                            </v-col>
                        </v-row>

                        <!-- Детальная страница -->
                        <l-catalog-element v-if="value.type === 'element'"
                                           :info-block-id="value.infoBlockId"
                                           :section-id="value.sectionId"
                                           :content="value.content"
                                           :type="elementDetailType">
                            <template v-slot:default="data">
                                <slot name="element.detail" v-bind="data"></slot>
                            </template>
                        </l-catalog-element>
                    </v-col>
                </v-row>
            </v-container>
        </slot>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import LCatalogMenu             from '~/components/core/catalog/LCatalogMenu';
    import LCatalogSections         from '~/components/core/catalog/LCatalogSections';
    import LCatalogElements         from '~/components/core/catalog/LCatalogElements';
    import LCatalogElement          from '~/components/core/catalog/LCatalogElement';
    import AppBreadcrumbs           from '~/components/ui/AppBreadcrumbs';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntCatalog }           from '~/lib/types/catalog';

    export default {
        name: 'LCatalog',
        components: { AppBreadcrumbs, LCatalogElement, LCatalogMenu, LCatalogElements, LCatalogSections },
        props: {
            content: {
                type: Object,
                default: undefined,
            },
            meta: {
                type: Boolean,
                default: true,
            },
            breadcrumbs: {
                type: Boolean,
                default: true,
            },
            menu: {
                type: Boolean,
                default: true,
            },
            sections: {
                type: Object,
                default: () => ( {
                    limit: 25,
                    paginationPathKey: 's-page',
                    includeSubsections: false,
                } ),
            },
            elements: {
                type: Object,
                default: () => ( {
                    limit: 25,
                    paginationPathKey: 'page',
                    includeSubsections: false,
                } ),
            },
            menuItemType: {
                type: Object,
                default: undefined,
            },
            sectionPreviewType: {
                type: Object,
                default: undefined,
            },
            elementPreviewType: {
                type: Object,
                default: undefined,
            },
            elementDetailType: {
                type: Object,
                default: undefined,
            },
            disableBreadcrumbs: {
                type: Boolean,
                default: false,
            },
            disableSidebar: {
                type: Boolean,
                default: false,
            },
            disableMenu: {
                type: Boolean,
                default: false,
            },
            disableFilter: {
                type: Boolean,
                default: false,
            },
            disableSections: {
                type: Boolean,
                default: false,
            },
            disableElements: {
                type: Boolean,
                default: false,
            },
        },
        head: vm => vm.value && vm.meta && {
            title: vm.value.meta.title,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: vm.value.meta.description,
                },
            ],
        },
        data: vm => ( {
            value: vm.content,
            pathChangeTimeout: null,
            axiosCancelTokenSource: null,
        } ),
        watch: {
            $route( value, old ) {
                if ( value.path !== old.path ) {
                    this.onPathChange();
                }
            },
        },
        created() {
            if ( !this.value ) {
                this.getDataFromApi();
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost' ] ),
            onPathChange() {
                clearTimeout( this.pathChangeTimeout );

                this.pathChangeTimeout = setTimeout( () => {
                    this.getDataFromApi()
                        .then( this.$vuetify.goTo( this.$el ) );
                }, 500 );
            },
            getDataFromApi() {
                if ( this.axiosCancelTokenSource ) {
                    this.axiosCancelTokenSource.cancel();
                }

                this.axiosCancelTokenSource = this.$axios.CancelToken.source();

                const { path, query } = this.$route;
                const { meta, breadcrumbs, menu, sections, elements } = this;

                return this
                    .apiPost( {
                        url: '/api/getCatalog/',
                        data: {
                            path,
                            meta,
                            breadcrumbs,
                            menu,
                            sections: sections
                                ? {
                                    ...sections,
                                    page: +query[sections.paginationPathKey] || 1,
                                }
                                : null,
                            elements: elements
                                ? {
                                    ...elements,
                                    page: +query[elements.paginationPathKey] || 1,
                                }
                                : null,
                        },
                        cancelToken: this.axiosCancelTokenSource.token,
                    } )
                    .then( result => {
                        if ( !this.value ) {
                            this.value = {};
                        }

                        Object.assign( this.value, checkObjectInterface( result, IntCatalog ) );
                    } )
                    .catch( e => {
                        console.log( e.message );
                        this.showAppDialog( 'error' );
                    } );
            },
        },
    };
</script>
