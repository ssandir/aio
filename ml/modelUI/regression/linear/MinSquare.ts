import { ModelUIMama } from '../../ModelUIMama'

export class RegressionLinearMinSquare extends ModelUIMama {
  constructor (
    columnsHaveTitles: boolean,
    columnTitles: string[],
    columnStringValueExpansionList: Record<string, string[]>,
    private readonly modelData: number[]
  ) {
    super(columnsHaveTitles, columnTitles, columnStringValueExpansionList)
  }
}
