import { Request } from 'express'
import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

import { RequestHeaderInfo } from '../RequestHeaderInfo'

@ApiModel({
  description: 'Direct login request body description.',
  name: 'LoginDirectEndpointRequest',
})
export class LoginDirectEndpointRequest extends RequestHeaderInfo {
  @ApiModelProperty({
    description: 'Username.',
    example: 'john.wick@gmail.com',
    required: true,
  })
  username: string
  @ApiModelProperty({
    description: 'Password.',
    example: '1234!qWer',
    required: true,
  })
  password: string
  firebaseDeviceToken?: string
  deviceID?: string

  constructor(request: Request) {
    super(request)
    const { username, password, firebaseDeviceToken, deviceID } = request.body
    this.username = username
    this.password = password
    this.firebaseDeviceToken = firebaseDeviceToken
    this.deviceID = deviceID
  }
}
@ApiModel({
  description: 'Direct login response description.',
  name: 'LoginDirectEndpointResponse',
})
export class LoginDirectEndpointResponse {
  static successStatusCode = 200
  @ApiModelProperty({
    description: 'Refresh Token',
    example: '070b0a8c-3134-4e25-a451-c29e6c1d41f3',
  })
  refreshToken: string
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken
  }
}
