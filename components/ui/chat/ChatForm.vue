<template>
    <v-form ref="form"
            class="chat-form l-border bwt-1"
            @submit.prevent="onSubmit">
        <app-file-input v-model="files"
                        :accept="['jpeg', 'jpg', 'png', 'pdf']"
                        multiple max-size="2" max-length="5"
                        hide-details
                        hide-clear-btn
                        @input="$nextTick( validate )">
            <template v-slot:default="{ onInput, remove, files }">
                <v-container class="container--dense">
                    <v-row v-if="isEditMessageForm"
                           dense
                           align="center" justify="space-between">
                        <v-col cols="auto">Редактирование сообщения</v-col>

                        <v-col cols="auto">
                            <v-icon @click="cancelEditMessage">mdi-close</v-icon>
                        </v-col>
                    </v-row>

                    <v-row dense
                           align="center" justify="center">
                        <!-- Добавленные файлы -->
                        <v-col v-if="files.length"
                               cols="12">
                            <app-slider :items="files"
                                        :options="{ autoWidth: true }">
                                <template v-slot:item="{ item, index }">
                                    <v-chip close
                                            @click:close="remove(index)">
                                        <div :title="item.name"
                                             class="text-ellipsis">
                                            {{ item.name }}
                                        </div>
                                    </v-chip>
                                </template>
                            </app-slider>
                        </v-col>

                        <!-- Кнопка "Добавить файл" -->
                        <v-col cols="auto">
                            <v-btn icon
                                   width="24" height="24"
                                   tag="label"
                                   elevation="0"
                                   :ripple="false"
                                   :disabled="isEditMessageForm"
                                   class="l-btn--no-hover">
                                <v-icon class="pointer">attach_file</v-icon>

                                <input type="file"
                                       multiple
                                       class="d-none"
                                       @input="onInput">
                            </v-btn>
                        </v-col>

                        <!-- Текст сообщения -->
                        <v-col ref="chatMessageCol"
                               class="position-relative">
                            <v-textarea ref="input"
                                        v-model="values.text"
                                        :rules="selfRules"
                                        validate-on-blur
                                        outlined auto-grow rows="1"
                                        placeholder="Введите сообщение"
                                        hide-details
                                        @keydown.enter.exact.prevent="onSubmit"
                                        @change="validate"/>

                            <!-- Уведомление о некорректном сообщении -->
                            <v-tooltip :value="isChatTextNotValid"
                                       :attach="$refs.chatMessageCol"
                                       absolute
                                       max-width="100%"
                                       color="red lighten-5"
                                       content-class="chat-form__notification-message">
                                <div class="text-small-3 text--primary text-left">
                                    Наш алгоритм выявил подозрительные слова в вашем сообщении.
                                    В переписке нельзя оставлять телефоны и адреса эл. почты, ссылки на сайты и
                                    профили в социальных сетях, название и реквизиты компании.
                                    <nuxt-link to="/faq/">См. раздел FAQ.</nuxt-link>
                                </div>
                            </v-tooltip>
                        </v-col>

                        <!-- Кнопка "Отправить" -->
                        <v-col cols="auto">
                            <v-btn color="primary"
                                   icon
                                   width="24" height="24"
                                   elevation="0"
                                   :ripple="false"
                                   :loading="loading"
                                   :disabled="!files.length && !values.text"
                                   type="submit"
                                   class="l-btn--no-hover">
                                <v-icon>mdi-send</v-icon>
                            </v-btn>
                        </v-col>

                        <!-- Сообщение об ошибке -->
                        <v-col v-show="errorMessage"
                               cols="12">
                            <div class="chat-form__error-message v-messages error--text">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ errorMessage }}
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </template>
        </app-file-input>
    </v-form>
</template>

<script>
    import AppFileInput      from '~/components/forms/elements/AppFileInput';
    import AppSlider         from '~/components/ui/AppSlider';
    import { stripHtmlTags } from '~/lib/classes/utility';

    export default {
        name: 'ChatForm',
        components: { AppSlider, AppFileInput },
        props: {
            value: {
                type: Object,
                default: null,
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            values: {
                text: '',
            },
            files: [],
            errorMessage: null,
            isChatTextNotValid: false,
            isEditMessageForm: false,
            selfRules: [
                v => {
                    vm.isChatTextNotValid = false;

                    if ( !v ) return true;

                    const nonSpaceString = v.replace( /\s+/g, '' ).trim();
                    const emailSearchRegexp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
                    const phoneSearchRegexp = /(?:\+|\d)[\d\-() ]{9,}\d/g;

                    if ( nonSpaceString.match( emailSearchRegexp ) || nonSpaceString.match( phoneSearchRegexp ) ) {
                        vm.isChatTextNotValid = true;
                        return 'Недопустимый набор символов';
                    }

                    return true;
                },
            ],
        } ),
        watch: {
            value( value ) {
                if ( !value ) return;

                this.clear();

                this.values.text = value.text;
                this.isEditMessageForm = true;

                this.$refs.input.focus();
            },
        },
        methods: {
            onSubmit() {
                try {
                    if ( !this.validate() ) return;

                    const { text } = this.values;
                    const messages = this.files.concat();

                    if ( text ) {
                        messages.push( this.handleMessage( text ) );
                    }

                    this.$emit( 'submit', messages );
                    this.isEditMessageForm = false;
                    this.clear();
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
            validate() {
                this.errorMessage = null;

                const result = this.$refs.form.validate();

                for ( const input of this.$refs.form.inputs ) {
                    if ( !input.valid ) {
                        this.errorMessage = input.errorBucket[0];
                        break;
                    }
                }

                return result;
            },
            clear() {
                this.errorMessage = null;
                this.values.text = '';
                this.files = [];
            },
            cancelEditMessage() {
                this.clear();
                this.isEditMessageForm = false;

                this.$emit( 'edit:cancel' );
            },
            handleMessage( text ) {
                text = stripHtmlTags( text );

                const message = {
                    type: 'message',
                };

                if ( this.isEditMessageForm ) {
                    const { id } = this.value;

                    message.action = 'edit';
                    message.data = { id, text };
                } else {
                    message.action = 'add';
                    message.data = text;
                }

                return message;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat-form {
        position: relative;

        &__error-message {
            width: calc(100% - 84px);
            margin: 0 auto;
        }

        &__notification-message {
            top: 0 !important;
            right: 8px !important;
            left: 8px !important;
            transform: translateY(-100%);
            opacity: 1 !important;
        }
    }
</style>