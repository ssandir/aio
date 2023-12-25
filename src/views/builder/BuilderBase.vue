<template>
    <builder-component-base 
        v-for="(componentName, index) in builderStore.getActiveComponents"
        :key="componentName"
        :component-name="componentName"
        :is-open="componentName === builderStore.getCurrentlyOpen"
        :index="index"
    > 
    </builder-component-base>
</template>

<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder';
import BuilderComponentBase from './BuilderComponentBase.vue'
const builderStore = useBuilderStore()
</script>

<style>
.full-height {
  height: 100vh;
  /* Set height to 100% of the viewport height */
}
</style>