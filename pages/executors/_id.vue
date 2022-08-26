<template>
    <v-container class="pa-0 py-lg-8">
        <v-row no-gutters>
            <v-col cols="12" lg="7">
                <executor-card-detail :value="executor"/>
            </v-col>

            <v-col>
                <v-container>
                    <app-useful-links theme="executor"/>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { meta } from '~/mixins/meta';

    import AppUsefulLinks           from '~/components/ui/AppUsefulLinks';
    import ExecutorCardDetail       from '~/components/ui/executor/ExecutorCardDetail';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntExecutorDetail }    from '~/lib/types/executor';
    import { IntMetaData }          from '~/lib/types/other';

    export default {
        components: { ExecutorCardDetail, AppUsefulLinks },
        mixins: [ meta ],
        data: () => ( {
            executor: undefined,
        } ),
        async asyncData( { route, params, store, error } ) {
            try {
                const executor = await store.dispatch(
                    'api/apiGet', { url: '/api/getExecutor/', data: { id: params.id } } );
                const meta = await store.dispatch(
                    'api/apiGet', { url: '/api/getSeo/', data: { path: route.path } } );

                return {
                    executor: checkObjectInterface( executor, IntExecutorDetail ),
                    meta: checkObjectInterface( meta, IntMetaData ),
                };
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
    };
</script>
