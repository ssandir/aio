<template>
  <closed-data-display :data="builderStore.data.targetColumn!" />
</template>

<script lang="ts" setup>
import ClosedDataDisplay from './shared/ClosedDataDisplay.vue'
import { useBuilderStore } from '@/store/builder/builder'

const builderStore = useBuilderStore()
</script>
