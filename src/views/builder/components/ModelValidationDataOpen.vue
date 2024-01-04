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

    <!-- Data type selection -->
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn-toggle
          v-model="dataType"
          variant="outlined"
          divided
        >
          <v-btn
            value="Training data"
            class="text-secondary"
          >
            Random 1/3 of training data
          </v-btn>

          <v-btn
            value="Google Spreadsheet"
            class="text-secondary"
          >
            Google Spreadsheet
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <google-spreadsheets
      v-if="dataType === 'Google Spreadsheet'"
      data-attribute="modelValidationData"
    />

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
import { computed, ref, watch } from 'vue'
import GoogleSpreadsheets from './shared/GoogleSpreadsheets.vue'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getModelValidationDataValidation)
const dataType = ref(builderStore.data.modelValidationData?.type)

watch(dataType, (newValue) => {
  builderStore.addModelValidationDataAttributeValue({ type: newValue }, true)
})

const isDoneButtonDisabled = () => {
  return typeof dataValidation.value === 'string'
}

const handleDoneClick = () => {
  // Handle the click, for example, store the URL or perform other actions
  builderStore.nextCurrentlyOpen()
}
</script>

<style>
.training-data-open-url-input {
    width: 100%;
}
</style>
