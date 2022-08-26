import { createObjectInterface } from '~/lib/classes/utility';

export const IntApiResponse = createObjectInterface( 'ApiResponse', {
    errorCode: {
        type: Number,
        required: true,
    },
    errorMessage: {
        type: String,
        required: true,
    },
    result: {
        type: undefined,
        default: null,
    },
} );

export const IntCatalogResponse = createObjectInterface( 'CatalogResponse', {
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

export const IntSSEResponse = createObjectInterface( 'SSEResponse', {
    type: {
        type: String,
        required: true,
    },
    data: {
        type: undefined,
        default: null,
    },
} );

export const IntWebsocketResponse = createObjectInterface( 'WebsocketResponse', {
    type: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: object => object.type === 'message',
    },
    data: {
        type: undefined,
        default: null,
    },
} );

export default {
    IntApiResponse,
    IntCatalogResponse,
    IntSSEResponse,
    IntWebsocketResponse,
};