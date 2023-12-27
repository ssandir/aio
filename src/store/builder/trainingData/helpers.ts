import { TrainingDataTypes, TrainingData, DeepPartial } from '../types'
import { trainingDataTypes } from '../constants'

export function isValidTrainingDataType(trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & {type: TrainingDataTypes }) {
    return !!trainingData && trainingDataTypes.includes(trainingData.type as TrainingDataTypes);
}

export function getGoogleSpreadsheetIdFromUrl(url?: string): string | false {
    if(!url) return false
    const googleSpreadsheetUrlPattern = /^https?:\/\/docs\.google\.com\/spreadsheets\/d\/([^/]+)($|(\/|\?|#)\S*$)/i;
    const matches = url.match(googleSpreadsheetUrlPattern)
    if(!matches) return false
    if(!matches[0]) return false
    return matches[0]
}

export function isValidGoogleSpreadsheetUrl(url: string | undefined): url is string {
    return !!getGoogleSpreadsheetIdFromUrl(url)
}

export function isValidTrainingDataGoogleSpreadsheetUrl(trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { url: string }) {
    return isValidGoogleSpreadsheetUrl(trainingData?.url)
}

export function isValidTrainingDataSheetName(trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { sheetName: string }) {
    return typeof trainingData?.sheetName === 'string'
}