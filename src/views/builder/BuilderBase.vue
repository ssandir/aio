<template>
  <div class="builder-base">
    <builder-component-base
      v-for="(componentName, index) in components"
      :key="componentName"
      :component-name="componentName"
      :is-open="componentName === builderStore.getCurrentlyOpen"
      :index="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder'
import BuilderComponentBase from './BuilderComponentBase.vue'
import { computed } from 'vue'
import { BuilderScreens } from '@shared/types'
const builderStore = useBuilderStore()

// model validation is the last step, this component is only visible if opened
const components = computed(() => [...builderStore.getActiveComponents, ...(builderStore.currentlyOpen === 'modelValidation' ? ['modelValidation'] : [])] as BuilderScreens[])
</script>

<style>
.builder-base {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
