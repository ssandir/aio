import type { BuilderData, CsvData } from '@shared/types'
import { extractColumnTitles } from '@ml-shared/csvDataNormalizaton'
 
export abstract class TrainerDaddy {
  public targetColumn: number[]
  public featureColumns: number[][]
  public columnTitles: string[]
  public columnsHaveTitles: boolean
  public targetColumnTitle: string
  public columnStringValueExpansionList: Record<string, string[]> = {}

  constructor (protected builderData: BuilderData) {
    this.columnsHaveTitles = this.builderData.trainingData.columnsHaveTitles
    this.targetColumnTitle = this.builderData.targetColumn.name

    const { columnTitles, csv } = extractColumnTitles(this.builderData.trainingData.csv, this.columnsHaveTitles)

    // separate target column
    const targetColumnIndex = columnTitles.indexOf(this.targetColumnTitle)
    if (targetColumnIndex < 0) {
      throw new Error(`Target column "${this.targetColumnTitle}" not found.`)
    }
    this.targetColumn = csv.map(row => {
      const value = parseFloat(row.splice(targetColumnIndex, 1)[0])
      if (Number.isNaN(value)) {
        throw new Error(`Non numeric value "${value}" found in target column.`)
      }
      return value
    })
    columnTitles.splice(targetColumnIndex, 1)
    this.columnTitles = columnTitles // used for potentially reordering columns

    if (this.builderData.modelValidationData.type === 'Training data') {
      
    }

    // tbd -> separate the columnStringValueExpansionList generation and then the normalization is the same
    // feature columns
    const featureColumns: number[][] = csv.map(_ => [])
    for (let NColumn = 0; NColumn < csv[0].length; ++NColumn) {
      if (Number.isNaN(parseFloat(csv[0][NColumn]))) {
        const columnName = this.columnTitles[NColumn]
        this.columnStringValueExpansionList[columnName] = []
        for (let NRow = 0; NRow < csv.length; ++NRow) {
          if (!this.columnStringValueExpansionList[columnName].includes(csv[NRow][NColumn])) {
            this.columnStringValueExpansionList[columnName].push(csv[NRow][NColumn])
          }
        }

        if (this.columnStringValueExpansionList[columnName].length > Math.log2(csv.length) + 1) {
          throw new Error(`Too many unique values in non numeric column "${columnName}".`)
        }

        for (let NRow = 0; NRow < csv.length; ++NRow) {
          this.columnStringValueExpansionList[columnName].forEach(possibleValue => {
            featureColumns[NRow].push(possibleValue === csv[NRow][NColumn] ? 1 : 0)
          })
        }
      } else {
        for (let NRow = 0; NRow < csv.length; ++NRow) {
          const value = parseFloat(csv[NRow][NColumn])
          if (Number.isNaN(value)) {
            throw new Error(`Non-numeric value "${value}" found in numeric column "${this.columnTitles[NColumn]}".`)
          }
          featureColumns[NRow].push(value)
        }
      }
    }

    this.featureColumns = featureColumns
  }

  protected abstract trainModel (): void

  train (): void {
    this.trainModel()
  }
}
