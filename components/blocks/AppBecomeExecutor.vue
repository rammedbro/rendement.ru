<template>
    <div class="become-executor">
        <!-- Шаблон "Синий" -->
        <template v-if="template === 'blue'">
            <v-card elevation="0">
                <v-container class="light-blue lighten-5 text-center">
                    <div class="text-h5 mb-4 primary--text">Станьте исполнителем на RDT</div>
                    <p class="text-subtitle-1">Мы поможем найти вам новых клиентов и зарабатывать на месторождении</p>
                    <p class="text-body-2 primary--text">
                        Вам достаточно нажать на кнопку «Стать исполнителем» и пройти всего 2 шага.
                    </p>

                    <v-btn color="primary" block
                           @click="showDialog">
                        Стать исполнителем
                    </v-btn>
                </v-container>
            </v-card>
        </template>

        <!-- Шаблон "Настраиваемый" -->
        <template v-else>
            <slot name="text">
                <p class="text-body-2 mb-4 mb-lg-8">
                    Вам достаточно нажать на кнопку "стать исполнителем" и заполнить форму.
                </p>
            </slot>

            <slot name="button" v-bind="{ showDialog }">
                <v-btn color="primary" block
                       @click="showDialog">
                    Стать исполнителем
                </v-btn>
            </slot>
        </template>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'AppBecomeExecutor',
        props: {
            template: {
                type: String,
                default: null,
            },
        },
        mounted() {
            if ( this.$route.query.becomeExecutor === 'true' ) {
                this.showDialog();
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            showDialog() {
                this.showAppDialog( 'becomeExecutor' );
            },
        },
    };
</script>