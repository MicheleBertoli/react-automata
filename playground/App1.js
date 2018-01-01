import React from 'react'
import { State, withStateChart } from '../src'

export const statechart = {
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
        <State value="idle">
          <button onClick={this.handleClick}>Fetch</button>
        </State>
        <State value="fetching">Loading...</State>
        <State value="success">
          <ul>
            {this.props.gists
              .filter(gist => gist.description)
              .map(gist => <li key={gist.id}>{gist.description}</li>)}
          </ul>
        </State>
        <State value="error">
          <button onClick={this.handleClick}>Retry</button>Oh, snap!
        </State>
      </div>
    )
  }
}

const options = {
  devTools: true,
  initialData: { gists: [] },
}

export default withStateChart(statechart, options)(App)
