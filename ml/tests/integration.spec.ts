import { BuilderData } from '@shared/types'
import { RegressionLinearMinSquare } from '../trainers/regression/linear/MinSquare'

describe('integration', () => {
  const data: BuilderData = {
    model: { type: 'Regression' },
    trainingData: {
      type: 'Google Spreadsheet',
      columnsHaveTitles: true,
      url: 'fake url',
      sheetName: 'fake sheet name',
      csv: [
        ['1', '2', '3', '4', '5'],
        ['1', '1', '1', 'a', '22.5'],
        ['1', '2', '3', 'a', '53.5'],
        ['1', '3', '4', 'a', '71.5'],
        ['1', '0', '1', 'b', '19.5'],
        ['1', '0', '0', 'b', '6.5'],
        ['0', '0', '1', 'b', '16.5']
      ]
    },
    modelValidationData: {
      type: 'Google Spreadsheet',
      url: '',
      sheetName: '',
      csv: [
        ['4', '5', '1', '2', '3'],
        ['a', '25.5', '2', '1', '1'],
        ['b', '45.5', '2', '2', '2'],
        ['b', '24.5', '1', '1', '1']
      ]
    },
    targetColumn: { name: '5' }
  }

  it('RegressionLinearMinSquare', () => {
    const trainerDaddy = new RegressionLinearMinSquare(JSON.parse(JSON.stringify(data)))
    const model = trainerDaddy.train()
    const [validationData, inferedData] = trainerDaddy.validate(model)
    validationData.forEach((value, i) => {
      expect(value).toBeCloseTo(inferedData[i], 10)
    })
  })
})
