<template>
    <section>
        <v-btn v-show="!clicked" :id="telephoneButtonId"
               color="primary"
               block outlined
               @click="clicked = true"
               v-html="`Показать тел. ${ hiddenPhone }`"/>
        <v-btn v-show="clicked" color="primary"
               block :href="`tel:${ phone }`"
               outlined
               @click="clicked = true">
            {{ $legacy.formatPhone( phone ) }}
        </v-btn>
    </section>
</template>

<script>
    export default {
        name: 'AppHiddenPhone',
        props: {
            phone: {
                type: String,
                required: true,
            },
            telephoneButtonId: {
                type: String,
                required: true,
            },
        },
        data: () => ( {
            clicked: false,
        } ),
        computed: {
            hiddenPhone: vm => {
                const matches = vm.phone.match( /(\d{3})/ );

                return `8 ${ matches[1] } XXX-XX-XX`;
            },
        },
    };
</script>
