<template>
  <v-app theme="main">
    <transition name="slide">
      <v-container v-if="!homeStore.getIsBuilderOpen" key="home" fluid fill-height class="bg-primary full-height">
        <v-row align="center" justify="center" class="home-header">
          <v-col cols="12" class="text-center">
            <v-typography class="text-h1 text-secondary">
              My AI Online
            </v-typography>
          </v-col>
        </v-row>

        <!-- New Row for content at the Bottom -->
        <v-row align="center" justify="center" class="home-footer">
          <v-col cols="12" class="text-center">
            <v-typography class="text-body-1 text-secondary" @click.stop="homeStore.toggleBuilder()">
              BUILD
            </v-typography>
          </v-col>
        </v-row>
      </v-container>

      <v-sheet v-else key="builder">
        <builder-base></builder-base>
      </v-sheet>
    </transition>
  </v-app>
</template>

<script lang="ts" setup>
import { useHomeStore } from '@/store/home/home';
import BuilderBase from './builder/BuilderBase.vue'
const homeStore = useHomeStore()
</script>

<style>
.full-height {
  height: 100vh;
  /* Set height to 100% of the viewport height */
}

.home-header {
  height: 90%;
}

.home-footer {
  height: 10%;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-leave-to, 
.slide-enter-to {
  transform: translateY(-100%);
}
</style>