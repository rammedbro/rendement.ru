<template>
    <v-card nuxt :to="link"
            elevation="0"
            class="task-card-map">
        <!-- Категория -->
        <div class="text-small-2 text--secondary mb-2">
            {{ value.category.name }}
        </div>

        <!-- Заголовок -->
        <div class="text-subtitle-1 text-ellipsis mb-2"
             :title="value.title">
            {{ value.title }}
        </div>

        <!-- Цена -->
        <div class="text-subtitle-1 postfix--rubles mb-2">
            {{ value.price.toLocaleString() }}
        </div>

        <!-- Место проведения -->
        <v-layout align-center=""
                  class="grey--text text--lighten-1 mb-4">
            <v-icon size="16" class="material-icons-outlined mr-2">place</v-icon>
            <app-optional-field :value="value.location"
                                class="text-small-2">
                <template v-slot="{ value: location }">
                    <span :title="location.title">{{ location.title }}</span>
                </template>
            </app-optional-field>
        </v-layout>

        <!-- Заказчик -->
        <executor-rating-small :value="value.author"
                               :is-link="false"
                               class="mt-auto"/>
    </v-card>
</template>

<script>
    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';
    import AppOptionalField    from '~/components/ui/AppOptionalField';

    export default {
        name: 'TaskCardMap',
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
            link: vm => vm.isLink ? `/tasks/${ vm.value.id }/` : null,
        },
    };
</script>

<style lang="scss" scoped>
    .task-card-map {
        padding: 16px;
    }
</style>
