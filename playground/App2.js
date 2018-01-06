import React from 'react'
import { Action, withStatechart } from '../src'

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
      onEntry: 'onEnterFetching',
    },
    success: {
      onEntry: 'onEnterSuccess',
    },
    error: {
      on: {
        FETCH: 'fetching',
      },
      onEntry: 'onEnterError',
    },
  },
}

export class App extends React.Component {
  onEnterFetching() {
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
        <Action initial hide="onEnterFetching">
          <button onClick={this.handleClick}>Fetch</button>
        </Action>
        <Action show="onEnterFetching">Loading...</Action>
        <Action show="onEnterSuccess">
          <ul>
            {this.props.gists
              .filter(gist => gist.description)
              .map(gist => <li key={gist.id}>{gist.description}</li>)}
          </ul>
        </Action>
        <Action show="onEnterError">
          <button onClick={this.handleClick}>Retry</button>
          Oh, snap!
        </Action>
      </div>
    )
  }
}

const options = {
  devTools: true,
  initialData: { gists: [] },
}

export default withStatechart(statechart, options)(App)
