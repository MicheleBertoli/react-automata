import React from 'react'
import { hot } from 'react-hot-loader'
import { Action, withStateMachine } from '../src'

const statechart = {
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

class App extends React.Component {
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
        <Action is="showButton">
          <button onClick={this.handleClick}>Fetch</button>
        </Action>
        <Action is="fetchGists">Loading...</Action>
        <Action is="showGists">
          <ul>
            {this.props.gists.filter(gist => gist.description).map(gist => (
              <li key={gist.id}>{gist.description}</li>
            ))}
          </ul>
        </Action>
        <Action is="showError">
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

const StateMachine = withStateMachine(statechart, options)(App)

export default hot(module)(StateMachine)
