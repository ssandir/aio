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
          Model Selection
        </v-card-title>
      </v-col>
    </v-row>

    <!-- Model selection box-->
    <v-row
      align="center"
      justify="center"
      class="model-open-selection-box"
    >
      <v-col cols="12">
        <v-select
          v-model="modelType"
          :items="models"
          label="Select a model"
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
import { models } from '@/store/builder/constants'
import { useBuilderStore } from '@/store/builder/builder'
import { computed, ref, watch } from 'vue'

const builderStore = useBuilderStore()

const dataValidation = computed(() => builderStore.getModelDataValidation)

const modelType = ref(builderStore.data.model?.type)

watch(modelType, (newValue) => {
  builderStore.addModelDataAtrributeValue({ type: newValue })
})

const isDoneButtonDisabled = (): boolean => {
  return typeof dataValidation.value === 'string'
}

const handleDoneClick = () => {
  builderStore.nextCurrentlyOpen()
}
</script>

<style>
.model-open-selection-box {
    width: 100%;
}
</style>
