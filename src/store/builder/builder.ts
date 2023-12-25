import { defineStore } from 'pinia'

type BuilderComponents = 'model' | 'trainingData'

export const useBuilderStore = defineStore('builder', {
  state: () => ({
    currentlyOpen: 'model' as BuilderComponents,
    data: {
      'model': {},
      'trainingData': {}
    } as { [key in BuilderComponents]: object }
  }),
  getters: {
    getCurrentlyOpen(): string {
      return this.currentlyOpen
    },
    getActiveComponents(): string[] {
      return Object.keys(this.data) // we heavily rely on JS not shuffling object keys here
    }
  },
  actions: {
    setCurrentlyOpen(nextOpen: BuilderComponents) {
      this.currentlyOpen = nextOpen;
    },
  },
})