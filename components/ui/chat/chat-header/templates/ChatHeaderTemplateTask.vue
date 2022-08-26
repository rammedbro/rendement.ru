<template>
    <chat-header-template-default :value="value">
        <!-- Вторая строчка в шапке: Десктоп -->
        <template v-slot:header-second-line.desktop>
            <nuxt-link :to="taskLink"
                       :title="task.title"
                       class="d-block link text-subtitle-2 text-ellipsis">
                {{ task.title }}
            </nuxt-link>
        </template>

        <!-- Вторая строчка в шапке: Десктоп -->
        <template v-slot:header-second-line.mobile>
            <nuxt-link :to="taskLink"
                       :title="task.title"
                       class="d-block link text-small-3 text-ellipsis">
                {{ task.title }}
            </nuxt-link>
        </template>

        <template v-slot:after-header>
            <!-- Бюджет задания -->
            <v-container class="container--dense">
                <v-row align="center">
                    <v-col>
                        <div class="text-small-3">Окончательный бюджет</div>
                        <div class="text-subtitle-2 postfix--rubles">
                            {{ task.price.toLocaleString() }}
                        </div>
                    </v-col>

                    <v-col v-if="isUserTaskAuthor"
                           cols="auto">
                        <nuxt-link :to="`${ taskLink }?edit=true`"
                                   class="link--unstyled">
                            <span class="text-small-1">Редактировать бюджет</span>
                            <v-icon color="primary">mdi-pencil-circle</v-icon>
                        </nuxt-link>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </chat-header-template-default>
</template>

<script>
    import { mapGetters } from 'vuex';

    import ChatHeaderTemplateDefault from '~/components/ui/chat/chat-header/templates/ChatHeaderTemplateDefault';

    export default {
        name: 'ChatHeaderTemplateTask',
        components: { ChatHeaderTemplateDefault },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            task: vm => vm.value.data.task,
            taskLink: vm => `/tasks/${ vm.task.id }/`,
            isUserTaskAuthor: vm => vm.task.authorId === vm.userId,
        },
    };
</script>