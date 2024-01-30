<template>
  <div>
    <h1>Model UI</h1>
    <p>Hash Parameter: {{ hash }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const hash = route.params.hash
</script>
