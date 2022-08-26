<template>
    <app-form url="/api/auth/"
              :values="values"
              width="288"
              submit-id="btn-201"
              submit-text="Войти"
              @success="onAuthSuccess">
        <template v-slot:header>
            <div class="text-h5 mb-8">Вход</div>

            <div class="text-small-1 mb-8">
                Новый пользователь?
                <span class="link" @click="$emit('click:reg')">Зарегистрироваться</span>
            </div>
        </template>

        <template v-slot:fields="{ rules, masks }">
            <v-text-field v-if="curLoginBy === 'email'"
                          :key="curLoginBy"
                          v-model="email"
                          :rules="[rules.required, rules.email]"
                          outlined label="E-mail"/>

            <v-text-field v-if="curLoginBy === 'phone'"
                          :key="curLoginBy"
                          v-model="phone"
                          v-mask="masks.phone"
                          :rules="[rules.required, rules.phone]"
                          type="tel" outlined label="Номер телефона"/>

            <v-text-field v-model="password"
                          :rules="[rules.required]"
                          outlined label="Пароль"
                          :type="isShowPass ? 'text' : 'password'"
                          :append-icon="isShowPass ? 'visibility_off' : 'visibility'"
                          @click:append="isShowPass = !isShowPass"/>
        </template>

        <template v-slot:footer>
            <section class="list-mb-4">
                <v-divider/>

                <v-btn color="primary" text block
                       @click="$emit('click:forgot')">
                    Забыли пароль?
                </v-btn>

                <v-divider/>

                <v-btn color="primary" text block
                       @click="switchLoginBy">
                    Войти с помощью {{ switchBtn[curLoginBy] }}
                </v-btn>
            </section>
        </template>
    </app-form>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppForm from '~/components/forms/AppForm';

    export default {
        name: 'AppAuthForm',
        components: { AppForm },
        data: () => ( {
            curLoginBy: 'phone',
            switchBtn: {
                email: 'телефона',
                phone: 'почты',
            },
            email: null,
            phone: null,
            password: null,
            isShowPass: false,
        } ),
        computed: {
            values: vm => ( {
                email: vm.curLoginBy === 'email' ? vm.email : null,
                phone: vm.curLoginBy === 'phone' ? vm.phone : null,
                password: vm.password,
            } ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'user', [ 'getUser' ] ),
            switchLoginBy() {
                switch ( this.curLoginBy ) {
                    case 'email':
                        this.curLoginBy = 'phone';
                        break;
                    case 'phone':
                        this.curLoginBy = 'email';
                        break;
                }
            },
            async onAuthSuccess() {
                try {
                    await this.getUser();
                    this.$emit( 'success' );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
        },
    };
</script>