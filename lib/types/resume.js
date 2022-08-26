import { createObjectInterface } from '~/lib/classes/utility';
import {
    IntLocation,
    IntUser,
    IntCategory,
    IntDocFile,
}                                from '~/lib/types/other';

export const IntResumeMap = createObjectInterface( 'ResumeMap', {
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
    salary: {
        type: Number,
        default: null,
    },
    author: {
        type: IntUser,
        required: true,
    },
    location: {
        type: IntLocation,
        default: null,
    },
} );

export const IntResumePreview = createObjectInterface( 'ResumePreview', {
    ...IntResumeMap,
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
} );

export const IntResumeDetail = createObjectInterface( 'ResumeDetail', {
    ...IntResumePreview,
    moderation: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        arrayOf: String,
        required: true,
    },
    experienceId: {
        type: Number,
        required: true,
    },
    birthDay: {
        type: Number,
        default: null,
    },
    placeOfResidence: {
        type: IntLocation,
        default: null,
    },
    docs: {
        type: Array,
        arrayOf: IntDocFile,
        required: true,
    },
} );

export default {
    IntResumeMap,
    IntResumePreview,
    IntResumeDetail,
};
