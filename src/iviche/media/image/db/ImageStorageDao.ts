import { Image } from '../model/Image'

export interface ImageStorageDao {
  save(image: Image): Promise<void>

  get(uid: string, ownerUID?: string): Promise<Image>

  delete(uid: string): Promise<void>

  update(image: Image): Promise<void>
}
