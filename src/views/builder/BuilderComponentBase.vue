<template>
  <v-sheet
    :class="`bg-builder-${index} builder-component-base-${isOpen ? 'open' : 'closed'}`"
    :style="{ '--dynamic-height': dynamicHeight }"
  >
    <div class="builder-component-base-inner">
      <model-open v-if="componentName === 'model' && isOpen" />
      <model-closed v-if="componentName === 'model' && !isOpen" />
      <training-data-open v-if="componentName === 'trainingData' && isOpen" />
      <training-data-closed v-if="componentName === 'trainingData' && !isOpen" />
      <model-validation-data-open v-if="componentName === 'modelValidationData' && isOpen" />
      <model-validation-data-closed v-if="componentName === 'modelValidationData' && !isOpen" />
      <target-column-open v-if="componentName === 'targetColumn' && isOpen" />
      <target-column-closed v-if="componentName === 'targetColumn' && !isOpen" />
      <model-validation v-if="componentName === 'modelValidation'" />
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
import ModelClosed from './components/ModelClosed.vue'
import ModelOpen from './components/ModelOpen.vue'
import TrainingDataClosed from './components/TrainingDataClosed.vue'
import TrainingDataOpen from './components/TrainingDataOpen.vue'
import ModelValidationDataOpen from './components/ModelValidationDataOpen.vue'
import ModelValidationDataClosed from './components/ModelValidationDataClosed.vue'
import TargetColumnClosed from './components/TargetColumnClosed.vue'
import TargetColumnOpen from './components/TargetColumnOpen.vue'
import ModelValidation from './components/ModelValidation.vue'
import { BuilderScreens } from '@shared/types'
import { useBuilderStore } from '@/store/builder/builder'
import { computed } from 'vue'

defineProps<{
    componentName: BuilderScreens
    isOpen: boolean
    index: number
}>()

const builderStore = useBuilderStore()

const dynamicHeight = computed(() => `calc(100vh - ${builderStore.getComponentsNumber * 50}px)`)
</script>

<style>
.builder-component-base-open {
    flex: 1 0 var(--dynamic-height);
    transition: flex 1.5s;
    overflow: hidden;
}

.builder-component-base-closed {
    flex: 0 0 50px;
    transition: flex 1.5s;
    overflow: hidden;
}

/*
    Elements within the animated element shouldn't jump around while animation is in progress.
    Add an intermediate container with min-height set, so the content appears first as if y-transition and is then scaled to 100%
*/
.builder-component-base-inner {
    height: 100%;
    min-height: 400px;
}
</style>
