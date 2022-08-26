import ru from 'vuetify/src/locale/ru.ts';
import '@mdi/font/css/materialdesignicons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

export default {
    theme: {
        themes: {
            light: {
                primary: '#2686d8',
                secondary: '#0d86ff',
                accent: '#2686d8',
                error: '#fb4e4e',
                info: undefined,
                success: '#2ac769',
                warning: '#f6a609',
            },
        },
    },
    icons: {
        iconfont: 'mdi',
    },
    breakpoint: {
        thresholds: {
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1440,
        },
        scrollBarWidth: 0,
    },
    lang: {
        locales: { ru },
        current: 'ru',
    },
};