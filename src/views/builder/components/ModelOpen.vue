<template>
  <v-container>
    <!-- Title at the top -->
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-card-title class="text-h2 text-secondary">
            Select Model
        </v-card-title>
      </v-col>
    </v-row>

    <!-- Selection box in the middle -->
    <v-row align="center" justify="center">
      <v-col cols="12">
        <!-- Replace this with your actual selection box component -->
        <v-select v-model="selectedValue" :items="selectionOptions" label="Select an option"></v-select>
      </v-col>
    </v-row>

    <!-- Done button at the bottom -->
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-btn @click.stop="handleDoneClick" color="primary">
          Done
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedValue = ref<string | null>(null); // You may want to replace the type with the actual type of your selection

const selectionOptions = ['Option 1', 'Option 2', 'Option 3']; // Replace this with your actual selection options

const handleDoneClick = () => {
    // Handle the "Done" button click event
    console.log('Selected Value:', selectedValue.value);
};
</script>