import React from 'react'
import { State, testStateMachine } from '../src'

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

class App extends React.Component {
  state = { gists: [] }

  handleClick = () => {
    this.props.transition('FETCH')

    fetch('https://api.github.com/users/gaearon/gists')
      .then(response => response.json())
      .then(gists => {
        this.setState({ gists })
        this.props.transition('SUCCESS')
      })
      .catch(() => this.props.transition('ERROR'))
  }

  render() {
    return (
      <div>
        <h1>State Machine</h1>
        <State name="idle">
          <button onClick={this.handleClick}>Fetch</button>
        </State>
        <State name="fetching">Loading...</State>
        <State name="success">
          <ul>
            {this.state.gists.map(gist => (
              <li key={gist.id}>{gist.description}</li>
            ))}
          </ul>
        </State>
        <State name="error">Oh, snap!</State>
      </div>
    )
  }
}

test('it works', () => {
  testStateMachine({ machine, fixtures }, App)
})
