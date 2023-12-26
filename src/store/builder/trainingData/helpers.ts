import { TrainingDataTypes, TrainingData, DeepPartial } from '../types'
import { trainingDataTypes } from '../constants'

export function isValidTrainingDataType(trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & {type: TrainingDataTypes }) {
    return !!trainingData && trainingDataTypes.includes(trainingData.type as TrainingDataTypes);
}

export function isValidGoogleSpreadsheetUrl(url: string | undefined): url is string {
    const urlPattern = /^https?:\/\/docs\.google\.com\/spreadsheets\/d\/\S+$/i;
    return !!url && urlPattern.test(url)
}

export function isValidTrainingDataGoogleSpreadsheetUrl(trainingData: DeepPartial<TrainingData> | undefined): trainingData is (DeepPartial<TrainingData> & { url: string }) {
    return !!trainingData && isValidGoogleSpreadsheetUrl(trainingData.url)
}