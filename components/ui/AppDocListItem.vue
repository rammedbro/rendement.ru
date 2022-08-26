<template>
    <a :href="src" download
       class="link link--unstyled doc-list-item">
        <v-icon color="primary">
            mdi-file-outline
        </v-icon>

        <div class="doc-list-item__text">
            <div :title="name"
                 class="text-subtitle-1 text-ellipsis">
                {{ name }}
            </div>
            <div class="text-small-3">{{ description }}</div>
        </div>

        <v-icon>mdi-download</v-icon>
    </a>
</template>

<script>
    import { formatSize } from '~/lib/classes/utility';

    export default {
        name: 'AppDocListItem',
        props: {
            name: {
                type: String,
                required: true,
            },
            src: {
                type: String,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
        },
        computed: {
            description: vm => {
                const ext = ( vm.name || '' ).slice( vm.name.lastIndexOf( '.' ) + 1 );
                const size = formatSize( vm.size || 0 );

                return [ ext, size ].join( ', ' ).toUpperCase();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .doc-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid map_get($grey, 'lighten-2');
        border-radius: 4px;

        &__text {
            width: calc(100% - 48px);
            padding: 0 16px;
        }
    }
</style>