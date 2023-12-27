export type BuilderComponents = 'model' | 'trainingData' | 'trainingData2'

export type State = {
    currentlyOpen: BuilderComponents,
    data: DeepPartial<{ 
        model: ModelData
        trainingData: TrainingData
        trainingData2: TrainingData
    }>
}

export type Models = 'Regression' | 'Neural Network'
type ModelDataBase<T extends Models> = {
    type: T
}
export type RegressionModelData = ModelDataBase<'Regression'>
export type NeuralNetworModelData = ModelDataBase<'Neural Network'>
export type ModelData = RegressionModelData | NeuralNetworModelData
export type PartialModelData = DeepPartial<ModelData>

export type TrainingDataTypes = 'Google Spreadsheet'
type TrainingDataBase<T extends TrainingDataTypes> = {
    type: T
}
export type GoogleSpreadsheetsTrainingData = TrainingDataBase<'Google Spreadsheet'> & {
    url: string
    sheetName: string
}
export type TrainingData = GoogleSpreadsheetsTrainingData
export type PartialTrainingData = DeepPartial<TrainingData>


// helper types
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>
} : T
