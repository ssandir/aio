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
                    :rules="[googleSpreadsheetUrlValidationRule, googleSpreadsheetUrlFetchValidationRule]"/>
                <v-select
                    v-if="sheetNamesSelectionActive()"
                    v-model="selectedSheetName" 
                    :items="sheetNames as string[]" 
                    label="Select a sheet" />
                <div v-else>
                    Sheet name: {{ sheetName }}
                </div>
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
import { Ref } from 'vue';

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getTrainingDataValidation)

const googleSpreadsheetUrl = ref(builderStore.data.trainingData?.url)
const sheetNames: Ref<undefined | string[] | string> = ref(undefined)
const selectedSheetName: Ref<undefined | string> = ref(builderStore.data.trainingData?.sheetName)    
const sheetName = computed((): string | undefined => {
    if(Array.isArray(sheetNames.value) && sheetNames.value.length === 1) {
        return sheetNames.value[0]
    }

    if(selectedSheetName.value && sheetNames.value?.includes(selectedSheetName.value)) {
        return selectedSheetName.value
    }
    return undefined
})

watch(googleSpreadsheetUrl, (newValue) => {
    builderStore.addTrainingDataAttributeValue({url: newValue})

    if(isValidGoogleSpreadsheetUrl(newValue)) {
        getSheetNames(newValue)
    }
})

watch(sheetName, (newValue) => {
    builderStore.addTrainingDataAttributeValue({sheetName: newValue})
})

const googleSpreadsheetUrlValidationRule = (url?: string): true | string => {
    return url === undefined || isValidGoogleSpreadsheetUrl(url) || 'Enter a valid Google Spreadsheets URL'
}

const googleSpreadsheetUrlFetchValidationRule = (_?: string): true | string => {
    return sheetNames.value === undefined || Array.isArray(sheetNames.value) || sheetNames.value
}

const isDoneButtonDisabled = () => {
    return typeof dataValidation.value === 'string' || !Array.isArray(sheetNames.value)
}

const handleDoneClick = () => {
    // Handle the click, for example, store the URL or perform other actions
    builderStore.nextCurrentlyOpen();
};

const fetchSheetPage = async (url: string): Promise<Response> => {
    try {
       return await fetch(url)
    } catch (e) {
        if (e instanceof TypeError) {
            const message = `Network error: ${e.message}.`
            if (e.message === 'Failed to fetch') {
                throw `${message} Check the sharing permissions on spreadsheet, enable access to anyone with url. Check access to internet.`
            }
            throw message
        } else {
            throw `${e}`
        }
    }
}

const handleSheetResponse = async (response: Response): Promise<string[]> => {
    if (!response.ok) {
        throw `Error: ${response.status} ${response.statusText}`
    }

    const text = await response.text()

    const sheetNameExtractionRegex = /<div\s+class="(?:[^"]*\s+)?docs-sheet-tab-caption(?:\s+[^"]*)?">([^<]+)<\/div>/g;

    let matches: string[] | null = []
    const output = []
    while ((matches = sheetNameExtractionRegex.exec(text)) !== null) {
        output.push(matches[1]);
    }

    if (output.length > 0) {
        return output
    } else {
        throw 'No sheets found.'
    }
}

const getSheetNames = async (url: string) => {
    sheetNames.value = undefined // this triggers reset of sheet name
    try {
        const response = await fetchSheetPage(url)
        sheetNames.value = await handleSheetResponse(response)
    } catch (e) {
        sheetNames.value = `${e}`
    }
}

const sheetNamesSelectionActive = (): boolean => {
    return Array.isArray(sheetNames.value) && sheetNames.value.length > 1
}

</script>

<style>
.training-data-open-url-input {
    width: 100%;
}
</style>