import { BuilderData } from '@root/src/store/builder/types'

export abstract class TrainerDaddy {
  targetColumn?: unknown[]
  featureColumns?: unknown[][]
  columnTitles?: string[]
  model?: unknown

  constructor(protected builderData: BuilderData) {}

  abstract normalizeData(): void 
  abstract trainModel(): void 

  train() {
    this.normalizeData()
    this.trainModel()
  }
}