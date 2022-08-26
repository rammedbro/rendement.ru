import { createObjectInterface } from '~/lib/classes/utility';

export const IntSectionMenu = createObjectInterface( 'SectionMenu', {
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
} );

export const IntSectionMenuTree = createObjectInterface( 'SectionMenuTree', {
    ...IntSectionMenu,
    sections: {
        type: Array,
        arrayOf: this,
        required: true,
    },
} );

export const IntSectionItemContent = createObjectInterface( 'SectionItemContent', {
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
} );

export const IntSectionItem = createObjectInterface( 'SectionItemContent', {
    ...IntSectionMenu,
    items: {
        type: Array,
        arrayOf: IntSectionItemContent,
        required: true,
    },
} );

export const IntSectionItemTree = createObjectInterface( 'SectionItemTree', {
    ...IntSectionMenuTree,
    items: {
        type: Array,
        arrayOf: IntSectionItemContent,
        required: true,
    },
} );

export default {
    IntSectionMenu,
    IntSectionItemTree,
    IntSectionItem,
    IntSectionMenuTree,
    IntSectionItemContent,
};