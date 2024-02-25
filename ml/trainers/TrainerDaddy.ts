import type { BuilderData } from '@shared/types'
import { extractColumnTitles } from '../shared/csvDataNormalizaton'
import { ModelUIMama } from 'modelUI/ModelUIMama'

export abstract class TrainerDaddy {
  public targetColumn: number[]
  public featureColumns: number[][]
  public columnTitles: string[]
  public columnsHaveTitles: boolean
  public columnStringValueExpansionList: Record<string, string[]> = {}
  public validationDataCsv: string[][]
  public validationTargetColumn: number[]

  constructor (protected builderData: BuilderData) {
    this.columnsHaveTitles = this.builderData.trainingData.columnsHaveTitles

    const csvRaw = this.builderData.trainingData.csv

    this.validationDataCsv = []
    if (this.builderData.modelValidationData.type === 'Training data') {
      const rowNumber = this.builderData.modelValidationData.rowNumber

      if (this.columnsHaveTitles) {
        this.validationDataCsv.push(csvRaw[0])
      }
      for (let i = 0; i < rowNumber; i++) {
        const rowNumber = csvRaw.length - (this.columnsHaveTitles ? 1 : 0)
        const randomIndex = Math.floor(Math.random() * rowNumber) + (this.columnsHaveTitles ? 1 : 0)
        this.validationDataCsv.push(csvRaw.splice(randomIndex, 1)[0])
      }
    } else {
      this.validationDataCsv = this.builderData.modelValidationData.csv
    }

    // separate column titles
    const { columnTitles, csv } = extractColumnTitles(csvRaw, this.columnsHaveTitles)

    // separate target column
    const targetColumnName = this.builderData.targetColumn.name
    const targetColumnIndex = columnTitles.indexOf(targetColumnName)
    if (targetColumnIndex < 0) {
      throw new Error(`Target column "${targetColumnName}" not found.`)
    }
    this.targetColumn = this.separateTargetColumn(csv, targetColumnIndex)
    const validationColumnTitlesData = extractColumnTitles(csvRaw, this.columnsHaveTitles)
    const validationTargetColumnIndex = validationColumnTitlesData.columnTitles.indexOf(targetColumnName)
    this.validationTargetColumn = this.separateTargetColumn(this.columnsHaveTitles ? this.validationDataCsv.slice(1) : this.validationDataCsv, validationTargetColumnIndex)

    columnTitles.splice(targetColumnIndex, 1)
    this.columnTitles = columnTitles// used for potentially reordering columns

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

  protected abstract trainModel (): ModelUIMama

  train (): ModelUIMama {
    return this.trainModel()
  }

  private separateTargetColumn (csv: string[][], targetColumnIndex: number): number[] {
    const targetColumn = csv.map(row => {
      const value = parseFloat(row.splice(targetColumnIndex, 1)[0])
      if (Number.isNaN(value)) {
        throw new Error(`Non numeric value "${value}" found in target column.`)
      }
      return value
    })

    return targetColumn
  }
}
