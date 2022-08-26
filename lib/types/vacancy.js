import {
    createObjectInterface,
} from '~/lib/classes/utility';
import {
    IntLocation,
    IntUser,
    IntCategory,
} from '~/lib/types/other';

export const IntVacancyMap = createObjectInterface( 'VacancyMap', {
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
    salary: {
        type: Number,
        default: null,
    },
    location: {
        type: IntLocation,
        default: null,
    },
} );

export const IntVacancyPreview = createObjectInterface( 'VacancyPreview', {
    ...IntVacancyMap,
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

export const IntClientVacancy = createObjectInterface( 'IntClientVacancy', {
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    resumes: {
        type: Array,
        required: true,
    },
    docs: {
        type: Array,
        required: true,
    },
    statusId: {
        type: Number,
        required: true,
    },
    datePublishing: {
        type: Number,
        required: true,
    },
} );

export const IntVacancyDetail = createObjectInterface( 'VacancyDetail', {
    ...IntVacancyPreview,
    moderation: {
        type: Boolean,
        required: true,
    },
    landOwner: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: Array,
        arrayOf: String,
        required: true,
    },
    experienceId: {
        type: Number,
        default: null,
    },
} );

export default {
    IntVacancyMap,
    IntVacancyPreview,
    IntVacancyDetail,
    IntClientVacancy,
};
