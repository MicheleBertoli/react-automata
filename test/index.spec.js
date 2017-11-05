import { testStateMachine } from '../src'
import App from './app'

const machine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'fetching',
      },
    },
    fetching: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error',
      },
    },
    success: {},
    error: {},
  },
}

const fixtures = {
  success: {
    gists: [
      {
        id: 'ID1',
        description: 'GIST1',
      },
      {
        id: 'ID2',
        description: 'GIST2',
      },
    ],
  },
}

test('it works', () => {
  testStateMachine({ machine, fixtures }, App)
})
