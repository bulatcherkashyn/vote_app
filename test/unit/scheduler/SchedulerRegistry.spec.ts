import { SchedulerRegistryImpl } from '../../../src/iviche/scheduler/SchedulerRegistryImpl'
import { TestSchedulerRegistryContext } from './TestSchedulerRegistryImpl'

const testSchedulerRegistryContext = new TestSchedulerRegistryContext()
const schedulerRegistryImpl = new SchedulerRegistryImpl()
describe('Scheduler. SchedulerRegistryImpl', () => {
  test('initialize', () => {
    // GIVEN mocked schedulerRegistryImpl object with mocked context (mocked scheduler list)
    try {
      // WHEN initialize scheduler
      schedulerRegistryImpl.initialize.call(testSchedulerRegistryContext)
    } catch (error) {
      // THEN we catch special error than indicates a successful execution
      expect(error.message).toBe("It's okay. Expected Error for initialize test")
    }
  })

  test('destroy', () => {
    // GIVEN mocked schedulerRegistryImpl object with mocked context (mocked scheduler list)
    try {
      // WHEN destroy scheduler
      schedulerRegistryImpl.destroy.call(testSchedulerRegistryContext)
    } catch (error) {
      // THEN we catch special error than indicates a successful execution
      expect(error.message).toBe("It's okay. Expected Error for destroy test")
    }
  })
})
