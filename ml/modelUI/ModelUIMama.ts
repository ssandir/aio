import { CsvData } from '@shared/types'
import { extractColumnTitles, normalizeCsvToFeatureColumns, orderColumns } from '../shared/csvDataNormalizaton'

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

    let orderedRawCsv = csvData.csv
    if (this.columnsHaveTitles) {
      orderedRawCsv = orderColumns(this.columnTitles, orderedRawCsv)
    }

    const { csv } = extractColumnTitles(orderedRawCsv, this.columnsHaveTitles)

    // feature columns
    return normalizeCsvToFeatureColumns(csv, this.columnTitles, this.columnStringValueExpansionList)
  }

  protected abstract innerInfere (featureColumns: number[][]): number[]

  infere (csvData: CsvData): number[] {
    const featureColumns = this.normalizeData(csvData)
    return this.innerInfere(featureColumns)
  }
}
