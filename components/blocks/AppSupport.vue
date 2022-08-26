<template>
    <v-card elevation="0">
        <v-container class="light-blue lighten-5 text-center">
            <slot name="title">
                <div class="text-h5 mb-4 primary--text">Остались вопросы?</div>
            </slot>

            <slot name="body">
                <p class="text-body-2">
                    Наша служба поддержки работает каждый день. Ответим вам на любые вопросы в чате.
                </p>
            </slot>

            <v-btn color="primary" rounded x-small
                   @click="showAppDialog('support')">
                Написать директору
            </v-btn>
        </v-container>
    </v-card>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'AppSupport',
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
        },
    };
</script>