import type { ModelValidatonDataTypes, Models, TrainingDataTypes } from './types'

export const models: Models[] = ['Regression', 'Neural Network']
export const trainingDataTypes: TrainingDataTypes[] = ['Google Spreadsheet']
export const modelValidationDataTypes: ModelValidatonDataTypes[] = [...trainingDataTypes, 'Training data']
