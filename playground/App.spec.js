import { testStateMachine } from '../src'
import { App, statechart } from './App1'

global.fetch = jest.fn(() => new Promise(resolve => resolve()))

const fixtures = {
  initialData: {
    gists: [],
  },
  fetching: {
    SUCCESS: {
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
  },
}

test('it works', () => {
  testStateMachine({ statechart, fixtures }, App)
})
