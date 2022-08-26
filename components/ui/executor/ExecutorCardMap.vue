<template>
    <v-card nuxt :to="link"
            elevation="0"
            min-width="288"
            class="executor-card-map">
        <div class="pa-4 list-mb-2">
            <!-- Рейтинг пользователя -->
            <executor-rating-small :value="value"
                                   class="mt-auto"/>

            <!-- Адрес месторождения -->
            <v-layout align-center=""
                      class="grey--text text--lighten-1">
                <v-icon size="16" class="material-icons-outlined mr-2">place</v-icon>
                <app-optional-field :value="value.location"
                                    class="text-small-2">
                    <template v-slot="{ value: location }">
                        <span :title="location.title">{{ location.title }}</span>
                    </template>
                </app-optional-field>
            </v-layout>
        </div>
    </v-card>
</template>

<script>
    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';
    import AppOptionalField    from '~/components/ui/AppOptionalField';

    export default {
        name: 'ExecutorCardMap',
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
            link: vm => vm.isLink ? `/executors/${ vm.value.id }/` : null,
        },
    };
</script>
