import { TrainingDataTypes, TrainingData, DeepPartial } from '../types'
import { trainingDataTypes } from '../constants'

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

export function isValidTrainingDataGoogleSpreadsheetUrl (trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { url: string }) {
  return isValidGoogleSpreadsheetUrl(trainingData?.url)
}

export function isValidTrainingDataSheetName (trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { sheetName: string }) {
  return typeof trainingData?.sheetName === 'string'
}

export function isValidTrainingDataColumnsHaveTitles (trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { columnsHaveTitles: boolean }) {
  return typeof trainingData?.columnsHaveTitles === 'boolean'
}

export function isValidTrainingDataCsv (trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { csv: string[][] }) {
  return Array.isArray(trainingData?.csv) && trainingData.csv.every(row => Array.isArray(row))
}
