import { TrainingDataTypes, TrainingData, DeepPartial, ModelValidatonData, ModelValidatonDataTypes, GoogleSpreadsheetsModelValidatonData, GoogleSpreadsheetsTrainingData, TargetColumnData } from '../types'
import { trainingDataTypes, modelValidationDataTypes } from '../constants'

export function isValidTrainingDataType (trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { type: TrainingDataTypes }) {
  return !(trainingData == null) && trainingDataTypes.includes(trainingData.type as TrainingDataTypes)
}

export function getGoogleSpreadsheetIdFromUrl (url?: string): string | false {
  if (url === undefined) return false
  const googleSpreadsheetUrlPattern = /^https?:\/\/docs\.google\.com\/spreadsheets\/d\/([^/]+)($|(\/|\?|#)\S*$)/ig
  const matches = Array.from(url.matchAll(googleSpreadsheetUrlPattern))

  if (matches === null) return false
  if (matches[0][1] === undefined) return false
  return matches[0][1]
}

export function isValidGoogleSpreadsheetUrl (url: string | undefined): url is string {
  return typeof getGoogleSpreadsheetIdFromUrl(url) === 'string'
}

export function isValidTrainingDataGoogleSpreadsheetUrl (trainingData: DeepPartial<GoogleSpreadsheetsTrainingData> | undefined): trainingData is (DeepPartial<GoogleSpreadsheetsTrainingData> & { url: string }) {
  return isValidGoogleSpreadsheetUrl(trainingData?.url)
}

export function isValidTrainingDataSheetName (trainingData: DeepPartial<GoogleSpreadsheetsTrainingData> | undefined): trainingData is (DeepPartial<GoogleSpreadsheetsTrainingData> & { sheetName: string }) {
  return typeof trainingData?.sheetName === 'string'
}

export function isValidTrainingDataColumnsHaveTitles (trainingData: DeepPartial<GoogleSpreadsheetsTrainingData> | undefined): trainingData is (DeepPartial<GoogleSpreadsheetsTrainingData> & { columnsHaveTitles: boolean }) {
  return typeof trainingData?.columnsHaveTitles === 'boolean'
}

export function isValidTrainingDataCsv (trainingData: DeepPartial<GoogleSpreadsheetsTrainingData> | undefined): trainingData is (DeepPartial<GoogleSpreadsheetsTrainingData> & { csv: string[][] }) {
  return Array.isArray(trainingData?.csv) && trainingData.csv.every(row => Array.isArray(row))
}

export function isValidModelValidationDataType (modelValidationData: DeepPartial<ModelValidatonData> | undefined): modelValidationData is (DeepPartial<ModelValidatonData> & { type: ModelValidatonDataTypes }) {
  return !(modelValidationData == null) && modelValidationDataTypes.includes(modelValidationData.type as ModelValidatonDataTypes)
}

export function isValidModelValidationDataGoogleSpreadsheetUrl (modelValidationData: DeepPartial<GoogleSpreadsheetsModelValidatonData> | undefined): modelValidationData is (DeepPartial<GoogleSpreadsheetsModelValidatonData> & { url: string }) {
  return isValidGoogleSpreadsheetUrl(modelValidationData?.url)
}

export function isValidModelValidationDataSheetName (modelValidationData: DeepPartial<GoogleSpreadsheetsModelValidatonData> | undefined): modelValidationData is (DeepPartial<GoogleSpreadsheetsModelValidatonData> & { sheetName: string }) {
  return typeof modelValidationData?.sheetName === 'string'
}

export function isValidModelValidationDataCsv (modelValidationData: DeepPartial<GoogleSpreadsheetsModelValidatonData> | undefined): modelValidationData is (DeepPartial<GoogleSpreadsheetsModelValidatonData> & { csv: string[][] }) {
  return Array.isArray(modelValidationData?.csv) && modelValidationData.csv.every(row => Array.isArray(row))
}

export function isValidTargetColumnDataName (targetColumnData: DeepPartial<TargetColumnData> | undefined): targetColumnData is (DeepPartial<TargetColumnData> & { name: string }) {
  return typeof targetColumnData?.name === 'string'
}
