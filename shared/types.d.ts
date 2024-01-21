export type BuilderComponents = 'model' | 'trainingData' | 'modelValidationData' | 'targetColumn'
export type BuilderScreens = BuilderComponents | 'trainingScreen'

export interface State {
  currentlyOpen: BuilderScreens
  data: DeepPartial<BuilderData>
}

export interface BuilderData {
  model: ModelData
  trainingData: TrainingData
  modelValidationData: ModelValidatonData
  targetColumn: TargetColumnData
}

export type Models = 'Regression' | 'Neural Network'
interface ModelDataBase<T extends Models> {
  type: T
}
export type RegressionModelData = ModelDataBase<'Regression'>
export type NeuralNetworModelData = ModelDataBase<'Neural Network'>
export type ModelData = RegressionModelData | NeuralNetworModelData
export type PartialModelData = DeepPartial<ModelData>

export interface CsvData {
  csv: string[][]
}

interface GoogleSpreadsheetData extends CsvData {
  url: string
  sheetName: string
}
export type PartialGoogleSpeadsheetData = DeepPartial<GoogleSpreadsheetData>

export type TrainingDataTypes = 'Google Spreadsheet'
interface TrainingDataBase<T extends TrainingDataTypes> {
  type: T
  columnsHaveTitles: boolean
}
export type GoogleSpreadsheetsTrainingData = TrainingDataBase<'Google Spreadsheet'> & GoogleSpreadsheetData
export type TrainingData = GoogleSpreadsheetsTrainingData
export type PartialTrainingData = DeepPartial<TrainingData>

export type ModelValidatonDataTypes = 'Training data' | 'Google Spreadsheet'
interface ModelValidatonDataBase<T extends ModelValidatonDataTypes> {
  type: T
}
export type GoogleSpreadsheetsModelValidatonData = ModelValidatonDataBase<'Google Spreadsheet'> & GoogleSpreadsheetData
export type TrainingDataModelValidatonData = ModelValidatonDataBase<'Training data'> & {
  rowNumber: number
}
export type PartialTrainingDataModelValidatonData = DeepPartial<TrainingDataModelValidatonData>
export type ModelValidatonData = GoogleSpreadsheetsModelValidatonData | TrainingDataModelValidatonData
export type PartialModelValidatonData = DeepPartial<ModelValidatonData>

export interface TargetColumnData {
  name: string
}
export type PartialTargetColumnData = DeepPartial<TargetColumnData>

export interface BuilderComponentsToPartialData {
  'model': PartialModelData
  'trainingData': PartialTrainingData
  'modelValidationData': PartialModelValidatonData
  'targetColumn': PartialTargetColumnData
}

// helper types
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T
