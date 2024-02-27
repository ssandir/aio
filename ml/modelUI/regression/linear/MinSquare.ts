import { ModelUIMama } from '../../ModelUIMama'
import { Matrix } from 'ml-matrix'

export class RegressionLinearMinSquare extends ModelUIMama {
  constructor (
    columnsHaveTitles: boolean,
    columnTitles: string[],
    columnStringValueExpansionList: Record<string, string[]>,
    private readonly modelData: Matrix // tbd private
  ) {
    super(columnsHaveTitles, columnTitles, columnStringValueExpansionList)
  }

  protected innerInfere (featureColumns: number[][]): number[] {
    const featureColumnsWithConstant = featureColumns.map(row => [...row, 1])
    const A = new Matrix(featureColumnsWithConstant)
    return A.mmul(this.modelData).to1DArray()
  }
}
