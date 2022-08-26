<template>
    <div class="review-card">
        <v-row align="start" dense>
            <v-col cols="auto">
                <!-- Аватар -->
                <app-avatar :img="value.author.avatar"/>
            </v-col>

            <!-- Краткая информация -->
            <v-col class="list-mb-2">
                <div class="text-subtitle-1">{{ fullNameFormat }}</div>

                <nuxt-link :to="`/tasks/${ value.taskId }/`" class="link">
                    Ссылка на задание
                </nuxt-link>

                <p>{{ value.comment }}</p>

                <v-layout align-center="">
                    <v-rating :value="value.rating" readonly half-increments
                              size="16" dense empty-icon="mdi-star-outline"
                              color="light-blue lighten-2" background-color="grey lighten-2"
                              class="mr-2"/>

                    <v-icon color="primary" size="16">mdi-thumb-up-outline</v-icon>
                </v-layout>
            </v-col>

            <v-col cols="auto">
                <!-- Аватар -->
                <span class="text-small-3">{{ datePublishingFormat }}</span>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import AppAvatar            from '~/components/ui/AppAvatar';
    import { formatLocaleDate } from '~/lib/classes/utility';

    export default {
        name: 'ReviewCard',
        components: { AppAvatar },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            fullNameFormat: vm => {
                const { name, lastName, companyName } = vm.value.author;

                if ( companyName ) {
                    return companyName;
                }

                let result = name;

                if ( lastName !== null ) {
                    result += ' ' + lastName.slice( 0, 1 );
                }

                return result;
            },
            datePublishingFormat: vm => formatLocaleDate( vm.value.datePublishing, 'time', {
                hour: 'numeric', minute: 'numeric',
            } ),
        },
    };
</script>