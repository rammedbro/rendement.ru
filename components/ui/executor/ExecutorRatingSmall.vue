<template>
    <component :is="component"
               :to="link"
               class="executor-rating-small"
               :class="{ 'link--unstyled': isLink }">
        <v-row no-gutters>
            <!-- Аватар -->
            <v-col cols="auto"
                   class="mr-2">
                <v-badge :value="value.isOnline"
                         color="green"
                         dot bottom
                         offset-x="10"
                         offset-y="10">
                    <app-avatar :img="value.avatar"
                                size="40"/>
                </v-badge>
            </v-col>

            <v-col>
                <app-text-limiter adaptive>
                    <!-- Имя и фамилия -->
                    <div :title="fullNameFormat"
                         class="text-subtitle-2 text-ellipsis">
                        {{ fullNameFormat }}
                    </div>

                    <v-row no-gutters
                           align="center">
                        <!-- Рейтинг -->
                        <v-rating :value="value.rating"
                                  readonly half-increments
                                  dense size="16"
                                  half-icon="mdi-star-half-full"
                                  empty-icon="mdi-star-outline"
                                  color="light-blue lighten-2"
                                  background-color="grey lighten-2"
                                  class="mr-1"/>

                        <!-- Количество положительных отзывов -->
                        <div :title="value.likeCount"
                             class="mr-2">
                            <v-icon size="14">mdi-thumb-up-outline</v-icon>
                            <span class="text-small-3 grey--text text--lighten-1">{{ likeCountFormat }}</span>
                        </div>

                        <!-- Количество отрицательных отзывов -->
                        <div :title="value.dislikeCount">
                            <v-icon size="14">mdi-thumb-down-outline</v-icon>
                            <span class="text-small-3 grey--text text--lighten-1">{{ dislikeCountFormat }}</span>
                        </div>
                    </v-row>
                </app-text-limiter>
            </v-col>
        </v-row>
    </component>
</template>

<script>
    import { mapGetters }     from 'vuex';
    import AppAvatar          from '~/components/ui/AppAvatar';
    import AppTextLimiter     from '~/components/ui/AppTextLimiter';
    import { formatBigCount } from '~/lib/classes/utility';

    export default {
        name: 'ExecutorRatingSmall',
        components: { AppTextLimiter, AppAvatar },
        props: {
            value: {
                type: Object,
                required: true,
            },
            isLink: {
                type: Boolean,
                default: true,
            },
            maxWidth: {
                type: [ Number, String ],
                default: null,
            },
        },
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            fullNameFormat: vm => {
                const { name, lastName, companyName } = vm.value;

                if ( companyName ) {
                    return companyName;
                }

                let result = name;

                if ( lastName !== null ) {
                    result += ' ' + lastName.slice( 0, 1 );
                }

                return result;
            },
            isUserAuthor: vm => vm.value.id === vm.userId,
            likeCountFormat: vm => formatBigCount( vm.value.likeCount ),
            dislikeCountFormat: vm => formatBigCount( vm.value.dislikeCount ),
            component: vm => vm.isLink ? 'nuxt-link' : 'div',
            link: vm => vm.isLink ? `/executors/${ vm.value.id }/` : null,
        },
    };
</script>

<style lang="scss" scoped>
    .executor-rating-small {
        display: block;
    }
</style>
