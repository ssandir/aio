import type { Models, ModelData, DeepPartial } from '@shared/types'
import { models } from '../constants'

export function isValidModelType (model: DeepPartial<ModelData> | undefined): model is (DeepPartial<ModelData> & { type: Models }) {
  return !(model == null) && models.includes(model.type as Models)
}
