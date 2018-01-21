import { testStatechart } from '../src'
import { App, statechart } from './App'

global.fetch = jest.fn(() => new Promise(resolve => resolve()))

const fixtures = {
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
  testStatechart({ statechart, fixtures }, App)
})
