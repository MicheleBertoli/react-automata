import React from 'react'
import { hot } from 'react-hot-loader'
import { Action, withStatechart } from '../src'

export const statechart = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'fetching',
      },
      onEntry: 'showButton',
    },
    fetching: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error',
      },
      onEntry: 'fetchGists',
    },
    success: {
      onEntry: 'showGists',
    },
    error: {
      on: {
        FETCH: 'fetching',
      },
      onEntry: 'showError',
    },
  },
}

export class App extends React.Component {
  fetchGists() {
    fetch('https://api.github.com/users/gaearon/gists')
      .then(response => response.json())
      .then(gists => this.props.transition('SUCCESS', { gists }))
      .catch(() => this.props.transition('ERROR'))
  }

  handleClick = () => {
    this.props.transition('FETCH')
  }

  render() {
    return (
      <div>
        <h1>Actions</h1>
        <Action show="showButton" hide="fetchGists">
          <button onClick={this.handleClick}>Fetch</button>
        </Action>
        <Action show="fetchGists">Loading...</Action>
        <Action show="showGists">
          <ul>
            {this.props.gists
              .filter(gist => gist.description)
              .map(gist => <li key={gist.id}>{gist.description}</li>)}
          </ul>
        </Action>
        <Action show="showError">
          <button onClick={this.handleClick}>Retry</button>
          Oh, snap!
        </Action>
      </div>
    )
  }
}

App.defaultProps = {
  gists: [],
}

const options = {
  devTools: true,
}

const StateMachine = withStatechart(statechart, options)(App)

export default hot(module)(StateMachine)
