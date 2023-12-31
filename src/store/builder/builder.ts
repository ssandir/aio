import { defineStore } from 'pinia'
import type { BuilderComponents, State, ModelData, TrainingData, PartialTrainingData, PartialModelData, BuilderComponentsToPartialData, PartialModelValidatonData, ModelValidatonData } from './types'
import { isValidModelType } from './model/helpers'
import {
  isValidTrainingDataType,
  isValidTrainingDataGoogleSpreadsheetUrl,
  isValidTrainingDataSheetName,
  isValidTrainingDataColumnsHaveTitles,
  isValidTrainingDataCsv,
  isValidModelValidationDataType,
  isValidModelValidationDataGoogleSpreadsheetUrl,
  isValidModelValidationDataSheetName,
  isValidModelValidationDataColumnsHaveTitles,
  isValidModelValidationDataCsv
} from './trainingData/helpers'

export const useBuilderStore = defineStore('builder', {
  state: (): State => ({
    currentlyOpen: 'model',
    data: {
      model: {}
    }
  }),
  getters: {
    getCurrentlyOpen (): string {
      return this.currentlyOpen
    },
    getActiveComponents (): BuilderComponents[] {
      return Object.keys(this.data) as BuilderComponents[] // we heavily rely on JS not shuffling object keys here
    },
    getModelDataValidation (): ModelData | string {
      const model = this.data.model

      if (!isValidModelType(model)) {
        return 'Select a model.'
      }

      return model
    },
    getTrainingDataValidation (): TrainingData | string {
      const trainingData = this.data.trainingData

      if (!isValidTrainingDataType(trainingData)) {
        return 'Select a data source type.'
      }

      if (trainingData.type === 'Google Spreadsheet') {
        if (!isValidTrainingDataGoogleSpreadsheetUrl(trainingData)) {
          return 'Enter a valid Google Spreadsheets URL'
        }

        if (!isValidTrainingDataSheetName(trainingData)) {
          return 'Choose valid sheet name.'
        }

        if (!isValidTrainingDataColumnsHaveTitles(trainingData)) {
          return 'Missing columnsHaveTitles data.'
        }

        if (!isValidTrainingDataCsv(trainingData)) {
          return 'Missing columnsHaveTitles data.'
        }

        return trainingData
      }

      throw new Error('unhandled type')
    },
    getModelValidationDataValidation (): ModelValidatonData | string {
      const modelValidationData = this.data.modelValidationData

      if (!isValidModelValidationDataType(modelValidationData)) {
        return 'Select a data source type.'
      }

      if (modelValidationData.type === 'Google Spreadsheet') {
        if (!isValidModelValidationDataGoogleSpreadsheetUrl(modelValidationData)) {
          return 'Enter a valid Google Spreadsheets URL'
        }

        if (!isValidModelValidationDataSheetName(modelValidationData)) {
          return 'Choose valid sheet name.'
        }

        if (!isValidModelValidationDataColumnsHaveTitles(modelValidationData)) {
          return 'Missing columnsHaveTitles data.'
        }

        if (!isValidModelValidationDataCsv(modelValidationData)) {
          return 'Missing columnsHaveTitles data.'
        }
      }

      return modelValidationData
    }
  },
  actions: {
    setCurrentlyOpen (nextOpen: BuilderComponents) {
      this.currentlyOpen = nextOpen
    },
    addBuilderComponentIfNecessary (builderComponent: BuilderComponents) {
      if (typeof this.data[builderComponent] === 'object') {
        return
      }

      // until more possible types
      if (builderComponent !== 'model') {
        this.data[builderComponent] = {
          type: 'Google Spreadsheet'
        }
      } else {
        this.data[builderComponent] = {}
      }
    },
    nextCurrentlyOpen () {
      switch (this.currentlyOpen) {
        case 'model':
          this.addBuilderComponentIfNecessary('trainingData')
          this.setCurrentlyOpen('trainingData')
          break
        case 'trainingData':
          this.addBuilderComponentIfNecessary('modelValidationData')
          this.setCurrentlyOpen('modelValidationData')
          break
      }
    },
    addDataAttributeValue<T extends BuilderComponents>(attribute: T, newData: BuilderComponentsToPartialData[T]) {
      switch (attribute) {
        case 'model':
          this.addModelDataAtrributeValue(newData as PartialModelData)
          return
        case 'trainingData':
          this.addTrainingDataAttributeValue(newData as PartialTrainingData)
          return
        case 'modelValidationData':
          this.addModelValidationDataAttributeValue(newData as PartialModelValidatonData)
      }
    },
    addModelDataAtrributeValue (newData: PartialModelData) {
      this.data.model = {
        ...this.data.model,
        ...newData
      }
    },
    addTrainingDataAttributeValue (newData: PartialTrainingData) {
      this.data.trainingData = {
        ...this.data.trainingData,
        ...newData
      }
    },
    addModelValidationDataAttributeValue (newData: PartialModelValidatonData) {
      this.data.modelValidationData = {
        ...this.data.modelValidationData,
        ...newData
      }
    }
  }
})
