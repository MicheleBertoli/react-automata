import { shouldShow, shouldHide } from '../src/Action'

test('shouldShow', () => {
  expect(shouldShow({ show: 'a' }, { actions: ['a'] })).toBe(true)
  expect(shouldShow({ show: ['a'] }, { actions: ['a', 'b'] })).toBe(true)
  expect(shouldShow({ show: 'a' }, { actions: ['b'] })).toBe(false)
})

test('shouldHide', () => {
  expect(shouldHide({ hide: 'a' }, { actions: ['a'] })).toBe(true)
  expect(shouldHide({ hide: 'a' }, { actions: ['b'] })).toBe(false)
  expect(shouldHide({ show: 'a' }, { actions: ['a'] })).toBe(false)
  expect(shouldHide({ show: 'a' }, { actions: ['b'] })).toBe(true)
})
