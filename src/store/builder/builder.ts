import { defineStore } from 'pinia'
import type { BuilderComponents, State } from './types'

export const useBuilderStore = defineStore('builder', {
  state: (): State => ({
    currentlyOpen: 'model',
    data: {
      'model': {},
      'trainingData': {},
      'trainingData2': {}
    }
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
    setCurrentlyOpen (nextOpen: BuilderComponents) {
      this.currentlyOpen = nextOpen;
    },
    nextCurrentlyOpen() {
      switch(this.currentlyOpen) {
        case 'model':
          this.setCurrentlyOpen('trainingData')
          break;
        case 'trainingData':
          this.setCurrentlyOpen('model')
          break;
      }
    },
    addModelSelectionData (data: object) {
      if (!('model' in data) || typeof data.model !== 'string') {
        throw new Error('Invalid data.')
      }

      this.data.model = { [data.model]: {} };
    },
  },
})