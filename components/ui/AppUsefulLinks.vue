<template>
    <div class="useful-links">
        <div class="text-h4 mb-8">Полезные ссылки</div>

        <app-catalog url="/api/getUsefulLinks/"
                     :limit="25"
                     :filter="{ theme }"
                     :item-type="$legacy.types.IntUsefulLink"
                     :item-col-width="12"
                     dense
                     invoke-after-reach
                     scroll-pagination
                     disable-count>
            <template v-slot:item="{ item }">
                <nuxt-link :to="item.link" class="link">
                    {{ item.title }}
                </nuxt-link>
            </template>
        </app-catalog>
    </div>
</template>

<script>
    import AppCatalog from '~/components/ui/AppCatalog';

    export default {
        name: 'AppUsefulLinks',
        components: { AppCatalog },
        props: {
            theme: {
                type: String,
                required: true,
            },
        },
    };
</script>