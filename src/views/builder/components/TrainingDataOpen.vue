<template>
    <v-container class="fill-height flex-column">
        <!-- Title at the top -->
        <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
                <v-card-title class="text-h2 text-secondary">
                    Training Data
                </v-card-title>
            </v-col>
        </v-row>

        <!-- Done button at the bottom -->
        <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
                <v-tooltip location="top" :disabled="!isDoneButtonDisabled()">
                    <template v-slot:activator="{ props }">
                        <div v-bind="props" class="d-inline-block">
                            <v-btn @click.stop="handleDoneClick" color="primary"
                                :disabled="isDoneButtonDisabled()">Done</v-btn>
                        </div>
                    </template>
                    {{ doneButtonDisablers().join('\n') }}
                </v-tooltip>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts" setup>
import { useBuilderStore } from '@/store/builder/builder';

const builderStore = useBuilderStore();

const doneButtonDisablers = () => {
    const disablers: string[] = [];
    return disablers;
};

const isDoneButtonDisabled = (): boolean => {
    return doneButtonDisablers().length > 0
}

const handleDoneClick = () => {
    builderStore.nextCurrentlyOpen()
};
</script>
  
<style>
.model-open-selection-box {
    width: 100%;
}
</style>