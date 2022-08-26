<template>
    <div class="d-flex flex-fill">
        <v-col cols="5" class="d-flex pl-0 align-center">
            <template v-if="value.statusId === 1 || value.statusId === 2">
                <a :href="value.resumeUrl" class="text-decoration-none" download
                   target="_blank">
                    <v-btn color="primary"
                           width="94"
                           x-small
                           outlined>
                        Скачать
                    </v-btn>
                </a>
            </template>
            <template v-else-if="value.statusId === 0 && !value.isUnderRevision">
                <v-btn color="primary"
                       width="94"
                       x-small
                       @click="downloadResumeFile">
                    Скачать
                </v-btn>
                <v-btn color="primary"
                       width="94"
                       x-small
                       class="ml-2"
                       outlined
                       @click="finalizeResume">
                    Доработать
                </v-btn>
            </template>

            <template v-else-if="value.isUnderRevision">
                <div class="primary--text text-small-1">
                    На доработке
                </div>
            </template>

        </v-col>
        <v-col cols="7" class="d-flex pl-0 pr-0 justify-space-between align-center">
            <div class="text-small-1 d-flex align-start flex-column candidate-info w-100 mr-5">
                <div class="font-weight-bold">
                    {{ value.candidateName }}
                </div>
                <div v-if="value.statusId === 0" class="link" @click="connectWithCandidate">
                    Связаться
                </div>
            </div>
            <div class="text-small-2 d-flex w-100 align-center" :class="value.statusId === 2 ? 'justify-end' : 'justify-space-between'">
                <template v-if="value.statusId === 0">
                    <div class="pointer resume-action-button" @click="editClientResumeStatus( ACCESS_RESUME )">
                        Принять
                    </div>

                    <div class="pointer resume-action-button" @click="editClientResumeStatus( DENY_RESUME )">
                        Отказать
                    </div>
                </template>

                <template v-else-if="value.statusId === 1">
                    <div class="green--text font-weight-bold">
                        Принят
                    </div>

                    <div class="link link--underline text-right resume-action-button pointer d-block" @click="downloadAccountingFile">
                        Бухгалтерские документы
                    </div>
                </template>

                <template v-else-if="value.statusId === 2">
                    <div class="red--text font-weight-bold">
                        Отказано
                    </div>
                </template>
            </div>
        </v-col>
    </div>
</template>

<script>
    import {
        ACCESS_RESUME,
        DENY_RESUME,
    }   from '~/lib/constants/clientResume';

    export default {
        name: 'ResumeListItem',
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                ACCESS_RESUME,
                DENY_RESUME,
            };
        },
        methods: {
            editClientResumeStatus( actionStatus ) {
                this.$emit( 'edit-resume', [ actionStatus, this.value ] );
            },
            connectWithCandidate() {
                this.$emit( 'connect-with-candidate', this.value );
            },
            downloadResumeFile() {
                if ( this.value.isDownloaded ) {
                    window.open( this.value.resumeUrl );
                } else {
                    this.$emit( 'download-resume-file', this.value );
                }
            },
            downloadAccountingFile() {
                if ( this.value.accountingUrl ) {
                    window.open( this.value.accountingUrl );
                } else {
                    this.$emit( 'empty-accounting-url' );
                }
            },
            finalizeResume() {
                this.$emit( 'finalize-resume', this.value );
            },
        },
    };
</script>

<style scoped lang="scss">
    @include theme('resume-card-expansion') using($material) {
        & .resume-action-button:hover {
            color: map-deep-get($material, 'colors', 'primary');
        }
    }

    .candidate-info {
        max-width: 120px;
    }
</style>
