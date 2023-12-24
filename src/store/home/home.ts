import { defineStore } from 'pinia'

export const useHomeStore = defineStore('app', {
  state: () => ({
    isBuilderOpen: false
  }),
  getters: {
    getIsBuilderOpen(): boolean {
        return this.isBuilderOpen
    }
  },
  actions: {
    toggleBuilder() {
      this.isBuilderOpen = !this.isBuilderOpen;
    },
  },
})