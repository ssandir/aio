import { RegressionLinearMinSquare } from '@ml/trainers/regression/linear/MinSquare'

export const modelTypeToTrainer = {
  Regression: RegressionLinearMinSquare,
  'Neural Network': null
}
