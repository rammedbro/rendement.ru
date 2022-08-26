<template>
    <div class="location-card-map">
        <div class="text-subtitle-1 mb-4">{{ value.title }}</div>

        <v-layout align-center=""
                  class="mb-4">
            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
            <span class="text-small-3">{{ value.address }}</span>
        </v-layout>

        <v-btn color="primary"
               rounded x-small block
               @click="$emit( 'click:accept', value )">
            Подтвердить
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: 'LocationCardMap',
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
    };
</script>

<style lang="scss" scoped>
    .location-card-map {
        padding: 16px;
    }
</style>