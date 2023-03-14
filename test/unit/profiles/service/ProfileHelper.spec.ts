import 'reflect-metadata'

import { ProfileDTOHelper } from '../../../../src/iviche/profiles/dto/ProfileDTOHelper'
import { ProfileListDTO } from '../../../../src/iviche/profiles/dto/ProfileListDTO'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { listDtoProfiles, listProfiles, profileDTO, singleProfile } from './ProfileTestHelper'

describe('User-profile helper', () => {
  test('Construct Simple DTO to Profile', async () => {
    // GIVEN dto profile
    // WHEN construct dto to Profile
    const profile: Profile = ProfileDTOHelper.constructSimpleDTOToProfile(profileDTO)

    // THEN immutable object profile
    expect(profile).toStrictEqual(singleProfile)
  })

  test('Construct list DTO to Profile', async () => {
    // GIVEN list dto profiles
    // WHEN construct list dto to list Profile
    const list: Array<ProfileListDTO> = ProfileDTOHelper.multipliesProfiles(listDtoProfiles)

    // THEN immutable object profile m.0
    expect(list).toStrictEqual(listProfiles)
  })
})
