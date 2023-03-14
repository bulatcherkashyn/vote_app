import { Storage } from '../../Storage'
import { ImageEntity } from '../model/Image'

export interface ImageStorage extends Storage {
  saveFromUrl(url: string, entity: ImageEntity, ownerUID?: string): Promise<string>

  updateFromUrl(uid: string, url: string, entity?: ImageEntity, ownerUID?: string): Promise<void>

  delete(uid: string): Promise<void>
}
