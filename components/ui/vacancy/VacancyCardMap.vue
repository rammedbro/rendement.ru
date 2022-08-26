<template>
    <v-card nuxt :to="link"
            elevation="0"
            min-width="288"
            class="vacancy-card-map">
        <!-- Категория -->
        <div class="text-small-2 text--secondary mb-2">
            {{ value.category.name }}
        </div>

        <!-- Заголовок -->
        <div class="text-subtitle-1 text-ellipsis mb-2"
             :title="value.title">
            {{ value.title }}
        </div>

        <!-- Зарплата -->
        <app-optional-field :value="value.salary"
                            class="text-subtitle-1 mb-2">
            <template v-slot="{ value: salary }">
                <span class="postfix--rubles">{{ salary.toLocaleString() }}</span>
            </template>

            <template v-slot:empty>Зарплата отсутствует</template>
        </app-optional-field>

        <!-- Адрес месторождения -->
        <v-layout align-center=""
                  class="grey--text text--lighten-1 mb-4">
            <v-icon size="16" class="material-icons-outlined mr-2">place</v-icon>
            <app-optional-field :value="value.location"
                                class="text-small-1">
                <template v-slot="{ value: location }">
                    <span :title="location.title">{{ location.title }}</span>
                </template>
            </app-optional-field>
        </v-layout>

        <!-- Автор -->
        <executor-rating-small :value="value.author"
                               class="mt-auto"/>
    </v-card>
</template>

<script>
    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';
    import AppOptionalField    from '~/components/ui/AppOptionalField';

    export default {
        name: 'VacancyCardMap',
        components: { AppOptionalField, ExecutorRatingSmall },
        props: {
            value: {
                type: Object,
                required: true,
            },
            isLink: {
                type: Boolean,
                default: true,
            },
        },
        computed: {
            link: vm => vm.isLink ? `/vacancies/${ vm.value.id }/` : null,
        },
    };
</script>

<style lang="scss" scoped>
    .vacancy-card-map {
        padding: 16px;
    }
</style>