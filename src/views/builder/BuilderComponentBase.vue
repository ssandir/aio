<template>
    <v-sheet :class="`bg-builder-${index} builder-component-base-${isOpen ? 'open' : 'closed'}`">
        <div class="builder-component-base-inner">
            <model-open v-if="componentName === 'model' && isOpen" />
            <model-closed v-if="componentName === 'model' && !isOpen" />
            <training-data-open v-if="componentName === 'trainingData' && isOpen" />
            <training-data-closed v-if="componentName === 'trainingData' && !isOpen" />
            <training-data-open v-if="componentName === 'trainingData2' && isOpen" />
            <training-data-closed v-if="componentName === 'trainingData2' && !isOpen" />
        </div>
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
    flex: 1 0 50px;
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