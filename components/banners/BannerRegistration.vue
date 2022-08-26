<template>
    <app-banner delay="20"
                :fullscreen="isMobile"
                cookie-name="bannerRegistration">
        <template v-slot:default="{ hide }">
            <div class="img-container mb-4 mb-lg-8">
                <img :src="require('~/assets/img/banners/banner-registration.png')">
            </div>

            <app-fast-reg-form @success="hide"/>
        </template>
    </app-banner>
</template>

<script>
    import AppBanner      from '~/components/banners/AppBanner';
    import AppFastRegForm from '~/components/forms/AppFastRegForm';

    export default {
        name: 'BannerRegistration',
        components: { AppBanner, AppFastRegForm },
        methods: {
            onClick( callback ) {
                callback();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .img-container {
        margin: -57px -32px 0;

        @include media-breakpoint-down(lg) {
            margin: -57px -16px 0;
        }

        img {
            display: block;
            max-width: 100%;
        }
    }
</style>
