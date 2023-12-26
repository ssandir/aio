import { Models, ModelData, DeepPartial } from '../types'
import { models } from '../constants'

export function isValidModelType(model: DeepPartial<ModelData> | undefined): model is (DeepPartial<ModelData> & {type: Models}) {
    return !!model && models.includes(model.type as Models);
}