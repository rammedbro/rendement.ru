import { createObjectInterface, pickObjectInterface } from '~/lib/classes/utility';
import { IntDictionaryItem }                          from '~/lib/types/other';

export const IntChatUser = createObjectInterface( 'ChatUser', {
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
    personTypeId: {
        type: Number,
        required: true,
    },
    isOnline: {
        type: Boolean,
        required: true,
    },
    phone: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
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

export const IntTaskChatData = createObjectInterface( 'TaskChatData', {
    task: {
        type: {
            id: {
                type: Number,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            authorId: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
    execution: {
        type: {
            statusId: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
} );

export const IntChat = createObjectInterface( 'Chat', {
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: IntTaskChatData,
        required: object => object.type === 'task',
        default: null,
    },
    users: {
        type: Array,
        arrayOf: IntChatUser,
        required: true,
    },
    lastMessageDate: {
        type: Number,
        default: null,
    },
} );

export const IntChatMessage = createObjectInterface( 'ChatMessage', {
    id: {
        type: String,
        required: true,
    },
    stateId: {
        type: Number,
        required: true,
    },
    isService: {
        type: Boolean,
        required: true,
    },
    user: {
        type: pickObjectInterface( IntChatUser, [ 'id', 'name' ] ),
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
} );

export const IntUnseenChatMessageCount = createObjectInterface( 'UnseenChatMessageCount', {
    chatId: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
} );

export default {
    IntChat,
    IntChatUser,
    IntTaskChatData,
    IntChatMessage,
    IntUnseenChatMessageCount,
};
