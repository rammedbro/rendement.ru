import { createObjectInterface } from '~/lib/classes/utility';

export const IntCategory = createObjectInterface( 'Category', {
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
} );

export const IntSubCategory = createObjectInterface( 'SubCategory', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
} );

export const IntCategoryTree = createObjectInterface( 'CategoryTree', {
    ...IntCategory,
    subCategories: {
        type: Array,
        arrayOf: IntSubCategory,
        required: true,
    },
    showOnIndex: {
        type: Boolean,
        default: false,
    },
} );

export const IntImageFile = createObjectInterface( 'ImageFile', {
    id: {
        type: Number,
        required: true,
    },
    preview: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
} );

export const IntDocFile = createObjectInterface( 'DocFile', {
    id: {
        type: Number,
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
} );

export const IntLocation = createObjectInterface( 'Location', {
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    coords: {
        type: Array,
        arrayOf: Array,
        required: true,
    },
} );

export const IntPortfolio = createObjectInterface( 'Portfolio', {
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        arrayOf: IntImageFile,
        required: true,
    },
} );

export const IntUser = createObjectInterface( 'User', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    likeCount: {
        type: Number,
        required: true,
    },
    dislikeCount: {
        type: Number,
        required: true,
    },
    lastName: {
        type: String,
        default: null,
    },
    companyName: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
} );

export const IntUserContacts = createObjectInterface( 'UserContacts', {
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
} );

export const IntNotification = createObjectInterface( 'Notification', {
    id: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    datePublishing: {
        type: Number,
        required: true,
    },
    subjectType: {
        type: String,
        default: null,
    },
    subjectId: {
        type: Number,
        required: object => !!object.subjectType,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
} );

export const IntTransaction = createObjectInterface( 'Transaction', {
    typeId: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    sign: {
        type: String,
        required: true,
    },
} );

export const IntBalanceHistory = createObjectInterface( 'BalanceHistory', {
    id: {
        type: Number,
        required: true,
    },
    operation: {
        type: IntTransaction,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    sum: {
        type: Number,
        required: true,
    },
} );

export const IntUsefulLink = createObjectInterface( 'UsefulLink', {
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
} );

export const IntMetaData = createObjectInterface( 'MetaData', {
    h1: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    beforeContent: {
        type: String,
        default: null,
    },
    afterContent: {
        type: String,
        default: null,
    },
} );

export const IntDictionaryItem = createObjectInterface( 'DictionaryItem', {
    value: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
} );

export const IntBreadcrumbItem = createObjectInterface( 'BreadcrumbItem', {
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
} );

export default {
    IntCategory,
    IntSubCategory,
    IntCategoryTree,
    IntImageFile,
    IntDocFile,
    IntLocation,
    IntUser,
    IntUserContacts,
    IntPortfolio,
    IntNotification,
    IntBalanceHistory,
    IntUsefulLink,
    IntMetaData,
    IntDictionaryItem,
    IntBreadcrumbItem,
};
