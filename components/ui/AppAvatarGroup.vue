<template>
    <div class="avatar-group"
         :style="cssStyle">
        <div v-for="( item, index ) in limitedItems" :key="index"
             class="avatar-group-item"
             :style="{ zIndex: items.length - index, left: index * marginDelta + 'px' }">
            <slot name="item" v-bind="{ item }">
                <app-avatar :img="item"
                            :width="itemWidth"
                            :height="itemHeight"/>
            </slot>
        </div>
    </div>
</template>

<script>
    import AppAvatar from '@/components/ui/AppAvatar';

    export default {
        name: 'AppAvatarGroup',
        components: { AppAvatar },
        props: {
            items: {
                type: Array,
                required: true,
            },
            width: {
                type: Number,
                default: 60,
            },
            height: {
                type: Number,
                default: 42,
            },
            itemWidth: {
                type: Number,
                default: 42,
            },
            itemHeight: {
                type: Number,
                default: 42,
            },
            maxVisibleCount: {
                type: Number,
                default: 3,
            },
        },
        computed: {
            limitedItems: vm => vm.items.slice( 0, vm.maxVisibleCount ),
            marginDelta: vm => ( vm.width - vm.itemWidth ) / ( vm.limitedItems.length - 1 ),
            cssStyle: vm => ( {
                width: ( ( vm.limitedItems.length * vm.itemWidth ) > vm.width )
                    ? `${ vm.width }px`
                    : `${ vm.itemWidth }px`,
                height: `${ vm.height }px`,
            } ),
        },
    };
</script>

<style lang="scss" scoped>
    .avatar-group {
        position: relative;
        overflow: hidden;
    }

    .avatar-group-item {
        position: absolute;
        top: 0;
    }
</style>