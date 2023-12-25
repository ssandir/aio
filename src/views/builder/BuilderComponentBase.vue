<template>
    <v-sheet :class="`bg-builder-${index}`">
        {{ componentName }} : {{ isOpen }}
    </v-sheet>
    
</template>


<script lang="ts" setup>
defineProps<{
    componentName: string
    isOpen: boolean
    index: number
}>()
</script>
