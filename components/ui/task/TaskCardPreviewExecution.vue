<template>
    <div class="text-card-preview-execution">
        <!-- Пользователь - Автор -->
        <template v-if="isUserTaskAuthor">
            <task-execution-as-author v-if="isTaskHasExecutor"
                                      :value="value"/>

            <!-- Количество откликов -->
            <v-chip v-else-if="value.arResponseAuthorId.length > 0"
                    small
                    nuxt :to="{ path: `/tasks/${ value.id }/`, hash: '#responses' }"
                    class="task-execution-responses grey lighten-1 white--text">
                {{ responseCountFormat }}
            </v-chip>
        </template>

        <!-- Пользователь - Исполнитель -->
        <task-execution-as-executor v-if="isUserResponseToTask"
                                    :value="value"/>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import TaskExecutionAsAuthor   from '~/components/ui/task/TaskExecutionAsAuthor';
    import TaskExecutionAsExecutor from '~/components/ui/task/TaskExecutionAsExecutor';
    import { pickNumeralEnding }   from '~/lib/classes/utility';

    export default {
        name: 'TaskCardPreviewExecution',
        components: { TaskExecutionAsExecutor, TaskExecutionAsAuthor },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        data: vm => ( {
            valueWatch: vm.value,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            isUserTaskAuthor: vm => vm.valueWatch.author.id === vm.userId,
            isUserTaskExecutor: vm => vm.valueWatch.executorId === vm.userId,
            isUserResponseToTask: vm => vm.valueWatch.arResponseAuthorId.includes( vm.userId ),
            isTaskHasExecutor: vm => vm.valueWatch.executorId !== null,
            responseCountFormat: vm => {
                const count = vm.valueWatch.arResponseAuthorId.length;
                return `${ count } отклик` + pickNumeralEnding( count, [ '', 'а', 'ов' ] );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .task-execution-responses {
        position: absolute;
        top: -12px;
        right: -12px;
    }
</style>