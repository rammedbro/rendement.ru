import { createObjectInterface } from '~/lib/classes/utility';
import {
    IntCategoryTree,
    IntLocation,
    IntUser,
    IntPortfolio,
}                                from '~/lib/types/other';

export const IntExecutorMap = createObjectInterface( 'ExecutorMap', {
    ...IntUser,
    location: {
        type: IntLocation,
        default: null,
    },
} );

export const IntExecutorPreview = createObjectInterface( 'ExecutorPreview', {
    ...IntExecutorMap,
    about: {
        type: String,
        default: null,
    },
} );

export const IntExecutorDetail = createObjectInterface( 'ExecutorDetail', {
    ...IntExecutorPreview,
    isOnline: {
        type: Boolean,
        required: true,
    },
    isExecutor: {
        type: Boolean,
        required: true,
    },
    viewCount: {
        type: Number,
        required: true,
    },
    dateRegistration: {
        type: Number,
        required: true,
    },
    personTypeId: {
        type: Number,
        required: true,
    },
    categories: {
        type: Array,
        arrayOf: IntCategoryTree,
        required: true,
    },
    portfolios: {
        type: Array,
        arrayOf: IntPortfolio,
        required: true,
    },
    dateLastVisit: {
        type: Number,
        required: object => !object.isOnline,
        default: null,
    },
    birthDay: {
        type: Number,
        default: null,
    },
} );

export default {
    IntExecutorMap,
    IntExecutorPreview,
    IntExecutorDetail,
};