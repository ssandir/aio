<template>
  <v-row>
    <v-col
      v-for="(value, key) in data"
      :key="key"
      class="data-display-column"
    >
      <v-card-subtitle class="text-center">
        {{ key }}
      </v-card-subtitle>
      <v-card-text class="text-center text-card">
        {{ value }}
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { PartialModelData, PartialTrainingData, PartialModelValidatonData } from '@/store/builder/types'

defineProps<{
    data: PartialModelData | PartialTrainingData | PartialModelValidatonData
}>()

</script>

<style>
.v-card-text.text-card {
  padding: 2px;
}

.data-display-column {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.text-center {
  text-align: center;
}
</style>