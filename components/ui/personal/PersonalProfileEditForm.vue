<template>
    <app-form url="/api/editProfile/"
              :values="values"
              :files="files"
              pass-api-key
              submit-text="Сохранить изменения"
              :after-submit-callback="updateUser"
              @success="$emit('success')">
        <template v-slot:fields="{ rules, masks }">
            <!-- Аватар -->
            <v-container class="l-border bwa-1 pa-4 mb-8">
                <v-row justify="center" justify-lg="start"
                       class="text-center text-lg-left">
                    <!-- Аватар: Превью -->
                    <v-col cols="12" lg="auto">
                        <app-avatar :img="avatarPreview"
                                    size="112"/>
                    </v-col>

                    <v-col cols="auto">
                        <!-- Аватар: Сообщение -->
                        <div class="mb-4">
                            <template v-if="isLegalPerson">Загрузите логотип компании</template>
                            <template v-else>Загрузите своё настоящее фото</template>
                        </div>

                        <!-- Аватар: Загрузка -->
                        <app-file-input v-model="files.avatar"
                                        :accept="['jpg', 'jpeg', 'png']"
                                        max-size="2" read-url
                                        btn-text="Загрузить фото"
                                        class="upload-avatar-btn text-center text-lg-left"
                                        @update:loaded="avatarPreview = ( $event[0] || {} ).src"/>
                    </v-col>
                </v-row>
            </v-container>

            <!-- Пол -->
            <v-radio-group v-model="values.sexId"
                           row>
                <template v-slot:prepend>
                    <div class="mt-1 mr-4">Пол:</div>
                </template>

                <v-radio :value="0" label="Мужской"/>
                <v-radio :value="1" label="Женский"/>
            </v-radio-group>

            <!-- Поля для юр. лиц -->
            <template v-if="isLegalPerson">
                <!-- Название организации -->
                <v-text-field v-model="values.companyName"
                              :rules="[rules.required]"
                              outlined label="Название организации"/>
            </template>

            <!-- Имя -->
            <v-text-field v-model="values.name"
                          :rules="[rules.required]"
                          outlined label="Имя"/>

            <!-- Фамилия -->
            <v-text-field v-model="values.lastName"
                          outlined label="Фамилия"/>

            <!-- Отчество -->
            <v-text-field v-if="isLegalPerson"
                          v-model="values.secondName"
                          outlined label="Отчество"/>

            <!-- Дата рождения -->
            <v-text-field v-model="values.birthDay"
                          v-mask="masks.date"
                          outlined label="Дата рождения"
                          append-icon="mdi-calendar-blank"
                          @click:append="datePickerDialog = true"/>

            <!-- Календарь -->
            <v-dialog v-model="datePickerDialog"
                      width="320">
                <app-datepicker v-model="values.birthDay"
                                @close="datePickerDialog = false"/>
            </v-dialog>

            <!-- О себе -->
            <v-textarea v-model="values.about"
                        :rules="[rules.required]"
                        outlined label="О себе"
                        placeholder="Заказчики ничего о вас не знают. Добавьте информацию о ваших услугах или потребностях."/>

            <!-- Поля для исполнителей -->
            <template v-if="isExecutor">
                <!-- Категория -->
                <category-select v-model="values.arCategoryCode"
                                 url="/api/categories/"
                                 :rules="[rules.required]"
                                 :sub-categories.sync="subCategories"
                                 multiple/>

                <!-- Подкатегория -->
                <app-select v-model="values.arSubcategoryId"
                            :items="subCategories"
                            :rules="[rules.required]"
                            item-text="name" item-value="id"
                            multiple label="Подкатегория"
                            no-data-text="Выберите категорию"/>

                <!-- Месторождение -->
                <location-search v-model="values.locationId"
                                 :rules="[rules.required]"
                                 :radius.sync="values.locationRadius"
                                 with-map with-radius/>

                <!-- Радиус -->
                <app-text-field-slider v-show="values.locationId !== null"
                                       v-model="values.locationRadius"
                                       :max="500"
                                       label="Радиус от местонахождения"
                                       postfix="км."/>
            </template>
        </template>
    </app-form>
</template>

<script>
    import { mapMutations } from 'vuex';

    import AppForm            from '~/components/forms/AppForm';
    import AppAvatar          from '~/components/ui/AppAvatar';
    import AppDatepicker      from '~/components/ui/AppDatepicker';
    import AppFileInput       from '~/components/forms/elements/AppFileInput';
    import AppSelect          from '~/components/forms/elements/AppSelect';
    import CategorySelect     from '~/components/ui/category/CategorySelect';
    import LocationSearch     from '~/components/ui/location/LocationSearch';
    import AppTextFieldSlider from '~/components/forms/elements/AppTextFieldSlider';
    import {
        PHYS_PERSON,
        LEGAL_PERSON,
    }                         from '~/lib/constants/user';

    export default {
        name: 'PersonalProfileEditForm',
        components: {
            AppTextFieldSlider,
            CategorySelect,
            LocationSearch,
            AppSelect,
            AppFileInput,
            AppDatepicker,
            AppAvatar,
            AppForm,
        },
        props: {
            isExecutor: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                default: null,
            },
            personTypeId: {
                type: Number,
                default: PHYS_PERSON,
            },
            avatar: {
                type: String,
                default: null,
            },
            sexId: {
                type: Number,
                default: null,
            },
            lastName: {
                type: String,
                default: null,
            },
            birthDay: {
                type: String,
                default: null,
            },
            about: {
                type: String,
                default: null,
            },
            secondName: {
                type: String,
                default: null,
            },
            companyName: {
                type: String,
                default: null,
            },
            arCategoryCode: {
                type: Array,
                default: () => [],
            },
            arSubcategoryId: {
                type: Array,
                default: () => [],
            },
            locationId: {
                type: Number,
                default: null,
            },
            locationRadius: {
                type: Number,
                default: null,
            },
        },
        data: vm => ( {
            values: {
                sexId: vm.sexId,
                name: vm.name,
                lastName: vm.lastName,
                secondName: vm.secondName,
                about: vm.about,
                companyName: vm.companyName,
                birthDay: vm.birthDay,
                locationId: vm.locationId,
                locationRadius: vm.locationRadius,
                arCategoryCode: vm.arCategoryCode,
                arSubcategoryId: vm.arSubcategoryId,
            },
            files: {
                avatar: [],
            },
            avatarPreview: vm.avatar,
            datePickerDialog: false,
            subCategories: [],
        } ),
        computed: {
            isLegalPerson: vm => vm.personTypeId === LEGAL_PERSON,
        },
        methods: {
            ...mapMutations( 'user', [ 'updateUser' ] ),
        },
    };
</script>

<style lang="scss" scoped>
    .upload-avatar-btn {
        @include media-breakpoint-down(md) {
            .v-input__slot {
                justify-content: center;
            }

            .v-messages {
                text-align: center;
            }
        }
    }
</style>