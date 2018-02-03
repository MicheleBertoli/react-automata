import React from 'react'
import { CHANNEL, getContextValue, isStateless, stringify } from '../src/utils'

describe('getContextValue', () => {
  const defaultChannel = { [CHANNEL]: 'foo' }
  const customChannel = { key: 'bar' }

  test('single channel', () => {
    const value = getContextValue({}, { automata: { ...defaultChannel } })

    expect(value).toBe('foo')
  })

  test('single key', () => {
    const value = getContextValue({}, { automata: { ...customChannel } })

    expect(value).toBe('bar')
  })

  test('default value', () => {
    const value = getContextValue(
      {},
      { automata: { ...defaultChannel, ...customChannel } }
    )

    expect(value).toBe('foo')
  })

  test('channel prop', () => {
    const value = getContextValue(
      { channel: 'key' },
      { automata: { ...defaultChannel, ...customChannel } }
    )
    expect(value).toBe('bar')
  })
})

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
