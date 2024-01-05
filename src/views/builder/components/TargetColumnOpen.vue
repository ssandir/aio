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
          Target column
        </v-card-title>
        <v-card-text>
          This is the variable that the machine learning model aims to predict or explain based on the input features.
        </v-card-text>
      </v-col>
    </v-row>

    <!-- Target column select -->
    <v-row
      align="center"
      justify="center"
      class="training-data-open-url-input"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-select
          v-if="Array.isArray(csvColumnNames)"
          v-model="targetColumnName"
          :items="csvColumnNames"
          label="Select a column"
        />
        <v-card-text v-else>
          {{ csvColumnNames }}
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
import { computed, ref, watch } from 'vue'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getTargetColumnDataValidation)
const csvColumnNames = computed(() => builderStore.getCsvColumnNames)
if (!Array.isArray(csvColumnNames.value) || !(csvColumnNames.value as (string | undefined)[]).includes(builderStore.data.targetColumn?.name)) {
  builderStore.addTargetColumnDataAttributeValue({}, true)
}
const targetColumnName = ref(builderStore.data.targetColumn?.name)

watch(targetColumnName, (newValue) => {
  builderStore.addTargetColumnDataAttributeValue({ name: newValue })
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
