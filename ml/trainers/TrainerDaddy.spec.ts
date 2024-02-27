import { ModelUIMama } from '../modelUI/ModelUIMama'
import { TrainerDaddy } from './TrainerDaddy'
import { BuilderData } from '@shared/types'

jest.mock('../modelUI/ModelUIMama')

class TestModelUIMama extends ModelUIMama {}

class TestTrainerDaddy extends TrainerDaddy {
  trainModel (): ModelUIMama {
    return new TestModelUIMama(false, [], {})
  }
}

describe('TrainerDaddy', () => {
  describe('Normalizes data with training data', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
    })

    const data: BuilderData = {
      model: { type: 'Regression' },
      trainingData: {
        type: 'Google Spreadsheet',
        columnsHaveTitles: false,
        url: 'fake url',
        sheetName: 'fake sheet name',
        csv: [
          ['1.1', 'test', '123.123', '1'],
          ['1.2', 'test', '121.123', '100'],
          ['1.33', '2test', '122.123', '1.1'],
          ['1.5555', 'test', '124.123', '2']
        ]
      },
      modelValidationData: { type: 'Training data', rowNumber: 1 },
      targetColumn: { name: '2' }
    }

    it('Without column names', () => {
      const trainerDaddy = new TestTrainerDaddy(JSON.parse(JSON.stringify(data)))
      expect(trainerDaddy.columnsHaveTitles).toBe(false)
      expect(trainerDaddy.columnTitles).toEqual(['0', '1', '3'])
      expect(trainerDaddy.targetColumn).toEqual([121.123, 122.123, 124.123])
      expect(trainerDaddy.validationDataCsv).toEqual([['1.1', 'test', '1']])
      expect(trainerDaddy.validationTargetColumn).toEqual([123.123])
      expect(trainerDaddy.columnStringValueExpansionList).toEqual({ 1: ['test', '2test'] })
      expect(trainerDaddy.featureColumns).toEqual([
        [1.2, 1, 0, 100],
        [1.33, 0, 1, 1.1],
        [1.5555, 1, 0, 2]
      ])
    })

    const dataWithColumnNames: BuilderData = {
      ...data,
      trainingData: {
        type: 'Google Spreadsheet',
        columnsHaveTitles: true,
        url: 'fake url',
        sheetName: 'fake sheet name',
        csv: [
          ['name0', 'name1', 'name2', 'name3'],
          ['1.1', 'test', '123.123', '1'],
          ['1.2', 'test', '121.123', '100'],
          ['1.33', '2test', '122.123', '1.1'],
          ['1.5555', 'test', '124.123', '2']
        ]
      },
      targetColumn: { name: 'name3' },
      modelValidationData: { type: 'Training data', rowNumber: 1 }
    }

    it('With column names', () => {
      const trainerDaddy = new TestTrainerDaddy(JSON.parse(JSON.stringify(dataWithColumnNames)))
      expect(trainerDaddy.columnsHaveTitles).toBe(true)
      expect(trainerDaddy.columnTitles).toEqual(['name0', 'name1', 'name2'])
      expect(trainerDaddy.targetColumn).toEqual([100, 1.1, 2])
      expect(trainerDaddy.validationDataCsv).toEqual([
        ['name0', 'name1', 'name2'],
        ['1.1', 'test', '123.123']
      ])
      expect(trainerDaddy.validationTargetColumn).toEqual([1])
      expect(trainerDaddy.columnStringValueExpansionList).toEqual({ name1: ['test', '2test'] })
      expect(trainerDaddy.featureColumns).toEqual([
        [1.2, 1, 0, 121.123],
        [1.33, 0, 1, 122.123],
        [1.5555, 1, 0, 124.123]
      ])
    })

    it('With validation data csv without column names', () => {
      const dataWithValidationCsv: BuilderData = {
        ...data,
        modelValidationData: {
          type: 'Google Spreadsheet',
          url: '',
          sheetName: '',
          csv: [
            ['2', '2test', '2.123', '1.1'],
            ['3', 'test', '4.123', '2.1']
          ]
        }
      }

      const trainerDaddy = new TestTrainerDaddy(dataWithValidationCsv)
      expect(trainerDaddy.columnsHaveTitles).toBe(false)
      expect(trainerDaddy.columnTitles).toEqual(['0', '1', '3'])
      expect(trainerDaddy.targetColumn).toEqual([123.123, 121.123, 122.123, 124.123])
      expect(trainerDaddy.validationDataCsv).toEqual([
        ['2', '2test', '1.1'],
        ['3', 'test', '2.1']
      ])
      expect(trainerDaddy.validationTargetColumn).toEqual([2.123, 4.123])
      expect(trainerDaddy.columnStringValueExpansionList).toEqual({ 1: ['test', '2test'] })
      expect(trainerDaddy.featureColumns).toEqual([
        [1.1, 1, 0, 1],
        [1.2, 1, 0, 100],
        [1.33, 0, 1, 1.1],
        [1.5555, 1, 0, 2]
      ])
    })

    it('With validation data csv with column names', () => {
      const dataWithValidationCsv: BuilderData = {
        ...dataWithColumnNames,
        modelValidationData: {
          type: 'Google Spreadsheet',
          url: '',
          sheetName: '',
          csv: [
            ['name0', 'name1', 'name2', 'name3'],
            ['2', '2test', '2.123', '1.1'],
            ['3', 'test', '4.123', '2.1']
          ]
        }
      }

      const trainerDaddy = new TestTrainerDaddy(dataWithValidationCsv)
      expect(trainerDaddy.columnsHaveTitles).toBe(true)
      expect(trainerDaddy.columnTitles).toEqual(['name0', 'name1', 'name2'])
      expect(trainerDaddy.targetColumn).toEqual([1, 100, 1.1, 2])
      expect(trainerDaddy.validationDataCsv).toEqual([
        ['name0', 'name1', 'name2'],
        ['2', '2test', '2.123'],
        ['3', 'test', '4.123']
      ])
      expect(trainerDaddy.validationTargetColumn).toEqual([1.1, 2.1])
      expect(trainerDaddy.columnStringValueExpansionList).toEqual({ name1: ['test', '2test'] })
      expect(trainerDaddy.featureColumns).toEqual([
        [1.1, 1, 0, 123.123],
        [1.2, 1, 0, 121.123],
        [1.33, 0, 1, 122.123],
        [1.5555, 1, 0, 124.123]
      ])
    })
  })
})
