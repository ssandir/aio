import { defineStore } from 'pinia'
import type { BuilderComponents, State, ModelData, TrainingData, PartialTrainingData, PartialModelData } from './types'
import { isValidModelType } from './model/helpers'
import { isValidTrainingDataType, isValidTrainingDataGoogleSpreadsheetUrl, isValidTrainingDataSheetName } from './trainingData/helpers'

export const useBuilderStore = defineStore('builder', {
  state: (): State => ({
    currentlyOpen: 'model',
    data: {
      'model': {},
      'trainingData': {
        'type': 'Google Spreadsheet' // until more possible types
      },
      'trainingData2': {}
    }
  }),
  getters: {
    getCurrentlyOpen(): string {
      return this.currentlyOpen
    },
    getActiveComponents(): string[] {
      return Object.keys(this.data) // we heavily rely on JS not shuffling object keys here
    },
    getModelDataValidation(): ModelData | string {
      const model = this.data.model

      if (!isValidModelType(model)) {
        return "Select a model."
      }

      return model
    },
    getTrainingDataValidation(): TrainingData | string {
      const trainingData = this.data.trainingData

      if (!isValidTrainingDataType(trainingData)) {
        return "Select a data source type."
      }

      if (!isValidTrainingDataGoogleSpreadsheetUrl(trainingData)) {
        return 'Enter a valid Google Spreadsheets URL'
      }

      if (!isValidTrainingDataSheetName(trainingData)) {
        return 'Choose valid sheet name.'
      }

      console.error(trainingData)

      return trainingData
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
    addModelDataAtrributeValue (newData: PartialModelData) {
      this.data.model = {
        ...this.data.model,
        ...newData,
      }
    },
    addTrainingDataAttributeValue (newData: PartialTrainingData) {
      this.data.trainingData = {
        ...this.data.trainingData,
        ...newData,
      }
    },
  },
})