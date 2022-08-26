import { checkObjectInterface } from '~/lib/classes/validation';
import { IntMetaData }          from '~/lib/types/other';

export const meta = {
    head: vm => ( {
        title: vm.meta.title,
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: vm.meta.description,
            },
            { property: 'og:title', content: vm.meta.title },
            { property: 'og:description', content: vm.meta.description },
            vm.meta.name ? { name: vm.meta.name, content: vm.meta.content } : '',
        ],
    } ),
    data: () => ( {
        meta: {
            h1: undefined,
            title: undefined,
            description: undefined,
            beforeContent: undefined,
            afterContent: undefined,
            name: undefined,
            content: undefined,
        },
        metaCache: {},
    } ),
    computed: {
        h1: vm => vm.meta.h1 || vm.title,
    },
    watch: {
        async $route( value ) {
            if ( !this.metaCache ) return;

            const cache = this.metaCache[value.fullPath];

            if ( cache ) {
                this.meta = cache;
            } else {
                try {
                    const result = await this.$store.dispatch(
                        'api/apiGet', { url: '/api/getSeo/', data: { path: value.fullPath } } );
                    this.meta = this.metaCache[value.fullPath] = checkObjectInterface( result, IntMetaData );
                } catch ( e ) {
                    console.log( e.message );
                }
            }
        },
    },
    async asyncData( { store, route, error } ) {
        try {
            let meta = await store.dispatch(
                'api/apiGet', { url: '/api/getSeo/', data: { path: route.fullPath } } );
            meta = checkObjectInterface( meta, IntMetaData );

            if ( await route.params.pathMatch ) {
                if ( await route.params.pathMatch.match( ',' ) && route.params.pathMatch.match( 'category-is' ) ) {
                    meta.name = 'robots';
                    meta.content = 'noindex, follow';
                }
            }

            return {
                meta,
                metaCache: { [route.fullPath]: meta },
            };
        } catch ( e ) {
            console.log( e.message );
            error( e );
        }
    },
};
