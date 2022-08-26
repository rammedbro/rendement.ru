<template>
    <app-form url="/api/fastRegistration/"
              :values="values"
              submit-text="Разместить резюме"
              privacy-check
              @success="onFastRegSuccess">
        <template v-slot:fields="{ rules, masks }">
            <v-text-field v-model="values.name"
                          :rules="[rules.required]"
                          outlined label="Ваше Имя"/>

            <v-text-field v-model="values.phone"
                          v-mask="masks.phone"
                          :rules="[rules.required, rules.phone]"
                          type="tel" outlined label="Номер телефона"/>
        </template>
    </app-form>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppForm from '~/components/forms/AppForm';

    export default {
        name: 'AppFastRegForm',
        components: { AppForm },
        data: () => ( {
            values: {
                name: null,
                phone: null,
            },
        } ),
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'user', [ 'getUser' ] ),
            async onFastRegSuccess() {
                try {
                    await this.getUser();

                    this.$router.push( '/create-work/?type=resumes' );

                    this.$emit( 'success' );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
        },
    };
</script>
