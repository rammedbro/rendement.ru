<template>
    <v-card class="task-card-detail">
        <!-- Сообщение о модерации -->
        <div v-if="value.moderation"
             class="text-small-3 pa-4 orange lighten-4">
            После того как ваше задание пройдет модерацию, оно станет открытым для исполнителей.
        </div>

        <v-container class="list-mb-6">
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  :display-actions="isUserAuthor"
                                  class="mb-4"/>

            <section>
                <!-- Категория -->
                <div class="text-small-1 mb-1">
                    {{ value.category.name }}
                </div>

                <!-- Заголовок -->
                <h1 class="text-h5 mb-4">{{ h1 }}</h1>

                <!-- Описание -->
                <p v-html="value.description"></p>
            </section>
            <v-divider/>

            <!-- Дата выполнения -->
            <section>
                <div class="text-h5 mb-4">Дата выполнения</div>

                <app-optional-field :value="dateExecutionFormat"
                                    component="p">
                    <template v-slot>
                        {{ dateExecutionFormat[0] }}

                        <template v-if="dateExecutionFormat.length === 2">
                            <br>{{ dateExecutionFormat[1] }}
                        </template>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Адрес месторождения -->
            <section>
                <div class="text-h5 mb-4">Месторождение или населенный пункт</div>

                <app-optional-field :value="value.location">
                    <template v-slot="{ value: location }">
                        <p>
                            {{ location.title }},<br>
                            {{ location.address }}
                        </p>

                        <v-btn color="primary"
                               outlined rounded small
                               @click="mapDialogDisplay = true">
                            Показать на карте
                        </v-btn>

                        <!-- Карта -->
                        <app-fullscreen-dialog v-model="mapDialogDisplay"
                                               title="Карта">
                            <app-map :value="location.id"
                                     :filter="[ location.id ]"
                                     class="flex-grow-1">
                                <template v-slot:balloon>
                                    <task-card-map :value="value"/>
                                </template>
                            </app-map>
                        </app-fullscreen-dialog>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Способ оплаты -->
            <section>
                <div class="text-h5 mb-4">Способ оплаты</div>

                <p>{{ paymentFormat }}</p>
            </section>
            <v-divider/>

            <!-- Бюджет -->
            <section>
                <div class="text-h5 mb-4">Желаемый бюджет</div>

                <p class="postfix--rubles">{{ value.price.toLocaleString() }}</p>
            </section>
            <v-divider/>

            <!-- Требования -->
            <section>
                <div class="text-h5 mb-4">Требования</div>

                <app-optional-field :value="value.requirements"
                                    component="p">
                    <template v-slot="{ value: requirements }">
                        {{ requirements.join(', ') }}
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Публичные файлы -->
            <section class="list-mb-4">
                <div class="text-h5 mb-4">Публичные файлы</div>

                <!-- Фотографии -->
                <div class="text-subtitle-1 grey--text lighten-1">Фотографии</div>

                <app-optional-field :value="value.images"
                                    message="Нет добавленных фотографий">
                    <template v-slot="{ value: images }">
                        <app-slider :items="images"
                                    :options="{ autoWidth: true }"
                                    @click="onSliderClick($event, images)">
                            <template v-slot:item="{ item }">
                                <v-card elevation="0"
                                        class="pointer">
                                    <v-img :src="item.preview"
                                           lazy-src="/images/no-img-placeholder.png"
                                           width="111" height="111"/>
                                </v-card>
                            </template>
                        </app-slider>
                    </template>
                </app-optional-field>

                <!-- Документы -->
                <div class="text-subtitle-1 grey--text lighten-1">Документы</div>

                <app-optional-field :value="value.docs"
                                    message="Нет добавленных документов"
                                    class="list-mb-4">
                    <template v-slot="{ value: docs }">
                        <app-doc-list-item v-for="(item, index) in docs" :key="index"
                                           v-bind="item"/>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Скрытые файлы -->
            <section class="list-mb-4">
                <div class="text-h5 mb-4">Скрытые файлы</div>

                <template v-if="isUserAuthor">
                    <!-- Фотографии -->
                    <div class="text-subtitle-1 grey--text lighten-1 mb-4">Фотографии</div>

                    <app-optional-field :value="value.hiddenImages"
                                        message="Нет добавленных фотографий">
                        <template v-slot="{ value: hiddenImages }">
                            <app-slider :items="hiddenImages"
                                        :options="{ autoWidth: true }"
                                        @click="onSliderClick($event, hiddenImages)">
                                <template v-slot:item="{ item }">
                                    <v-card elevation="0"
                                            class="pointer">
                                        <v-img :src="item.preview"
                                               lazy-src="/images/no-img-placeholder.png"
                                               width="111" height="111"/>
                                    </v-card>
                                </template>
                            </app-slider>
                        </template>
                    </app-optional-field>

                    <!-- Документы -->
                    <div class="text-subtitle-1 grey--text lighten-1 mb-4">Документы</div>

                    <app-optional-field :value="value.hiddenDocs"
                                        message="Нет добавленных документов"
                                        class="list-mb-4">
                        <template v-slot="{ value: hiddenDocs }">
                            <app-doc-list-item v-for="(item, index) in hiddenDocs" :key="index"
                                               v-bind="item"/>
                        </template>
                    </app-optional-field>
                </template>

                <div v-else>Видны только выбранному исполнителю</div>
            </section>

            <!-- Кнопка "Откликнуться" -->
            <template v-if="!isUserAuthor">
                <v-tooltip bottom
                           :disabled="!isUserResponseToTask">
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn color="primary" block
                                   :loading="apiLoading"
                                   :disabled="isUserResponseToTask"
                                   @click="onResponseToTaskBtnClick">
                                Откликнуться
                            </v-btn>
                        </div>
                    </template>

                    <span>Вы уже откликнулись на задание</span>
                </v-tooltip>

                <!-- Диалог "Откликнуться на задание" -->
                <app-dialog :value="responseDialog.display"
                            max-width="384"
                            @input="setResponseDialogDisplay">
                    <div class="text-h5 mb-4">Добавить предложение</div>

                    <p class="text-body-2">
                        Укажите опыт работы, преимущества,
                        а также цену, за которую готовы выполнить задание.
                    </p>

                    <app-form url="/api/responseToTask/"
                              :values="responseFormValues"
                              pass-api-key
                              @success="onResponseToTaskSuccess">
                        <template v-slot:fields="{ rules }">
                            <v-textarea v-model="responseDialog.values.comment"
                                        :rules="[rules.required]"
                                        outlined
                                        placeholder="Сопроводительный текст"/>
                        </template>
                    </app-form>
                </app-dialog>

                <!-- Диалог "Привязка карты" -->
                <app-dialog v-model="cardBindDialog.display"
                            max-width="384">
                    <div class="text-h5 mb-4">Карта не найдена</div>

                    <p class="text-body-2">
                        Для обеспечания безопасной сделки привяжите банковскую карту на сайте гарант
                        — сервиса
                    </p>

                    <v-btn color="primary" block
                           :href="cardBindDialog.bindingLink">
                        Привязать
                    </v-btn>
                </app-dialog>
            </template>
        </v-container>

        <!-- Диалог галлерии -->
        <app-fullscreen-dialog v-model="galleryDialog.display"
                               :title="galleryDialogTitle">
            <app-slider v-model="galleryDialog.slide"
                        :items="galleryDialog.items"
                        item-key="detail" item-class="gallery-item"
                        controls/>
        </app-fullscreen-dialog>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    import AppDocListItem        from '~/components/ui/AppDocListItem';
    import AppMap                from '~/components/ui/AppMap';
    import TaskCardStatusBar     from '~/components/ui/task/TaskCardStatusBar';
    import AppSlider             from '~/components/ui/AppSlider';
    import AppFullscreenDialog   from '~/components/dialogs/AppFullscreenDialog';
    import TaskCardMap           from '~/components/ui/task/TaskCardMap';
    import AppOptionalField      from '~/components/ui/AppOptionalField';
    import AppDialog             from '~/components/dialogs/AppDialog';
    import AppForm               from '~/components/forms/AppForm';
    import { formatLocaleDate }  from '~/lib/classes/utility';
    import { TASK_PAYMENT_LIST } from '~/lib/constants/task';
    import { checkType }         from '~/lib/classes/validation';

    export default {
        name: 'TaskCardDetail',
        components: {
            AppForm,
            AppDialog,
            AppOptionalField,
            TaskCardMap,
            AppFullscreenDialog,
            AppSlider,
            AppMap,
            AppDocListItem,
            TaskCardStatusBar,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            title: {
                type: String,
                default: undefined,
            },
            responseDialogDisplay: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            mapDialogDisplay: false,
            galleryDialog: {
                display: false,
                slide: 1,
                items: [],
            },
            responseDialog: {
                display: false,
                values: {
                    comment: null,
                },
            },
            cardBindDialog: {
                display: false,
                bindingLink: null,
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin', 'userIsExecutor', 'userIsCardBind' ] ),
            ...mapGetters( 'api', [ 'apiLoading' ] ),
            h1: vm => vm.title || vm.value.title,
            isUserAuthor: vm => vm.value.author.id === vm.userId,
            isUserResponseToTask: vm => vm.value.arResponseAuthorId.includes( vm.userId ),
            galleryDialogTitle: vm => `${ vm.galleryDialog.slide + 1 } из ${ vm.galleryDialog.items.length }`,
            dateExecutionFormat: vm => {
                const { dateStart, dateEnd } = vm.value;
                const result = [];

                if ( dateStart !== null ) {
                    const date = formatLocaleDate( dateStart, 'date', { month: 'long', day: 'numeric' } );
                    result.push( `Начать: ${ date }` );
                }

                if ( dateEnd !== null ) {
                    const date = formatLocaleDate( dateEnd, 'date', { month: 'long', day: 'numeric' } );
                    result.push( `Закончить: ${ date }` );
                }

                return result;
            },
            paymentFormat: vm => {
                const { safeDeal, paymentsByAgreement } = vm.value;

                if ( safeDeal ) {
                    return 'Безопасная оплата';
                }

                let result = 'По договоренности с исполнителем';
                let index = 0;

                TASK_PAYMENT_LIST.forEach( item => {
                    if ( paymentsByAgreement.includes( item.value ) ) {
                        result += index ? ', ' : ': ';
                        result += item.text;
                        index++;
                    }
                } );

                return result;
            },
            responseFormValues: vm => ( {
                taskId: vm.value.id,
                taskSubCategoryId: vm.value.subCategory.id,
                ...vm.responseDialog.values,
            } ),
        },
        watch: {
            responseDialogDisplay( value ) {
                if ( value === this.responseDialog.display ) return;

                if ( value ) {
                    this.onResponseToTaskBtnClick();
                } else {
                    this.responseDialog.display = false;
                }
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'user', [ 'getUserCardBind' ] ),
            onSliderClick( { index }, items ) {
                this.galleryDialog.display = true;
                this.galleryDialog.items = items;
                this.galleryDialog.slide = index;
            },
            setResponseDialogDisplay( state ) {
                this.responseDialog.display = state;
                this.$emit( 'update:response-dialog-display', state );
            },
            onResponseToTaskBtnClick() {
                if ( !this.userIsLogin ) {
                    this.showAppDialog( 'auth' );
                } else if ( !this.userIsExecutor ) {
                    this.showAppDialog( 'becomeExecutor' );
                } else if ( this.value.safeDeal && !this.userIsCardBind ) {
                    if ( this.cardBindDialog.bindingLink === null ) {
                        this.checkCardBind();
                    } else {
                        this.cardBindDialog.display = true;
                    }
                } else {
                    this.setResponseDialogDisplay( true );
                    return;
                }

                this.setResponseDialogDisplay( false );
            },
            onResponseToTaskSuccess() {
                this.value.arResponseAuthorId.push( this.userId );
                this.setResponseDialogDisplay( false );
            },
            async checkCardBind() {
                try {
                    const { isBind, bindingLink } = await this.getUserCardBind();

                    if ( isBind ) {
                        this.setResponseDialogDisplay( true );
                    } else {
                        this.cardBindDialog.display = true;
                        this.cardBindDialog.bindingLink = checkType( bindingLink, String );
                    }
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
        },
    };
</script>