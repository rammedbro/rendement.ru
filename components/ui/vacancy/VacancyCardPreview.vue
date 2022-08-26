<template>
    <app-card :min-width="minWidth"
              :max-width="maxWidth"
              min-height="148"
              :link="link"
              hover
              class="vacancy-card-preview">
        <template v-slot:left>
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  :link="link"
                                  :display-actions="displayActions"
                                  class="mb-4"
                                  @delete="setVacancyFinished"/>

            <!-- Категория -->
            <div class="text-small-1 text--secondary mb-1">
                {{ value.category.name }}
            </div>

            <!-- Название -->
            <div class="text-h5 text-ellipsis"
                 :title="value.title">
                {{ value.title }}
            </div>

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
            <app-optional-field :value="value.salary"
                                class="text-h5 mb-4">
                <template v-slot="{ value: salary }">
                    <span class="postfix--rubles">от {{ salary.toLocaleString() }}</span>
                </template>

                <template v-slot:empty>Отсутствует</template>
            </app-optional-field>

            <!-- Заказчик -->
            <executor-rating-small :value="value.author"
                                   class="mt-auto mb-4"/>

            <v-btn color="primary"
                   width="115"
                   x-small>
                Подробнее
            </v-btn>
        </template>
    </app-card>
</template>

<script>
    import { mapActions }        from 'vuex';
    import { VCol }              from 'vuetify/lib';
    import { TASK_STATUS_CLOSE } from '~/lib/constants/task';
    import ExecutorRatingSmall   from '~/components/ui/executor/ExecutorRatingSmall';
    import TaskCardStatusBar     from '~/components/ui/task/TaskCardStatusBar';
    import AppCard               from '~/components/ui/AppCard';
    import AppOptionalField      from '~/components/ui/AppOptionalField';
    import AppTextLimiter        from '~/components/ui/AppTextLimiter';

    export default {
        name: 'VacancyCardPreview',
        components: {
            VCol,
            AppTextLimiter,
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
            displayActions: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            components: {
                VCol,
            },
        } ),
        computed: {
            link: vm => vm.isLink ? `/vacancies/${ vm.value.id }/` : null,
            datePublishingFormat: vm => {
                const date = new Date( vm.value.datePublishing );
                const dateString = date.toLocaleString( 'ru', { month: 'long', day: 'numeric' } );
                const timeString = date.toLocaleTimeString( 'ru', { hour: 'numeric', minute: 'numeric' } );

                return `${ dateString } в ${ timeString }`;
            },
        },
        methods: {
            ...mapActions( 'user', [ 'setVacancyStatus' ] ),
            setVacancyFinished() {
                this.setVacancyStatus( {
                    id: this.value.id,
                    statusId: TASK_STATUS_CLOSE,
                } )
                    .then( res => {
                        this.value.statusId = TASK_STATUS_CLOSE;
                    } );
            },
        },
    };
</script>
