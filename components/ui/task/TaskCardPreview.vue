<template>
    <app-card :min-width="minWidth"
              :max-width="maxWidth"
              min-height="168"
              :link="link"
              hover>
        <template v-slot:left>
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  class="mb-4"/>

            <!-- Категория -->
            <div class="text-small-1 text--secondary mb-1">
                {{ value.category.name }}
            </div>

            <!-- Заголовок -->
            <div class="text-h5 mb-4 text-ellipsis"
                 :title="value.title">
                {{ value.title }}
            </div>

            <!-- Время проведения -->
            <v-layout align-center=""
                      class="grey--text text--lighten-1 mb-2">
                <v-icon size="16" class="mr-2">mdi-clock-outline</v-icon>

                <app-optional-field :value="dateExecutionFormat"
                                    component="span" class="text-small-1">
                    <template v-slot>{{ dateExecutionFormat }}</template>
                </app-optional-field>
            </v-layout>

            <!-- Адрес месторождения -->
            <v-row dense align="center"
                   class="grey--text text--lighten-1 text-small-1">
                <v-col cols="auto">
                    <v-icon size="16" class="material-icons-outlined">place</v-icon>
                </v-col>

                <app-text-limiter :component="components.VCol"
                                  adaptive>
                    <app-optional-field :value="value.location">
                        <template v-slot="{ value: location }">
                            <div :title="`${ location.title }, ${ location.address }`"
                                 class="text-ellipsis">
                                {{ location.title }}, {{ location.address }}
                            </div>
                        </template>
                    </app-optional-field>
                </app-text-limiter>
            </v-row>
        </template>

        <template v-slot:right>
            <!-- Цена -->
            <div class="text-h5 postfix--rubles mb-1">{{ value.price.toLocaleString() }}</div>

            <!-- Вариант оплаты -->
            <div class="text-small-3 mb-4">
                <template v-if="value.safeDeal">Безопасная сделка</template>
                <template v-else>По договоренности с исполнителем</template>
            </div>

            <!-- Заказчик -->
            <executor-rating-small :value="value.author"
                                   class="mt-auto mb-4"/>

            <v-btn color="primary"
                   width="115"
                   x-small>
                Подробнее
            </v-btn>

        </template>

        <template v-if="isTaskWithExecution"
                  v-slot:bottom>
            <task-card-preview-execution :value="value"/>
        </template>
    </app-card>
</template>

<script>
    import { VCol }                 from 'vuetify/lib';
    import AppCard                  from '~/components/ui/AppCard';
    import AppOptionalField         from '~/components/ui/AppOptionalField';
    import ExecutorRatingSmall      from '~/components/ui/executor/ExecutorRatingSmall';
    import TaskCardStatusBar        from '~/components/ui/task/TaskCardStatusBar';
    import TaskCardPreviewExecution from '~/components/ui/task/TaskCardPreviewExecution';
    import AppTextLimiter           from '~/components/ui/AppTextLimiter';
    import { formatLocaleDate }     from '~/lib/classes/utility';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntTaskExecution }     from '~/lib/types/task';

    export default {
        name: 'TaskCardPreview',
        components: {
            VCol,
            AppTextLimiter,
            TaskCardPreviewExecution,
            AppOptionalField,
            AppCard,
            TaskCardStatusBar,
            ExecutorRatingSmall,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            minWidth: {
                type: [ Number, String ],
                default: 288,
            },
            maxWidth: {
                type: [ Number, String ],
                default: 576,
            },
            isLink: {
                type: Boolean,
                default: true,
            },
        },
        data: () => ( {
            components: {
                VCol,
            },
        } ),
        computed: {
            dateExecutionFormat: vm => {
                const { dateStart, dateEnd } = vm.value;
                let result;

                if ( dateStart !== null ) {
                    result = formatLocaleDate( dateStart, 'date', { month: 'long', day: 'numeric' } );
                }

                if ( dateEnd !== null ) {
                    result += ' — ' + formatLocaleDate( dateEnd, 'date', { month: 'long', day: 'numeric' } );
                }

                return result;
            },
            link: vm => vm.isLink ? `/tasks/${ vm.value.id }/` : null,
            isTaskWithExecution: vm =>
                checkObjectInterface( vm.value, IntTaskExecution, { throwError: false } ),
        },
    };
</script>
