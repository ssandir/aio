import { BuilderData } from '@root/src/store/builder/types'

export abstract class TrainerDaddy {
  targetColumn: number[]
  featureColumns: number[][]
  columnTitles: string[]
  columnsHaveTitles: boolean
  columnStringValueExpansionList: Record<string, string[]> = {}

  constructor (protected builderData: BuilderData) {
    this.columnsHaveTitles = this.builderData.trainingData.columnsHaveTitles

    let columnTitles: string[]
    let csv: string[][]
    if (this.columnsHaveTitles) {
      [columnTitles, ...csv] = this.builderData.trainingData.csv
    } else {
      columnTitles = this.builderData.trainingData.csv[0].map((_, i) => `${i}`)
      csv = this.builderData.trainingData.csv
    }

    this.columnTitles = columnTitles // used for potentially reordering columns and selecting target column

    const featureColumns: number[][] = csv.map(_ => [])
    const targetColumn: number[] = []
    const targetColumnIndex = columnTitles.indexOf(this.builderData.targetColumn.name)
    for (let NColumn = 0; NColumn < csv[0].length; ++NColumn) {
      if (targetColumnIndex === NColumn) {
        for (let NRow = 0; NRow < csv.length; ++NRow) {
          const value = parseFloat(csv[NRow][NColumn])
          if (Number.isNaN(value)) {
            throw new Error('Non numeric value for target column.')
          }
          targetColumn.push(value)
        }
      } else if (Number.isNaN(parseFloat(csv[0][NColumn]))) {
        const columnName = this.columnTitles[NColumn]
        this.columnStringValueExpansionList[columnName] = []
        for (let NRow = 0; NRow < csv.length; ++NRow) {
          if (!this.columnStringValueExpansionList[columnName].includes(csv[NRow][NColumn])) {
            this.columnStringValueExpansionList[columnName].push(csv[NRow][NColumn])
          }
        }

        if (this.columnStringValueExpansionList[columnName].length > Math.log2(csv.length) + 1) {
          throw new Error('Too many unique values in non numeric column.')
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
            throw new Error('Non numeric value for target column.')
          }
          featureColumns[NRow].push(value)
        }
      }
    }

    this.featureColumns = featureColumns
    this.targetColumn = targetColumn
  }

  abstract trainModel (): void

  train (): void {
    this.trainModel()
  }
}
