<template>
    <app-card :min-width="minWidth"
              :max-width="maxWidth"
              :link="link"
              hover column
              class="executor-card-preview">
        <template v-slot:left>
            <!-- Рейтинг пользователя -->
            <executor-rating-small :value="value"/>
        </template>

        <template v-slot:right>
            <!-- О себе -->
            <app-optional-field :value="value.about"
                                class="text-body-2 mb-4">
                <template v-slot="{ value: about }">
                    {{ about.length > 145 ? `${ about.slice(0, 145) }...` : about }}
                </template>
            </app-optional-field>

            <!-- Адрес месторождения -->
            <v-row align="center" dense
                   class="grey--text text--lighten-1 text-small-1 mt-auto flex-grow-0 mb-2">
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

            <v-btn color="primary"
                   width="115"
                   x-small>
                Подробнее
            </v-btn>
        </template>
    </app-card>
</template>

<script>
    import { VCol }            from 'vuetify/lib';
    import AppCard             from '~/components/ui/AppCard';
    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';
    import AppOptionalField    from '~/components/ui/AppOptionalField';
    import AppTextLimiter      from '~/components/ui/AppTextLimiter';

    export default {
        name: 'ExecutorCardPreview',
        components: {
            VCol,
            AppTextLimiter,
            AppOptionalField,
            AppCard,
            ExecutorRatingSmall,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            isLink: {
                type: Boolean,
                default: true,
            },
            minWidth: {
                type: [ Number, String ],
                default: 288,
            },
            maxWidth: {
                type: [ Number, String ],
                default: 576,
            },
        },
        data: () => ( {
            components: {
                VCol,
            },
        } ),
        computed: {
            link: vm => vm.isLink ? `/executors/${ vm.value.id }/` : null,
        },
    };
</script>
