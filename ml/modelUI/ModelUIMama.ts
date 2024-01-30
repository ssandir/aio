import { CsvData } from '@shared/types'
import { extractColumnTitles } from '@ml-shared/csvDataNormalizaton'

export abstract class ModelUIMama {
  constructor (
    protected columnsHaveTitles: boolean,
    protected columnTitles: string[],
    protected columnStringValueExpansionList: Record<string, string[]>
  ) {

  }

  protected normalizeData (csvData: CsvData): number[][] {
    if (csvData.csv[0].length !== this.columnTitles.length) {
      throw new Error("Number of columns doesn't match training data.")
    }

    let { columnTitles, csv } = extractColumnTitles(csvData.csv, this.columnsHaveTitles)

    if (this.columnsHaveTitles) {
      // titleIndex[x]=y means that column y from inference data must be shuffled to column x to match training data
      const titleIndexes: number[] = []
      this.columnTitles.forEach(title => {
        const titleIndex = columnTitles.indexOf(title)

        if (titleIndex < 0) {
          throw new Error(`Missing column with title "${title}".`)
        }

        titleIndexes.push(titleIndex)
      })

      csv = csv.map(row => titleIndexes.map(titleIndex => row[titleIndex]))
    }

    // feature columns
    const featureColumns: number[][] = csv.map(_ => [])
    for (let NColumn = 0; NColumn < csv[0].length; ++NColumn) {
      if (Number.isNaN(parseFloat(csv[0][NColumn]))) {
        const columnName = this.columnTitles[NColumn]

        for (let NRow = 0; NRow < csv.length; ++NRow) {
          if (!this.columnStringValueExpansionList[columnName].includes(csv[NRow][NColumn])) {
            throw new Error(`Non-numeric column "${columnName}" contains value "${csv[NRow][NColumn]}" not found in training data.`)
          }

          this.columnStringValueExpansionList[columnName].forEach(columnStringValue => {
            featureColumns[NRow].push(columnStringValue === csv[NRow][NColumn] ? 1 : 0)
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

    return featureColumns
  }

  infere (_: CsvData): void {
    // const normalizedData = this.normalizeData(csvData)

  }
}
