export interface SecurityVerificationConfiguration {
  [arg: string]: SecurityVerificationBlock
}

export interface SecurityVerificationBlock {
  token: string
  requests: SecurityVerificationRequests
}

export interface SecurityVerificationRequests {
  list: SecurityRequestDescriptor
  post: SecurityRequestDescriptor
  loadOwn: SecurityRequestDescriptorWithParams
  load: SecurityRequestDescriptorWithParams
  putOwn: SecurityRequestDescriptorWithParams
  put: SecurityRequestDescriptorWithParams
  deleteOwn: SecurityRequestDescriptorWithParams
  delete: SecurityRequestDescriptorWithParams
}

export interface SecurityRequestDescriptor {
  expectedStatus: number
}

export interface SecurityRequestDescriptorWithParams extends SecurityRequestDescriptor {
  params: Array<string>
}
