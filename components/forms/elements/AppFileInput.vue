<template>
    <v-input :value="files"
             :rules="[...rules, ...selfRules]"
             :hide-details="hideDetails"
             class="l-input l-file-input"
             :class="{ 'l-input--outlined': outlined, 'l-file-input--chips': chips }">
        <slot name="default" v-bind="{ onInput, add, remove, clear, files }">
            <div class="l-file-input__slot">
                <!-- Кнопка "Добавить файл" -->
                <slot name="input" v-bind="{ onInput, files }">
                    <v-btn color="primary" rounded x-small
                           tag="label" role="button">
                        <input type="file"
                               :multiple="multiple"
                               class="d-none"
                               @input="onInput">
                        {{ btnText }}
                    </v-btn>
                </slot>

                <!-- Добавленные файлы -->
                <slot name="files" v-bind="{ files, remove }">
                    <div v-if="chips && files.length"
                         class="l-file-input__files">
                        <v-row dense>
                            <v-col v-for="(item, index) in files" :key="index"
                                   cols="auto">
                                <v-chip close
                                        @click:close="remove(index)">
                                    <div :title="item.name"
                                         class="text-ellipsis">
                                        {{ item.name }}
                                    </div>
                                </v-chip>
                            </v-col>
                        </v-row>
                    </div>
                </slot>

                <!-- Кнопка "Удалить добавленные файлы" -->
                <slot v-if="!hideClearBtn"
                      name="clear" v-bind="{ clear }">
                    <v-btn v-if="files.length"
                           color="primary" outlined rounded
                           x-small
                           @click="clear">
                        Очистить
                    </v-btn>
                </slot>
            </div>
        </slot>
    </v-input>
</template>

<script>
    export default {
        name: 'AppFileInput',
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            readUrl: {
                type: Boolean,
                default: false,
            },
            urlKey: {
                type: String,
                default: 'src',
            },
            loaded: {
                type: Array,
                default: () => [],
            },
            accept: {
                type: Array,
                default: () => [],
            },
            maxSize: {
                type: [ Number, String ],
                default: null,
            },
            maxLength: {
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
            outlined: {
                type: Boolean,
                default: false,
            },
            hideDetails: {
                type: Boolean,
                default: false,
            },
            chips: {
                type: Boolean,
                default: false,
            },
            hideClearBtn: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            files: vm.loaded.concat(),
            arDeleteFileId: [],
            selfRules: [
                v => {
                    for ( const file of v ) {
                        const lastDotIndex = file.name.lastIndexOf( '.' );
                        const type = file.name.slice( lastDotIndex + 1 );

                        if ( vm.accept.length && !vm.accept.includes( type ) ) {
                            return `Допустимые расширения файлов: ${ vm.accept.join( ', ' ) }`;
                        }

                        if ( vm.maxSize !== null && file.size > ( +vm.maxSize * 1e6 ) ) {
                            return `Размер файла не должен превышать ${ vm.maxSize } Мб`;
                        }
                    }

                    if ( vm.maxLength !== null && v.length > +vm.maxLength ) {
                        return `Максимальное количество файлов - ${ vm.maxLength }`;
                    }

                    return true;
                },
            ],
        } ),
        computed: {
            input: vm => vm.$el.querySelector( 'input[type=file]' ) || null,
        },
        watch: {
            value( files ) {
                this.add( files.concat() );
            },
        },
        methods: {
            onInput( event ) {
                const { multiple } = this;
                const value = multiple ? this.value.concat() : [];
                const files = event.target.files || event.dataTransfer.files || [];

                value.push( ...files );
                this.$emit( 'input', value );
            },
            add( files ) {
                const { multiple, readUrl } = this;

                if ( multiple ) {
                    this.files = this.files.filter( item => {
                        if ( 'original' in item ) {
                            const loadedFileIndex = files.findIndex( file => file === item.original );

                            if ( loadedFileIndex !== -1 ) {
                                files.splice( loadedFileIndex, 1 );
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    } );
                } else {
                    this.files = [];
                }

                files.forEach( ( file, index ) => {
                    const { name, size } = file;
                    const loadedFile = { name, size, original: file };
                    const isLastFile = index === files.length - 1;

                    this.files.push( loadedFile );

                    if ( readUrl ) {
                        const reader = new FileReader();

                        reader.onloadend = () => {
                            this.$set( loadedFile, this.urlKey, reader.result );

                            if ( isLastFile ) {
                                this.$emit( 'update:loaded', this.files );
                            }
                        };

                        reader.readAsDataURL( file );
                    } else if ( isLastFile ) {
                        this.$emit( 'update:loaded', this.files );
                    }
                } );
            },
            remove( index ) {
                const loadedFile = this.files[index];

                if ( 'id' in loadedFile ) {
                    this.files.splice( index, 1 );
                    this.$emit( 'update:loaded', this.files );

                    this.arDeleteFileId.push( loadedFile.id );
                    this.$emit( 'update:deleted', this.arDeleteFileId );
                } else {
                    const start = index - ( this.files.length - this.value.length );
                    const updateValue = this.value.concat();

                    updateValue.splice( start, 1 );
                    this.$emit( 'input', updateValue );
                }

                // Очистка input в DOM
                if ( this.input ) {
                    this.input.value = '';
                }
            },
            clear() {
                this.files = [];
                this.$emit( 'update:loaded', this.files );
                this.$emit( 'input', [] );

                if ( this.loaded.length ) {
                    this.arDeleteFileId = this.loaded.map( file => file.id );
                    this.$emit( 'update:deleted', this.arDeleteFileId );
                }

                // Очистка input в DOM
                if ( this.input ) {
                    this.input.value = '';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-file-input {
        &__slot {
            width: 100%;
        }

        &.l-file-input--chips {
            .l-file-input__files {
                margin: 16px 0;
            }
        }
    }
</style>
