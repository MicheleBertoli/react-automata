import { testStateMachine } from '../packages/react-automata-test-utilities/src'
import App from './App'

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
  testStateMachine(App, { fixtures })
})
