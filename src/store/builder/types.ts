export type BuilderComponents = 'model' | 'trainingData' | 'trainingData2'

export type State = {
    currentlyOpen: BuilderComponents,
    data: { [key in BuilderComponents]: object }
}

export type Models = 'Regression' | 'Neural Network'