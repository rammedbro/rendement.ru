<template>
    <v-container>
        <v-row>
            <v-col class="list-mb-8">
                <h1 class="text-h3 mb-4 mb-lg-8">{{ h1 }}</h1>

                <!-- Адрес -->
                <section>
                    <div class="text-h5 mb-4">Адрес</div>

                    <p>Россия, 625000, Тюмень улица Герцена, 64, офис 1305</p>

                    <span v-if="isMobile"
                          class="link"
                          @click="$vuetify.goTo( $refs.map )">
                        Смотреть на карте
                    </span>
                </section>

                <!-- Тех. поддержка -->
                <section>
                    <div class="text-h5 mb-4">
                        Техническая поддержка
                    </div>

                    <p>
                        <a :href="`mailto:${ $legacy.constants.SITE_EMAIL }`"
                           class="link mb-2">
                            {{ $legacy.constants.SITE_EMAIL }}
                        </a>
                        <br>

                        <a :href="`tel:${ $legacy.constants.SITE_PHONE}`"
                           class="text-subtitle-1 link--unstyled">
                            {{ $legacy.constants.SITE_PHONE_FORMAT }}
                        </a>
                    </p>

                    <v-btn color="primary" rounded x-small
                           @click="showAppDialog('support')">
                        Написать директору
                    </v-btn>
                </section>

                <!-- Для партенров -->
                <section>
                    <div class="text-h5 mb-4">Для партнеров</div>

                    <p>По вопросам партнерства и сотрудничества</p>

                    <a :href="`mailto:${ $legacy.constants.SITE_SUPPORT_EMAIL }`"
                       class="link">
                        {{ $legacy.constants.SITE_SUPPORT_EMAIL }}
                    </a>
                </section>

                <!-- Реквизиты -->
                <section>
                    <div class="text-h5 mb-4">Реквизиты</div>

                    <p>
                        ИП Храмцова Алена<br>
                        ИНН 890106490001<br>
                        ОГРН 320723200012811
                    </p>
                </section>

                <app-doc-list-item v-bind="doc"/>
            </v-col>

            <v-col cols="12" lg="6">
                <yandex-map v-if="isMounted"
                            ref="map"
                            :coords="map.coords"
                            :zoom="map.zoom"
                            :behaviors="[]"
                            :controls="['zoomControl']"
                            class="contacts-map">
                    <ymap-marker marker-id="0"
                                 :coords="map.coords"
                                 :icon="map.marker"
                                 :balloon-template="map.balloon"/>
                </yandex-map>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapMutations }          from 'vuex';
    import { yandexMap, ymapMarker } from 'vue-yandex-maps';
    import { meta }                  from '~/mixins/meta';
    import AppDocListItem            from '~/components/ui/AppDocListItem';

    export default {
        components: {
            AppDocListItem,
            yandexMap,
            ymapMarker,
        },
        mixins: [ meta ],
        data: () => ( {
            title: 'Контакты',
            doc: {
                name: 'Карточка предприятия.pdf',
                src: '/upload/Карточка предприятия.pdf',
                size: 97301,
            },
            map: {
                coords: [ 57.152023, 65.531471 ],
                zoom: 16,
                marker: {
                    layout: 'default#image',
                    imageHref: '/images/logo-map-marker.png',
                    imageSize: [ 64, 84 ],
                    imageOffset: [ -30, -90 ],
                },
                balloon: 'Россия, 625000, Тюмень<br> улица Герцена, 64, офис 1305',
            },
        } ),
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
        },
    };
</script>

<style scoped lang="scss">
    .contacts-map {
        width: 100%;
        height: 100%;
        min-height: 568px;
    }
</style>