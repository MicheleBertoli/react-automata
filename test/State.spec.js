import { shouldShow } from '../src/State'

test('shouldShow', () => {
  expect(shouldShow({ value: 'a' }, { machineState: 'a' })).toBe(true)
  expect(shouldShow({ value: ['a', 'b'] }, { machineState: 'a' })).toBe(true)
  expect(shouldShow({ value: '*.b' }, { machineState: 'a.b' })).toBe(true)
  expect(shouldShow({ value: ['a', '*.b'] }, { machineState: 'a.b' })).toBe(
    true
  )
  expect(shouldShow({ value: 'a' }, { machineState: ['a', 'b'] })).toBe(true)
  expect(shouldShow({ value: 'a' }, { machineState: 'b' })).toBe(false)
})
