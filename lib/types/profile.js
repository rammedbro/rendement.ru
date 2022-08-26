import { createObjectInterface } from '~/lib/classes/utility';
import { LEGAL_PERSON }          from '~/lib/constants/user';
import {
    IntCategoryTree,
    IntLocation,
    IntDictionaryItem,
}                                from '~/lib/types/other';

export const IntProfilePreview = createObjectInterface( 'ProfilePreview', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userGroup: {
        type: IntDictionaryItem,
        required: true,
    },
    email: {
        type: String,
        required: object => object.personTypeId === LEGAL_PERSON,
    },
    phone: {
        type: String,
        required: true,
    },
    isExecutor: {
        type: Boolean,
        required: true,
    },
    lastName: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
    typeOfUserGroup: {
        type: Number,
        required: true,
    },
} );

export const IntProfileDetail = createObjectInterface( 'ProfileDetail', {
    ...IntProfilePreview,
    userGroup: {
        type: IntDictionaryItem,
        required: true,
    },
    isOnline: {
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
    rating: {
        type: Number,
        required: true,
    },
    isCardBind: {
        type: Boolean,
        required: true,
    },
    companyName: {
        type: String,
        required: object => object.personTypeId === LEGAL_PERSON,
        default: null,
    },
    categories: {
        type: Array,
        arrayOf: IntCategoryTree,
        required: object => object.isExecutor,
        default: null,
    },
    location: {
        type: IntLocation,
        required: object => object.isExecutor,
        default: null,
    },
    locationRadius: {
        type: Number,
        default: null,
    },
    dateLastVisit: {
        type: Number,
        required: object => !object.isOnline,
        default: null,
    },
    sexId: {
        type: Number,
        default: null,
    },
    birthDay: {
        type: Number,
        default: null,
    },
    about: {
        type: String,
        default: null,
    },
    secondName: {
        type: String,
        default: null,
    },
    emailNotification: {
        type: Boolean,
        default: null,
    },
    phoneNotification: {
        type: Boolean,
        default: null,
    },
} );

export default {
    IntProfilePreview,
    IntProfileDetail,
};
