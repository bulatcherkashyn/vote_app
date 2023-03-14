import { EnvironmentMode } from '../../../src/iviche/common/EnvironmentMode'

describe('EnvironmentMode', () => {
  test('isProduction', () => {
    process.env.NODE_ENV = 'production'
    expect(EnvironmentMode.isProduction()).toBe(true)
  })

  test('getSimpleName TEST', () => {
    process.env.NODE_ENV = 'test'
    expect(EnvironmentMode.getSimpleName()).toEqual('test')
  })

  test('getSimpleName PRODUCTION', () => {
    process.env.NODE_ENV = 'production'
    expect(EnvironmentMode.getSimpleName()).toEqual('production')
  })

  test('getSimpleName ANOTHER_MODE', () => {
    process.env.NODE_ENV = 'dev'
    expect(EnvironmentMode.getSimpleName()).toEqual('development')
  })
})
