<template>
    <div class="executor-rating-big">
        <v-row>
            <v-col cols="auto">
                <!-- Аватар -->
                <app-avatar :img="value.avatar" size="60"
                            class="user-card-avatar"/>
            </v-col>

            <v-col>
                <!-- Полное имя -->
                <div class="text-h4 mb-1">{{ fullNameFormat }}</div>

                <!-- Статус в сети -->
                <div class="text-small-3 mb-2">
                    <span v-if="value.isOnline" class="green--text">Онлайн</span>
                    <span v-else class="grey--text text--lighten-1">
                        {{ dateLastVisitFormat }}
                    </span>
                </div>

                <!-- Тип пользователя -->
                <div class="text-small-1 mb-2">{{ personTypeFormat }}</div>

                <!-- Рейтинг -->
                <v-layout align-center="">
                    <span class="text-subtitle-1 mr-2">{{ ratingFormat }}</span>

                    <v-rating :value="value.rating"
                              readonly half-increments
                              half-icon="mdi-star-half-full"
                              empty-icon="mdi-star-outline"
                              color="light-blue lighten-2"
                              background-color="grey lighten-2"/>
                </v-layout>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import AppAvatar                from '~/components/ui/AppAvatar';
    import { formatDateLastOnline } from '~/lib/classes/utility';
    import {
        LEGAL_PERSON,
        PHYS_PERSON,
    }                               from '~/lib/constants/user';

    export default {
        name: 'ExecutorRatingBig',
        components: { AppAvatar },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            fullNameFormat: vm => {
                const { name, lastName, companyName } = vm.value;

                if ( companyName ) {
                    return companyName;
                }

                return `${ name } ${ lastName || '' }`;
            },
            dateLastVisitFormat: vm => `Был ${ formatDateLastOnline( vm.value.dateLastVisit ) }`,
            ratingFormat: vm => {
                const { rating } = vm.value;
                return rating > 0 ? rating.toFixed( 1 ).replace( '.', ',' ) : 0;
            },
            personTypeFormat: vm => {
                switch ( vm.value.personTypeId ) {
                    case PHYS_PERSON:
                        return 'Физическое лицо';
                    case LEGAL_PERSON:
                        return 'Юридическое лицо';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    @include media-breakpoint-up(lg) {
        .user-card-avatar {
            width: 112px !important;
            height: 112px !important;
        }
    }
</style>
