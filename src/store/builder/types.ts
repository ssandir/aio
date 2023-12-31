export type BuilderComponents = 'model' | 'trainingData' | 'modelValidationData'

export interface State {
  currentlyOpen: BuilderComponents
  data: DeepPartial<{
    model: ModelData
    trainingData: TrainingData
    modelValidationData: ModelValidatonData
  }>
}

export type Models = 'Regression' | 'Neural Network'
interface ModelDataBase<T extends Models> {
  type: T
}
export type RegressionModelData = ModelDataBase<'Regression'>
export type NeuralNetworModelData = ModelDataBase<'Neural Network'>
export type ModelData = RegressionModelData | NeuralNetworModelData
export type PartialModelData = DeepPartial<ModelData>

export type TrainingDataTypes = 'Google Spreadsheet'
interface TrainingDataBase<T extends TrainingDataTypes> {
  type: T
}
export type GoogleSpreadsheetsTrainingData = TrainingDataBase<'Google Spreadsheet'> & {
  url: string
  sheetName: string
  columnsHaveTitles: boolean
  csv: string[][]
}
export type TrainingData = GoogleSpreadsheetsTrainingData
export type PartialTrainingData = DeepPartial<TrainingData>

export type ModelValidatonDataTypes = 'Training data' | 'Google Spreadsheet'
interface ModelValidatonDataBase<T extends ModelValidatonDataTypes> {
  type: T
}
export type GoogleSpreadsheetsModelValidatonData = ModelValidatonDataBase<'Google Spreadsheet'> & {
  url: string
  sheetName: string
  columnsHaveTitles: boolean
  csv: string[][]
}
export type TrainingDataModelValidatonData = ModelValidatonDataBase<'Training data'>
export type ModelValidatonData = GoogleSpreadsheetsModelValidatonData | TrainingDataModelValidatonData
export type PartialModelValidatonData = DeepPartial<ModelValidatonData>

export interface BuilderComponentsToPartialData {
  'model': PartialModelData
  'trainingData': PartialTrainingData
  'modelValidationData': PartialModelValidatonData
}

// helper types
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T
