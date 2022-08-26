import {
    createObjectInterface,
} from '~/lib/classes/utility';

import {
    TASK_EXECUTION_NULL,
    TASK_EXECUTION_COMPLAINED,
    TASK_EXECUTION_CONFIRMED,
    TASK_EXECUTION_FINISHED,
} from '~/lib/constants/task';

import {
    IntCategory,
    IntLocation,
    IntSubCategory,
    IntImageFile,
    IntDocFile,
    IntUser,
} from '~/lib/types/other';

export const IntTaskExecution = createObjectInterface( 'TaskExecution', {
    arResponseAuthorId: {
        type: Array,
        arrayOf: Number,
        required: true,
    },
    executorId: {
        type: Number,
        default: null,
    },
    commission: {
        type: Number,
        required: true,
    },
} );

export const IntTaskMap = createObjectInterface( 'TaskMap', {
    id: {
        type: Number,
        required: true,
    },
    category: {
        type: IntCategory,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: IntUser,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: IntLocation,
        default: null,
    },
} );

export const IntTaskPreview = createObjectInterface( 'TaskPreview', {
    ...IntTaskMap,
    statusId: {
        type: Number,
        required: true,
    },
    viewCount: {
        type: Number,
        required: true,
    },
    datePublishing: {
        type: Number,
        required: true,
    },
    subCategory: {
        type: IntSubCategory,
        required: true,
    },
    safeDeal: {
        type: Boolean,
        required: true,
    },
    dateStart: {
        type: Number,
        default: null,
    },
    dateEnd: {
        type: Number,
        default: null,
    },
} );

export const IntTaskDetail = createObjectInterface( 'TaskDetail', {
    ...IntTaskPreview,
    ...IntTaskExecution,
    images: {
        type: Array,
        arrayOf: IntImageFile,
        required: true,
    },
    hiddenImages: {
        type: Array,
        arrayOf: IntImageFile,
        required: true,
    },
    docs: {
        type: Array,
        arrayOf: IntDocFile,
        required: true,
    },
    hiddenDocs: {
        type: Array,
        arrayOf: IntDocFile,
        required: true,
    },
    paymentsByAgreement: {
        type: Array,
        arrayOf: Number,
        required: true,
    },
    requirements: {
        type: Array,
        arrayOf: String,
        required: true,
    },
    moderation: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
} );

export const IntTaskExecutionUser = createObjectInterface( 'TaskExecutionUser', {
    ...IntUser,
    chatId: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: object =>
            object.statusId > TASK_EXECUTION_CONFIRMED &&
            object.statusId < TASK_EXECUTION_COMPLAINED,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
} );

export const IntTaskExecutionProcessAsExecutor = createObjectInterface(
    'TaskExecutionProcessAsExecutor', {
        statusId: {
            type: Number,
            required: true,
        },
        executor: {
            type: IntTaskExecutionUser,
            required: object => object.statusId > TASK_EXECUTION_NULL,
            default: null,
        },
        author: {
            type: IntTaskExecutionUser,
            required: object => object.statusId > TASK_EXECUTION_NULL,
            default: null,
        },
        isReviewLeft: {
            type: Boolean,
            required: object => object.statusId === TASK_EXECUTION_FINISHED,
            default: null,
        },
    } );

export const IntTaskExecutionProcessAsAuthor = createObjectInterface(
    'TaskExecutionProcessAsAuthor', {
        ...IntTaskExecutionProcessAsExecutor,
        paymentLink: {
            type: String,
            required: object =>
                object.safeDeal && object.statusId === TASK_EXECUTION_CONFIRMED,
            default: null,
        },
    } );

export const IntTaskResponse = createObjectInterface( 'TaskResponse', {
    id: {
        type: Number,
        required: true,
    },
    author: {
        type: {
            ...IntUser,
            chatId: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
} );

export default {
    IntTaskMap,
    IntTaskPreview,
    IntTaskDetail,
    IntTaskExecution,
    IntTaskExecutionUser,
    IntTaskExecutionProcessAsAuthor,
    IntTaskExecutionProcessAsExecutor,
    IntTaskResponse,
};
