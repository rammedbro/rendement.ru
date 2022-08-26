import { createObjectInterface } from '~/lib/classes/utility';

export const IntReviewAuthor = createObjectInterface( 'ReviewAuthor', {
    name: {
        type: String,
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
} );

export const IntReview = createObjectInterface( 'Review', {
    taskId: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    datePublishing: {
        type: Number,
        required: true,
    },
    author: {
        type: IntReviewAuthor,
        required: true,
    },
    comment: {
        type: String,
        default: null,
    },
} );

export default {
    IntReview,
    IntReviewAuthor,
};