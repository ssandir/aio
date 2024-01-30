import { TrainerDaddy } from '../../TrainerDaddy'
import { RegressionLinearMinSquare as RegressionLinearMinSquareModel } from 'modelUI/regression/linear/MinSquare'
import { Matrix, solve } from 'ml-matrix'

export class RegressionLinearMinSquare extends TrainerDaddy {
  trainModel (): RegressionLinearMinSquareModel {
    const featureColumnsWithConstant = this.featureColumns.map(row => [...row, 1])
    const A = new Matrix(featureColumnsWithConstant)
    const b = Matrix.columnVector([...this.targetColumn, 1])
    const y = solve(A, b)
    return new RegressionLinearMinSquareModel(this.columnsHaveTitles, this.columnTitles, this.columnStringValueExpansionList, y)
  }
}
