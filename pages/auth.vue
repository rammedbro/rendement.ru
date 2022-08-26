<template>
    <v-container>
        <div class="text-h3 mb-4 mb-lg-8">Вы не авторизованы</div>

        <p>
            Для доступа к личному кабинету необходимо
            <span class="link"
                  @click="showAppDialog('auth')">
                войти
            </span>
        </p>
    </v-container>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { meta }                      from '~/mixins/meta';

    export default {
        middleware( { store, redirect } ) {
            if ( store.getters['user/userIsLogin'] ) {
                redirect( '/personal/' );
            }
        },
        mixins: [ meta ],
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
        },
        watch: {
            userIsLogin( newValue ) {
                if ( newValue ) {
                    this.$router.push( '/personal/' );
                }
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
        },
    };
</script>