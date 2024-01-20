<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      class="text-center"
    >
      <v-card-text v-if="(typeof maxRowNum === 'string')">
        {{ maxRowNum }}
      </v-card-text>
      <v-slider
        v-else
        v-model="rowNumber"
        :max="maxRowNum"
        :min="1"
        :label="`${rowNumber} (${Math.floor(rowNumber/maxRowNum * 100)}%)`"
        step="1"
        thumb-label
        tick-labels
        class="validation-training-data-slider"
        color="primary"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder'
import { computed, ref, watch, Ref } from 'vue'

const builderStore = useBuilderStore()

const maxRowNum = computed(() => {
  const trainingData = builderStore.getTrainingDataValidation

  if (typeof trainingData === 'string') {
    return trainingData
  }

  return trainingData.csv.length - (trainingData.columnsHaveTitles ? 2 : 1)
})

const modelValidationData = builderStore.data.modelValidationData
if (modelValidationData?.type !== 'Training data') {
  throw new Error('Trying to display ValidationFromTrainingData component when modelValidationData is not Training data')
}
if (typeof maxRowNum.value === 'number') {
  if (!modelValidationData.rowNumber) {
    // default to 20% as initial value
    builderStore.addModelValidationDataAttributeValue({ rowNumber: Math.floor(maxRowNum.value * 0.2) })
  }
}

const rowNumber: Ref<number> = ref(modelValidationData.rowNumber ?? 1)

watch(rowNumber, (newValue) => {
  builderStore.addModelValidationDataAttributeValue({ rowNumber: newValue })
})

</script>

<style>
.validation-training-data-slider {
    width: 300px;
}
</style>
