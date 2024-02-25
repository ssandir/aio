import { ModelUIMama } from '../../ModelUIMama'
import { Matrix } from 'ml-matrix'

export class RegressionLinearMinSquare extends ModelUIMama {
  constructor (
    columnsHaveTitles: boolean,
    columnTitles: string[],
    columnStringValueExpansionList: Record<string, string[]>,
    public readonly modelData: Matrix // tbd private
  ) {
    super(columnsHaveTitles, columnTitles, columnStringValueExpansionList)
  }
}
