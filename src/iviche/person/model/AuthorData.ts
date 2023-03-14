export interface AuthorData {
  readonly uid?: string
  readonly isLegalPerson?: boolean
  readonly firstName?: string
  readonly lastName?: string
  readonly shortName?: string | null
  readonly avatar?: string | null
  readonly email?: string | null
}

// NOTE: For fields which come from db
export interface AuthorDataQueryTuple {
  readonly authorIsLegalPerson?: boolean
  readonly authorFirstName?: string
  readonly authorLastName?: string
  readonly authorShortName?: string | null
  readonly authorAvatar?: string | null
  readonly authorBio?: string | null
  readonly authorEmail?: string | null
}

// FIXME remove this type and replace to ObjectWithAuthorDataObject!!!
export type ObjectWithAuthorFields<T> = AuthorData & T

export type ObjectWithAuthorDataObject<T> = { authorData?: AuthorData } & T
