<template>
  <v-container class="fill-height flex-column">
    <training-screen v-if="isTrainingScreen" />
    <div v-else>
      {{ builderStore.trainedModel }}
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import TrainingScreen from './TrainingScreen.vue'
import { useBuilderStore } from '@/store/builder/builder'

const builderStore = useBuilderStore()

const isTrainingScreen = computed(() => !builderStore.trainedModel)

</script>
