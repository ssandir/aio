<template>
  <!-- URL input field -->
  <v-row
    align="center"
    justify="center"
    class="training-data-open-url-input"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <v-text-field
        v-model="googleSpreadsheetUrl"
        label="Enter Google Spreadsheet URL"
        outlined
        solo-inverted
        :rules="[googleSpreadsheetUrlValidationRule, googleSpreadsheetUrlFetchValidationRule]"
      />
      <div v-if="sheetTitle !== undefined">
        {{ sheetTitle }}
      </div>
      <v-select
        v-if="sheetNamesSelectionActive()"
        v-model="selectedSheetName"
        :items="sheetNames as string[]"
        label="Select a sheet"
      />
    </v-col>
  </v-row>

  <!-- Data preview -->
  <v-row
    align="center"
    justify="center"
    class="training-data-open-url-input"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <v-card-text
        v-if="googleSpreadsheetCsv"
        class="text-body-1 text-secondary"
      >
        {{ googleSpreadsheetCsv }}
      </v-card-text>
      <v-card-text
        v-else-if="googleSpreadsheetCsvText"
        class="text-body-1 text-secondary"
      >
        {{ googleSpreadsheetCsvText }}
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder'
import { computed, ref, watch, Ref } from 'vue'
import { getGoogleSpreadsheetIdFromUrl, isValidGoogleSpreadsheetUrl } from '@/store/builder/trainingData/helpers'
import { PartialGoogleSpeadsheetData } from '@shared/types'

const props = defineProps<{
    dataAttribute: 'trainingData' | 'modelValidationData'
}>()

const builderStore = useBuilderStore()

const builderStoreData = computed(() => builderStore.data[props.dataAttribute] as PartialGoogleSpeadsheetData)
const googleSpreadsheetUrl: Ref<undefined | string> = ref(builderStoreData.value.url)
const sheetNames: Ref<undefined | string[] | string> = ref(undefined)
const selectedSheetName: Ref<undefined | string> = ref(builderStoreData.value.sheetName)
const sheetName = computed((): string | undefined => {
  if (Array.isArray(sheetNames.value) && sheetNames.value.length === 1) {
    return sheetNames.value[0]
  }

  if (selectedSheetName.value && sheetNames.value?.includes(selectedSheetName.value)) {
    return selectedSheetName.value
  }
  return undefined
})
const sheetTitle: Ref<undefined | string> = ref(undefined)
const googleSpreadsheetCsvText: Ref<{ csvText: string } | string | undefined> = ref(undefined)
const googleSpreadsheetCsv = computed((): string[][] | undefined => {
  if (googleSpreadsheetCsvText.value === undefined || typeof googleSpreadsheetCsvText.value === 'string') {
    return undefined
  }

  // havent found good synchronious csv parser that works with typescript
  // also every value is wrapped in "
  return googleSpreadsheetCsvText.value.csvText.split('\n').map((row) => row.split(',').map((value) => value.slice(1, -1)))
})

watch(googleSpreadsheetUrl, (newValue) => {
  builderStore.addDataAttributeValue(props.dataAttribute, { url: newValue })

  if (isValidGoogleSpreadsheetUrl(newValue)) {
    getSheetMetadata(newValue)
  }
})

watch(sheetName, (newValue) => {
  builderStore.addDataAttributeValue(props.dataAttribute, { sheetName: newValue })

  if (newValue !== undefined) {
    getGoogleSpreadsheetCsv()
  }
})

watch(googleSpreadsheetCsv, (newValue) => {
  builderStore.addDataAttributeValue(props.dataAttribute, { csv: newValue })
})

const googleSpreadsheetUrlValidationRule = (url?: string): true | string => {
  return url === undefined || isValidGoogleSpreadsheetUrl(url) || 'Enter a valid Google Spreadsheets URL'
}

const googleSpreadsheetUrlFetchValidationRule = (_?: string): true | string => {
  return sheetNames.value === undefined || Array.isArray(sheetNames.value) || sheetNames.value
}

const fetchWithErrorCheck = async (url: string): Promise<Response> => {
  try {
    return await fetch(url)
  } catch (e) {
    if (e instanceof TypeError) {
      const message = `Network error: ${e.message}.`
      if (e.message === 'Failed to fetch') {
        throw new Error(`${message} Check the sharing permissions on spreadsheet, enable access to anyone with url. Check access to internet.`)
      }
      throw new Error(message)
    } else {
      throw new Error(`${e}`)
    }
  }
}

const getSheetNames = async (text: string): Promise<string[]> => {
  const sheetNameExtractionRegex = /<div\s+class="(?:[^"]*\s+)?docs-sheet-tab-caption(?:\s+[^"]*)?">([^<]+)<\/div>/g

  let matches: string[] | null = []
  const output = []
  while ((matches = sheetNameExtractionRegex.exec(text)) !== null) {
    output.push(matches[1])
  }

  if (output.length > 0) {
    return output
  } else {
    throw new Error('No sheets found.')
  }
}

// getting sheet title is not breaking and should not throw
const getSheetTitle = async (text: string): Promise<string | undefined> => {
  const sheetTitleExtractionRegex = /<title>(.*?)<\/title>/g

  const matches = Array.from(text.matchAll(sheetTitleExtractionRegex))
  if (matches) {
    return matches[0][1]
  } else {
    return undefined
  }
}

const getSheetMetadata = async (url: string) => {
  sheetNames.value = undefined // this triggers reset of sheet name
  googleSpreadsheetCsvText.value = undefined // this triggers reset of googleSpreadsheetCsv
  sheetTitle.value = undefined
  try {
    const response = await fetchWithErrorCheck(url)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    sheetNames.value = await getSheetNames(text)
    sheetTitle.value = await getSheetTitle(text)
  } catch (e) {
    sheetNames.value = `${e}`
  }
}

const sheetNamesSelectionActive = (): boolean => {
  return Array.isArray(sheetNames.value) && sheetNames.value.length > 1
}

const getGoogleSpreadsheetCsv = async () => {
  googleSpreadsheetCsvText.value = undefined
  const spreadsheetId = getGoogleSpreadsheetIdFromUrl(googleSpreadsheetUrl.value)
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName.value}`
    const response = await fetchWithErrorCheck(csvUrl)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const responseStream = response.body

    if (!responseStream) {
      throw new Error('Response stream is null.')
    }

    googleSpreadsheetCsvText.value = { csvText: await response.text() }
  } catch (e) {
    googleSpreadsheetCsvText.value = `${e}`
  }
}

// when component is created fetch sheet data again
if (googleSpreadsheetUrl.value) {
  if (isValidGoogleSpreadsheetUrl(googleSpreadsheetUrl.value)) {
    getSheetMetadata(googleSpreadsheetUrl.value)
  }
}

</script>

<style>
.training-data-open-url-input {
    width: 100%;
}
</style>
