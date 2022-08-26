module.exports = {
    apps: [
        {
            name: 'rdt',
            script: './node_modules/nuxt/bin/nuxt.js',
            args: 'start',
            env_devaid: {
                'NODE_ENV': 'production',
                'NUXT_HOST': 'rdt.devaid.ru',
                'NUXT_PORT': 3002,
                'BASE_URL': 'http://rdt.devaid.ru',
                'API_URL': 'http://rdt.devaid.ru',
            },
            env_production: {
                'NODE_ENV': 'production',
                'NUXT_HOST': 'localhost',
                'NUXT_PORT': 3000,
                'BASE_URL': 'https://rendement.ru',
                'API_URL': 'https://rendement.ru',
            },
        },
    ],
};