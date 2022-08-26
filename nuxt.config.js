const { NODE_ENV, HOST, PORT, NUXT_HOST, NUXT_PORT, BASE_URL, API_URL } = process.env;
const host = NUXT_HOST || HOST || 'localhost';
const port = NUXT_PORT || PORT || 3000;
const baseURL = BASE_URL || API_URL || `http://${ host }:${ port }`;
const isDev = NODE_ENV === 'development';

const build = {};

if ( !isDev ) {
    Object.assign( build, {
        // Doc: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build
        extractCSS: { ignoreOrder: true },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    main: {
                        name: 'main',
                        test: /^(?!.*[\\/]node_modules[\\/]|[\\/]assets[\\/]scss[\\/]utilities[\\/])/,
                        chunks: 'all',
                        enforce: true,
                    },
                    vendors: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]|[\\/]assets[\\/]scss[\\/]utilities[\\/]/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        splitChunks: {
            pages: false,
        },
    } );
}

export default {
    server: {
        host,
        port,
    },
    env: {
        baseURL,
        appKey: '',
    },
    /*
     * Axios
     */
    axios: {
        baseURL,
    },
    /*
     * Google Tag Manager
     */
    gtm: {
        id: '',
        noscript: false,
    },
    /*
     ** Headers of the page
     */
    head: {
        title: 'Rendement.ru - cервис поиска исполнителей на месторождениях',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Быстрый поиск исполнителей и товаров, безопасная сделка',
            },
            { property: 'og:site_name', content: 'Rendement' },
            { property: 'og:url', content: 'https:/rendement.ru' },
            { property: 'og:image', content: 'https:/rendement.ru/images/logo_opengraph.png' },
            { property: 'og:image:secure_url', content: 'https:/rendement.ru/images/logo_opengraph.png' },
            { property: 'og:image:type', content: 'image/png' },
            { property: 'og:locality', content: 'Тюмень' },
            { property: 'og:region', content: 'Тюменская область' },
            { property: 'og:country_name', content: 'Россия' },
            { property: 'og:email', content: 'info@rendement.ru' },
            { property: 'og:phone_number', content: '+7(495)154-71-07' },
            { property: 'og:locale', content: 'ru_RU' },
            { property: 'og:type', content: 'website' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://cdn.envybox.io/widget/cbk.css', body: true },
        ],
        noscript: [
            {
                innerHTML: '<img src="https://vk.com/rtrg?p=VK-RTRG-892630-9zcPP" style="position:fixed; left:-999px;" alt=""/>',
            },
        ],
        __dangerouslyDisableSanitizers: [ 'noscript' ],
        script: [
            { src: '/scripts/calltouch.js', body: true, async: true },
            { src: '/scripts/VCpixel.js', async: true },
            {
                id: 'popmechanic-script',
                src: 'https://static.popmechanic.ru/service/loader.js?c=27961',
                body: true,
                async: true,
            },
        ],
    },
    /*
     ** Встроенный лоадер не работает
     */
    loading: false,
    /*
     ** Global CSS
     */
    css: [
        '~/assets/scss/main.scss',
        '~/assets/scss/utilities/index.scss',
    ],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        // Doc: https://github.com/RobinHerbots/Inputmask
        { src: '~/plugins/inputmask.client.js', mode: 'client' },
        // Doc: https://github.com/viktorlarsson/vue-tiny-slider
        { src: '~/plugins/vue-tiny-slider.client.js', mode: 'client' },
        // Doc: https://vuetifyjs.com/en/customization/a-la-carte/
        '~/plugins/vuetify.js',
        // Desc: Provider for core functionality
        '~/plugins/core.js',
        // Doc: https://www.npmjs.com/package/vue-lazy-youtube-video
        { src: '~/plugins/vue-lazy-youtube-video.js', mode: 'client' },
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
        // Doc: https://github.com/nuxt-community/vuetify-module
        '@nuxtjs/vuetify',
        // Doc: https://github.com/nuxt-community/gtm-module
        '@nuxtjs/gtm',
        // Doc: https://github.com/juliomrqz/nuxt-optimized-images
        '@aceforth/nuxt-optimized-images',
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        // Doc: https://github.com/nuxt-community/svg-sprite-module
        '@nuxtjs/svg-sprite',
        // Doc: https://github.com/nuxt-community/style-resources-module
        '@nuxtjs/style-resources',
        // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
        'cookie-universal-nuxt',
        // Doc: https://github.com/PNKBizz/vue-yandex-map
        [ 'vue-yandex-maps/nuxt', { apiKey: '741bd8b1-83f0-48bf-b9dd-d965d68e6ea5' } ],
    ],
    // Doc: https://nuxtjs.org/docs/2.x/features/nuxt-components#prefetchlinks
    router: {
        prefetchLinks: false,
    },
    /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
    vuetify: {
        treeShake: true,
        customVariables: [
            '~/assets/scss/vuetify.scss',
        ],
        defaultAssets: false,
        optionsPath: './vuetify.options.js',
    },
    styleResources: {
        scss: [
            '~/assets/scss/functions/index.scss',
            '~/assets/scss/mixins/index.scss',
            '~/assets/scss/variables/index.scss',
        ],
    },
    svgSprite: {
        input: '~/assets/svg/',
        output: '~/assets/svg/sprite/',
    },
    optimizedImages: {
        optimizeImages: true,
    },
    /*
     ** Build configuration
     */
    build,
    serverMiddleware: [
        '~/middleware/seo.js',
    ],
};
