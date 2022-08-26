<template>
    <chat-header-template-task v-if="template === 'task'"
                               :value="value"/>

    <chat-header-template-default v-else
                                  :value="value"/>
</template>

<script>
    import ChatHeaderTemplateTask    from '~/components/ui/chat/chat-header/templates/ChatHeaderTemplateTask';
    import ChatHeaderTemplateDefault from '~/components/ui/chat/chat-header/templates/ChatHeaderTemplateDefault';

    export default {
        name: 'ChatHeader',
        components: {
            ChatHeaderTemplateDefault,
            ChatHeaderTemplateTask,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            template: {
                type: String,
                default: 'default',
            },
        },
    };
</script>