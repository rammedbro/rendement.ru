<template>
    <app-form v-bind="formParams"
              pass-api-key
              :before-submit-callback="checkForLineBreak"
              @success="onSuccess">
        <template v-slot:fields="{ rules, masks }">
            <!-- Поля при "Редактировании" -->
            <template v-if="isEditForm">
                <div class="text-h6 mb-6">Вы выбрали:</div>

                <category-select v-model="values.categoryCode"
                                 :rules="[rules.required]"
                                 url="/api/vacancyCategories/"/>
            </template>

            <div class="mb-8 list-mb-8">
                <div class="text-h4 mb-8">Заполните форму</div>

                <section class="l-border bwb-1">
                    <!-- Название должности -->
                    <v-text-field v-model="values.title"
                                  :rules="[rules.required]"
                                  label="Полное название профессии" outlined
                                  placeholder="Например: Водитель погрузчика"/>

                    <!-- Недропользователь -->
                    <v-text-field v-model="values.landOwner"
                                  label="Недропользователь" outlined
                                  placeholder="Например: Лукойл"/>

                    <!-- Описание -->
                    <v-textarea v-model="values.description"
                                :rules="[rules.required]"
                                label="Описание вакансии" outlined/>

                    <!-- Местоположение -->
                    <location-search v-model="values.locationId"
                                     :rules="[rules.required]"
                                     :radius.sync="values.locationRadius"
                                     with-map with-radius
                                     :radius-props="{ max: 1000 }"/>

                    <app-text-field-slider v-show="values.locationId !== null"
                                           v-model="values.locationRadius"
                                           :max="1000"
                                           label="Радиус от местонахождения"
                                           postfix="км."/>

                    <!-- Зарплата -->
                    <v-text-field v-model="values.salary"
                                  v-mask="masks.currency"
                                  outlined label="Зарплата"/>
                </section>

                <!-- Требования -->
                <section class="l-border bwb-1">
                    <div class="text-h6 mb-6">Требования</div>

                    <app-text-field-chips v-model="values.requirements"
                                          placeholder="Требуемые навыки"/>

                    <!-- Опыт работы -->
                    <app-select v-model="values.experienceId"
                                :items="$legacy.constants.WORK_EXPERIENCE_LIST"
                                clearable
                                label="Стаж"/>
                </section>
            </div>
        </template>

        <!-- Кнопка "Отправить" -->
        <template v-slot:submit="{ loading, submit }">
            <v-btn color="primary" block
                   :loading="loading" type="submit"
                   @click.prevent="submitWrapper( submit )">
                Опубликовать
            </v-btn>
        </template>
    </app-form>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import LocationSearch       from '~/components/ui/location/LocationSearch';
    import AppTextFieldChips    from '~/components/forms/elements/AppTextFieldChips';
    import AppForm              from '~/components/forms/AppForm';
    import AppSelect            from '~/components/forms/elements/AppSelect';
    import AppTextFieldSlider   from '~/components/forms/elements/AppTextFieldSlider';
    import CategorySelect       from '~/components/ui/category/CategorySelect';
    import { IntVacancyDetail } from '~/lib/types/vacancy';
    import {
        checkType,
        checkObjectInterface,
    }                           from '~/lib/classes/validation';

    export default {
        name: 'VacancyCrudForm',
        components: {
            AppTextFieldSlider,
            CategorySelect,
            LocationSearch,
            AppSelect,
            AppForm,
            AppTextFieldChips,
        },
        props: {
            id: {
                type: Number,
                default: null,
            },
            categoryCode: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            landOwner: {
                type: String,
                default: null,
            },
            description: {
                type: String,
                default: null,
            },
            experienceId: {
                type: Number,
                default: null,
            },
            locationId: {
                type: Number,
                default: null,
            },
            salary: {
                type: Number,
                default: null,
            },
            locationRadius: {
                type: Number,
                default: undefined,
            },
            requirements: {
                type: Array,
                default: () => [],
            },
        },
        data: vm => ( {
            values: {
                categoryCode: vm.categoryCode,
                title: vm.title,
                landOwner: vm.landOwner,
                description: vm.description,
                experienceId: vm.experienceId,
                locationId: vm.locationId,
                locationRadius: vm.locationRadius,
                salary: vm.salary,
                requirements: vm.requirements.concat(),
            },
            editValues: {
                id: vm.id,
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
            isEditForm: vm => vm.id !== null,
            formParams: vm => {
                return vm.isEditForm ? {
                    url: '/api/editVacancy/',
                    values: { ...vm.values, ...vm.editValues },
                } : {
                    url: '/api/createVacancy/',
                    values: vm.values,
                };
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onSuccess( result ) {
                try {
                    if ( this.isEditForm ) {
                        result = checkObjectInterface( result, IntVacancyDetail );
                    } else {
                        result = checkType( result.id, Number );
                    }

                    this.$emit( 'success', result );
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
            submitWrapper( callback ) {
                this.userIsLogin ? callback() : this.showAppDialog( 'auth' );
            },
            checkForLineBreak() {
                this.values.description = this.values.description.replace( /\n/g, '<br>' );
            },
        },
    };
</script>
