<template>
  <div class="builder-base">
    <builder-component-base
      v-for="(componentName, index) in builderStore.getActiveComponents"
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
const builderStore = useBuilderStore()
</script>

<style>
.builder-base {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
