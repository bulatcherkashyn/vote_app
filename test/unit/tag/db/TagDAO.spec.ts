import 'reflect-metadata'

import { TagDAOImpl } from '../../../../src/iviche/tag/db/TagDAOImpl'

describe('TagDAO', () => {
  const createTagsEntities = TagDAOImpl.prototype['createTagsEntities']

  test('createTagsEntities', () => {
    const tagsArray = ['ZaVDV', 'Origato', 'Fast track']

    const tagEntity = createTagsEntities(tagsArray)

    expect(tagEntity.length).toBe(12)
    expect((tagEntity[0] as string).length).toBe(36)
    expect(tagEntity[1]).toEqual('ZaVDV')
    expect(tagEntity[2]).toBeInstanceOf(Date)
    expect(tagEntity[3]).toBeInstanceOf(Date)

    expect((tagEntity[4] as string).length).toBe(36)
    expect(tagEntity[5]).toEqual('Origato')
    expect(tagEntity[6]).toBeInstanceOf(Date)
    expect(tagEntity[7]).toBeInstanceOf(Date)

    expect((tagEntity[8] as string).length).toBe(36)
    expect(tagEntity[9]).toEqual('Fast track')
    expect(tagEntity[10]).toBeInstanceOf(Date)
    expect(tagEntity[11]).toBeInstanceOf(Date)
  })
})
