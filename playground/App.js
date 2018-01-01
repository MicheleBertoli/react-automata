import React from 'react'
import { State, withStateMachine } from '../src'

export const machine = {
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
    error: {
      on: {
        FETCH: 'fetching',
      },
    },
  },
}

export class App extends React.Component {
  componentWillTransition(event) {
    if (event === 'FETCH') {
      fetch('https://api.github.com/users/gaearon/gists')
        .then(response => response.json())
        .then(gists => this.props.transition('SUCCESS', { gists }))
        .catch(() => this.props.transition('ERROR'))
    }
  }

  handleClick = () => {
    this.props.transition('FETCH')
  }

  render() {
    return (
      <div>
        <h1>State Machine</h1>
        <State value={['idle', 'error']}>
          <button onClick={this.handleClick}>
            {this.props.machineState === 'idle' ? 'Fetch' : 'Retry'}
          </button>
        </State>
        <State value="fetching">Loading...</State>
        <State value="success">
          <ul>
            {this.props.gists
              .filter(gist => gist.description)
              .map(gist => <li key={gist.id}>{gist.description}</li>)}
          </ul>
        </State>
        <State value="error">Oh, snap!</State>
      </div>
    )
  }
}

const options = {
  devTools: true,
  initialData: { gists: [] },
}

export default withStateMachine(machine, options)(App)
