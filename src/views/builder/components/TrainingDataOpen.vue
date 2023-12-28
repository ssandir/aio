<template>
  <v-container class="fill-height flex-column">
    <!-- Title -->
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-card-title class="text-h2 text-secondary">
          Training Data
        </v-card-title>
      </v-col>
    </v-row>

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
        <v-switch
          v-if="sheetName !== undefined"
          v-model="columnsHaveTitles"
          hide-details
          inset
          :label="`Columns ${columnsHaveTitles ? '' : 'don\'t'} have titles.`"
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

    <!-- Done button -->
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-tooltip
          location="top"
          :disabled="!isDoneButtonDisabled()"
        >
          <template #activator="{ props }">
            <div
              v-bind="props"
              class="d-inline-block"
            >
              <v-btn
                color="primary"
                :disabled="isDoneButtonDisabled()"
                @click.stop="handleDoneClick"
              >
                Done
              </v-btn>
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
import { computed, ref, watch, Ref } from 'vue'
import { getGoogleSpreadsheetIdFromUrl, isValidGoogleSpreadsheetUrl } from '@/store/builder/trainingData/helpers'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getTrainingDataValidation)

const googleSpreadsheetUrl = ref(builderStore.data.trainingData?.url)
const sheetNames: Ref<undefined | string[] | string> = ref(undefined)
const selectedSheetName: Ref<undefined | string> = ref(builderStore.data.trainingData?.sheetName)
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
const columnsHaveTitles: Ref<boolean> = ref(true)
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
  builderStore.addTrainingDataAttributeValue({ url: newValue })

  if (isValidGoogleSpreadsheetUrl(newValue)) {
    getSheetMetadata(newValue)
  }
})

watch(sheetName, (newValue) => {
  builderStore.addTrainingDataAttributeValue({ sheetName: newValue })

  if (newValue !== undefined) {
    getGoogleSpreadsheetCsv()
  }
})

watch(columnsHaveTitles, (newValue) => {
  builderStore.addTrainingDataAttributeValue({ columnsHaveTitles: newValue })
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
  builderStore.nextCurrentlyOpen()
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

</script>

<style>
.training-data-open-url-input {
    width: 100%;
}
</style>
