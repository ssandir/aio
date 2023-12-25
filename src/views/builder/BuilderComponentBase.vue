<template>
    <v-sheet :class="`bg-builder-${index} builder-component-base-${isOpen ? 'open' : 'closed'}`">
        <model-open
            v-if="componentName==='model' && isOpen"
        />
        <model
            v-if="componentName==='model' && !isOpen"
        />
        <training-data
            v-if="componentName==='trainingData' && isOpen"
        />
        <training-data-open
            v-if="componentName==='trainingData' && !isOpen"
        />
    </v-sheet>
</template>


<script lang="ts" setup>
import Model from './components/Model.vue'
import ModelOpen from './components/ModelOpen.vue'
import TrainingData from './components/TrainingData.vue'
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
