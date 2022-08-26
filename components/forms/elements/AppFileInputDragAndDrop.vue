<template>
    <app-file-input :value="value"
                    :rules="rules"
                    :accept="accept"
                    :max-size="maxSize"
                    :loaded="loaded"
                    multiple outlined
                    read-url :url-key="urlKey"
                    class="l-file-input--drag-and-drop"
                    @input="$emit('input', $event)"
                    @update:loaded="$emit('update:loaded', $event)"
                    @update:deleted="$emit('update:deleted', $event)">
        <template v-slot:default="{ onInput, remove, files }">
            <div class="l-file-input__slot">
                <!-- Зона добавления файлов -->
                <div class="l-file-input__drop-area"
                     :class="{ 'drag-over': isDragOver }"
                     @dragenter="onDragEnter"
                     @dragleave="onDragLeave"
                     @drop="onDrop($event, onInput)"></div>

                <!-- Добавленные файлы -->
                <v-row v-show="files.length"
                       dense>
                    <v-col v-for="(item, index) in files"
                           :key="index"
                           cols="6" md="3">
                        <v-card elevation="0"
                                class="border">
                            <v-icon color="primary"
                                    size="18"
                                    class="l-card-action-icon l-icon--fill"
                                    @click="remove(index)">
                                mdi-close-circle
                            </v-icon>

                            <v-img :src="item[urlKey]"
                                   height="124"/>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Подсказка -->
                <v-row v-show="!files.length"
                       justify="center">
                    <v-col cols="12" md="6">
                        <div class="text-small-2 text--primary">
                            Перетаскивайте сюда файлы с компьютера или загружайте их по кнопке ниже.
                            <span class="text-no-wrap">Форматы: jpg, png.</span>
                            <span class="text-no-wrap">Размер — до 1 МБ.</span>
                        </div>
                    </v-col>
                </v-row>

                <!-- Кнопка "Загрузить" -->
                <v-btn color="primary" rounded
                       outlined x-small width="180"
                       tag="label" role="button"
                       class="mt-4">
                    <input type="file"
                           multiple
                           class="d-none"
                           @input="onInput">
                    {{ btnText }}
                </v-btn>
            </div>
        </template>
    </app-file-input>
</template>

<script>
    import AppFileInput from '~/components/forms/elements/AppFileInput';

    export default {
        name: 'AppFileInputDragAndDrop',
        components: { AppFileInput },
        props: {
            value: {
                type: Array,
                required: true,
            },
            loaded: {
                type: Array,
                default: () => [],
            },
            urlKey: {
                type: String,
                default: 'src',
            },
            accept: {
                type: Array,
                default: () => [],
            },
            maxSize: {
                type: [ Number, String ],
                default: null,
            },
            btnText: {
                type: String,
                default: 'Загрузить',
            },
            rules: {
                type: Array,
                default: () => [],
            },
        },
        data: () => ( {
            isDragOver: false,
        } ),
        methods: {
            windowDropPreventDefault( event ) {
                event.preventDefault();
                event.stopPropagation();
            },
            onDragEnter() {
                this.isDragOver = true;
                window.addEventListener( 'dragover', this.windowDropPreventDefault );
                window.addEventListener( 'drop', this.windowDropPreventDefault );
            },
            onDragLeave() {
                this.isDragOver = false;
                window.removeEventListener( 'dragover', this.windowDropPreventDefault );
                window.removeEventListener( 'drop', this.windowDropPreventDefault );
            },
            onDrop( event, callback ) {
                event.preventDefault();
                this.onDragLeave();
                callback( event );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-file-input.l-file-input--drag-and-drop {
        .l-file-input__slot {
            position: relative;
            width: 100%;
            text-align: center;
            padding: 16px;
        }

        .l-file-input__drop-area {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: 2px dashed map_get($grey, 'lighten-4');
            border-radius: $border-radius-root;

            &.drag-over {
                z-index: 1000;
            }
        }
    }

    @include theme('l-file-input.l-file-input--drag-and-drop') using($material) {
        .l-file-input__drop-area {
            &.drag-over {
                border-color: map-deep-get($material, 'colors', 'primary');
            }
        }
    }
</style>