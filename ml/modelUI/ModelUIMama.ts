import { CsvData } from '@shared/types'
import { extractColumnTitles, normalizeCsvToFeatureColumns } from '../shared/csvDataNormalizaton'

export abstract class ModelUIMama {
  constructor (
    protected columnsHaveTitles: boolean,
    protected columnTitles: string[],
    protected columnStringValueExpansionList: Record<string, string[]>
  ) {}

  protected normalizeData (csvData: CsvData): number[][] {
    if (csvData.csv[0].length !== this.columnTitles.length) {
      throw new Error("Number of columns doesn't match training data.")
    }

    let { columnTitles, csv } = extractColumnTitles(csvData.csv, this.columnsHaveTitles)

    if (this.columnsHaveTitles) {
      // shuffle columns to same order, titleIndex[x]=y means that column y from inference data must be shuffled to column x to match training data
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
    return normalizeCsvToFeatureColumns(csv, this.columnTitles, this.columnStringValueExpansionList)
  }

  protected abstract innerInfere(featureColumns: number[][]): number[]

  infere (csvData: CsvData): number[] {
    const featureColumns = this.normalizeData(csvData)
    return this.innerInfere(featureColumns)
  }
}
