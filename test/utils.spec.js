import React from 'react'
import {
  cacheKey,
  getPatterns,
  isStateless,
  match,
  stringify,
} from '../src/utils'

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

describe('stringify', () => {
  test('true', () => {
    const state = {
      a: {
        b: {
          c: 'd',
          e: 'f',
        },
        g: 'h',
      },
      b: 'c',
    }
    const result = stringify(state)
    const expected = ['a.b.c.d', 'a.b.e.f', 'a.g.h', 'b.c']

    expect(result).toEqual(expected)
  })
})

test('getPatterns', () => {
  const patterns1 = getPatterns('foo')
  const patterns2 = getPatterns(['foo'])

  expect(patterns1).toEqual(expect.arrayContaining(patterns2))
  expect(patterns1).toMatchSnapshot()
})

test('match', () => {
  const patterns = [/^foo$/]

  expect(match(patterns, 'foo')).toBe(true)
  expect(match(patterns, ['foo'])).toBe(true)
  expect(match(patterns, 'bar')).toBe(false)
  expect(match(patterns, ['bar'])).toBe(false)
})

test('cacheKey', () => {
  expect(cacheKey(/^foo$/, 'bar')).toMatchSnapshot()
})
