<template>
    <app-banner delay="20"
                cookie-name="bannerRegistration"
                root-class="light-blue lighten-5">
        <template v-slot:default="{ hide }">
            <v-img :src="require('~/assets/img/banners/banner-registration-old.png')"
                   width="230" height="230"
                   class="my-4 my-lg-8 mx-auto"/>

            <div class="text-h5 mb-8">
                Бесплатно размести Резюме и стань видимым для 150 зарегистрированных работодателей
            </div>

            <div class="text-h6 mb-8">
                Для нашедших работу через портал Rendement, все юридическое сопровождение при возникновении трудовых споров с работодателем бесплатно!
            </div>

            <v-btn id="btn-007"
                   color="primary" block
                   nuxt to="/create-work/?type=resumes"
                   @click="onClick( hide )">
                Создать резюме
            </v-btn>
        </template>
    </app-banner>
</template>

<script>
    import AppBanner from '~/components/banners/AppBanner';

    export default {
        name: 'BannerRegistration',
        components: { AppBanner },
        methods: {
            onClick( callback ) {
                callback();
            },
        },
    };
</script>
