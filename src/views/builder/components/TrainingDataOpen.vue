<template>
    <v-container class="fill-height flex-column">
        <!-- Title -->
        <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
                <v-card-title class="text-h2 text-secondary">
                    Training Data
                </v-card-title>
            </v-col>
        </v-row>

        <!-- URL input field -->
        <v-row align="center" justify="center" class="training-data-open-url-input"> 
            <v-col cols="12" class="text-center">
                <v-text-field
                    v-model="googleSpreadsheetUrl"
                    label="Enter Google Spreadsheet URL"
                    outlined
                    solo-inverted
                    :rules="[googleSpreadsheetUrlValidationRule]"
                ></v-text-field>
            </v-col>
        </v-row>

        <!-- Done button -->
        <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
                <v-tooltip location="top" :disabled="!isDoneButtonDisabled()">
                    <template v-slot:activator="{ props }">
                        <div v-bind="props" class="d-inline-block">
                            <v-btn @click.stop="handleDoneClick" color="primary" :disabled="isDoneButtonDisabled()">Done</v-btn>
                        </div>
                    </template>
                    {{ dataValidation }}
                </v-tooltip>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder'
import { computed, ref, watch } from 'vue';
import { isValidGoogleSpreadsheetUrl } from '@/store/builder/trainingData/helpers'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getTrainingDataValidation)

const googleSpreadsheetUrl = ref(builderStore.data.trainingData?.url)

watch(googleSpreadsheetUrl, (newValue) => {
    builderStore.data.trainingData = {
        ...builderStore.data.trainingData,
        url: newValue,
    }
})

const googleSpreadsheetUrlValidationRule = (url?: string): true | string => {
    return url === undefined || isValidGoogleSpreadsheetUrl(url) || 'Enter a valid Google Spreadsheets URL'
}

const isDoneButtonDisabled = () => {
    return typeof dataValidation.value === 'string'
}

const handleDoneClick = () => {
    // Handle the click, for example, store the URL or perform other actions
    builderStore.nextCurrentlyOpen();
};
</script>

<style>
.training-data-open-url-input {
    width: 100%;
}
</style>