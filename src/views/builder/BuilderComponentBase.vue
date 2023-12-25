<template>
    <v-sheet :class="`bg-builder-${index} builder-component-base-${isOpen ? 'open' : 'closed'}`">
        <model-open v-if="componentName === 'model' && isOpen" />
        <model-closed v-if="componentName === 'model' && !isOpen" />
        <training-data-open v-if="componentName === 'trainingData' && isOpen" />
        <training-data-closed v-if="componentName === 'trainingData' && !isOpen" />
    </v-sheet>
</template>


<script lang="ts" setup>
import ModelClosed from './components/ModelClosed.vue'
import ModelOpen from './components/ModelOpen.vue'
import TrainingDataClosed from './components/TrainingDataClosed.vue'
import TrainingDataOpen from './components/TrainingDataOpen.vue'

defineProps<{
    componentName: string
    isOpen: boolean
    index: number
}>()
</script>

<style>
.builder-component-base-open {
    flex: 1;
}

.builder-component-base-closed {
    height: 50px;
}
</style>
