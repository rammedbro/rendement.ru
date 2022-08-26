<template>
    <chat :value="value"/>
</template>

<script>
    import Chat from '~/components/ui/chat/Chat';

    export default {
        components: {
            Chat,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
    };
</script>