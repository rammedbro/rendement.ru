<template>
    <div class="executor-card-status-bar">
        <v-row dense
               align="center" justify="space-between"
               class="text-small-3 grey--text text--lighten-1">
            <v-col cols="auto">
                <div :title="value.viewCount"
                     class="d-flex align-center">
                    <v-icon size="16" class="material-icons-outlined mr-2">remove_red_eye</v-icon>
                    {{ viewCountFormat }}
                </div>
            </v-col>

            <v-col cols="auto">
                На сайте с {{ dateRegFormat }}
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import { formatBigCount, formatLocaleDate } from '~/lib/classes/utility';

    export default {
        name: 'ExecutorCardStatusBar',
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            viewCountFormat: vm => formatBigCount( vm.value.viewCount ),
            dateRegFormat: vm => formatLocaleDate( vm.value.dateRegistration, 'date', {
                month: 'short', day: 'numeric', year: 'numeric',
            } ).slice( 0, -3 ),
        },
    };
</script>