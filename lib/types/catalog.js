import { createObjectInterface }          from '~/lib/classes/utility';
import { IntMetaData, IntBreadcrumbItem } from '~/lib/types/other';

export const IntMultiPageList = createObjectInterface( 'MultiPageList', {
    page: {
        type: Number,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    items: {
        type: Array,
        arrayOf: undefined,
        required: true,
    },
} );

export const IntCatalogSection = createObjectInterface( 'CatalogSection', {
    sections: {
        type: IntMultiPageList,
        default: undefined,
    },
    elements: {
        type: IntMultiPageList,
        default: undefined,
    },
} );

export const IntCatalog = createObjectInterface( 'Catalog', {
    type: {
        type: String,
        required: true,
    },
    infoBlockId: {
        type: Number,
        required: true,
    },
    sectionId: {
        type: Number,
        default: null,
    },
    meta: {
        type: IntMetaData,
        default: undefined,
    },
    menu: {
        type: IntMultiPageList,
        default: undefined,
    },
    breadcrumbs: {
        type: Array,
        arrayOf: IntBreadcrumbItem,
        default: undefined,
    },
    content: {
        type: object =>
            ( object.type === 'section' && IntCatalogSection ) ||
            ( object.type === 'element' && undefined ),
        required: true,
    },
} );

export const IntMenuItem = createObjectInterface( 'MenuItem', {
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
} );

export const IntMultiLevelMenuItem = createObjectInterface( 'MultiLevelMenuItem', {
    ...IntMenuItem,
    id: {
        type: Number,
        required: true,
    },
    sectionId: {
        type: Number,
        default: null,
    },
} );

export const IntCatalogSectionPreview = createObjectInterface( 'CatalogSectionPreview', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
} );

export const IntCatalogElementPreview = createObjectInterface( 'CatalogElementPreview', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
} );

export const IntCatalogElementDetail = createObjectInterface( 'CatalogElementDetail', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
} );
