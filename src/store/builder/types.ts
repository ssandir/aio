export type BuilderComponents = 'model' | 'trainingData'

export type State = {
    currentlyOpen: BuilderComponents,
    data: { [key in BuilderComponents]: object }
}

export type Models = 'Regression' | 'Neural Network'