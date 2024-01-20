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

    <google-spreadsheets data-attribute="trainingData" />

    <v-row
      align="center"
      justify="center"
      class="training-data-open-url-input"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-switch
          v-if="builderStore.data.trainingData?.csv !== undefined"
          v-model="columnsHaveTitles"
          hide-details
          inset
          :label="`Columns ${columnsHaveTitles ? '' : 'don\'t'} have titles.`"
        />
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
import { Ref, computed, ref, watch } from 'vue'
import GoogleSpreadsheets from './dataInput/GoogleSpreadsheets.vue'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getTrainingDataValidation)

if (builderStore.data.trainingData?.columnsHaveTitles === undefined) {
  builderStore.addTrainingDataAttributeValue({ columnsHaveTitles: true })
}
const columnsHaveTitles: Ref<boolean> = ref(builderStore.data.trainingData?.columnsHaveTitles ?? true)

watch(columnsHaveTitles, (newValue) => {
  builderStore.addTrainingDataAttributeValue({ columnsHaveTitles: newValue })
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
