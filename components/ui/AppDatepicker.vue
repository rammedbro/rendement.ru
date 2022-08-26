<template>
    <v-date-picker v-model="compValue"
                   :min="toISO( min )"
                   :max="toISO( max )"
                   :range="range"
                   first-day-of-week="1"
                   :year-format="() => 'Выберите дату'"
                   :title-date-format="headerTitle"
                   :header-date-format="curMonthTitle"
                   :weekday-format="weekdayFormat"
                   @change="$emit( 'change', $event )">
        <v-btn color="primary" text block
               @click="$emit('close')">
            Готово
        </v-btn>
    </v-date-picker>
</template>

<script>
    export default {
        name: 'AppDatepicker',
        props: {
            value: {
                type: [ String, Array ],
                default: undefined,
            },
            range: {
                type: Boolean,
                default: false,
            },
            min: {
                type: String,
                default: '',
            },
            max: {
                type: String,
                default: '',
            },
        },
        computed: {
            compValue: {
                get: vm => {
                    if ( !vm.value ) return;

                    let value = vm.range ? vm.value : [ vm.value ];

                    value = value.map( item => vm.toISO( item ) );

                    return vm.range ? value : value[0];
                },
                set( value ) {
                    value = this.range ? value : [ value ];

                    value = value.map( item => item.split( '-' ).reverse().join( '.' ) );

                    this.$emit( 'input', this.range ? value : value[0] );
                },
            },
        },
        methods: {
            toISO( value ) {
                return value.split( '.' ).reverse().join( '-' );
            },
            headerTitle() {
                const value = this.range ? this.value : [ this.value ];
                return value.map( item => item.slice( 0, -4 ) + item.slice( -2 ) ).join( ' - ' );
            },
            curMonthTitle( value ) {
                const date = new Date( value ).toLocaleDateString( 'ru', { month: 'long', year: 'numeric' } );
                return date[0].toUpperCase() + date.slice( 1, -3 );
            },
            weekdayFormat( value ) {
                return new Date( value ).toLocaleDateString( 'ru', { weekday: 'short' } );
            },
        },
    };
</script>