import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
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