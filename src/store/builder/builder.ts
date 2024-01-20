import { defineStore } from 'pinia'
import type { BuilderComponents, State, ModelData, TrainingData, PartialTrainingData, PartialModelData, BuilderComponentsToPartialData, PartialModelValidatonData, ModelValidatonData, PartialTargetColumnData, TargetColumnData } from '@shared/types'
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
  isValidModelValidationDataCsv,
  isValidTargetColumnDataName,
  isValidModelValidationDataRowNumber,
  validateColumnTitleRow,
  validateRowsHaveSameColumnNumber
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
    getComponentsNumber (): number {
      return Object.keys(this.data).length
    },
    getActiveComponents (): BuilderComponents[] {
      return Object.keys(this.data) as BuilderComponents[] // we heavily rely on JS not shuffling object keys here
    },
    getCsvColumnNames (): string[] | string {
      const trainingDataValidation = this.getTrainingDataValidation
      if (typeof trainingDataValidation === 'string') {
        return `Training data must be selected first. ${trainingDataValidation}`
      }
      return trainingDataValidation.columnsHaveTitles ? trainingDataValidation.csv[0] : Array.from({ length: trainingDataValidation.csv[0].length }, (_, index) => `${index}`)
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
      } else {
        throw new Error('unhandled type')
      }

      if (!isValidTrainingDataCsv(trainingData)) {
        return 'Missing csv data.'
      }

      if (!isValidTrainingDataColumnsHaveTitles(trainingData)) {
        return 'Missing columnsHaveTitles data.'
      }

      if (trainingData.columnsHaveTitles) {
        if (!validateColumnTitleRow(trainingData.csv[0])) {
          return 'Column titles must be unique.'
        }
      }

      if (!validateRowsHaveSameColumnNumber(trainingData.csv)) {
        return 'Invalid csv. Rows must have the same number of columns.'
      }

      return trainingData
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

        if (!isValidModelValidationDataCsv(modelValidationData)) {
          return 'Missing columnsHaveTitles data.'
        }
      }

      if (modelValidationData.type === 'Training data') {
        if (!isValidModelValidationDataRowNumber(modelValidationData)) {
          return 'Missing model validation training data row number.'
        }
      }

      return modelValidationData
    },
    getTargetColumnDataValidation (): TargetColumnData | string {
      const targetColumnData = this.data.targetColumn

      if (!isValidTargetColumnDataName(targetColumnData)) {
        return 'Select a target column.'
      }

      return targetColumnData
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
      if (builderComponent === 'trainingData' || builderComponent === 'modelValidationData') {
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
        case 'modelValidationData':
          this.addBuilderComponentIfNecessary('targetColumn')
          this.setCurrentlyOpen('targetColumn')
          break
        case 'targetColumn':
          this.setCurrentlyOpen('model')
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
          return
        case 'targetColumn':
          this.addTargetColumnDataAttributeValue(newData as PartialTargetColumnData)
      }
    },
    addModelDataAtrributeValue (newData: PartialModelData, replace = false) {
      this.data.model = {
        ...(replace ? {} : this.data.model),
        ...newData
      }
    },
    addTrainingDataAttributeValue (newData: PartialTrainingData, replace = false) {
      this.data.trainingData = {
        ...(replace ? {} : this.data.trainingData),
        ...newData
      }
    },
    addModelValidationDataAttributeValue (newData: PartialModelValidatonData, replace = false) {
      this.data.modelValidationData = {
        ...(replace ? {} : this.data.modelValidationData),
        ...newData
      }
    },
    addTargetColumnDataAttributeValue (newData: PartialTargetColumnData, replace = false) {
      this.data.targetColumn = {
        ...(replace ? {} : this.data.targetColumn),
        ...newData
      }
    }
  }
})
