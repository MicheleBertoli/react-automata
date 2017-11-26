import React from 'react'
import { isStateless, mutuallyExclusive } from '../src/utils'

describe('isStateless', () => {
  test('true', () => {
    const Component = () => <div />
    const result = isStateless(Component)

    expect(result).toBe(true)
  })

  test('false', () => {
    class Component extends React.Component {
      render() {
        return <div />
      }
    }
    const result = isStateless(Component)

    expect(result).toBe(false)
  })
})

describe('mutuallyExclusive', () => {
  test('none', () => {
    const result = mutuallyExclusive('a')({}, 'b')

    expect(result).toMatchSnapshot()
  })

  test('both', () => {
    const result = mutuallyExclusive('a')({ a: 'a', b: 'b' }, 'b')

    expect(result).toMatchSnapshot()
  })

  test('type', () => {
    const spy = jest.fn()
    mutuallyExclusive('a', spy)({ a: 'a' }, 'b')

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
