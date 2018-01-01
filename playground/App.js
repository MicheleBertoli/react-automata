import React from 'react'
import { Section, withStateChart } from '../src'

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
      onExit: 'onExitFetching',
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
        <h1>State Machine</h1>
        <Section initial hide="onEnterFetching">
          <button onClick={this.handleClick}>Fetch</button>
        </Section>
        <Section show="onEnterFetching" hide="onExitFetching">
          Loading...
        </Section>
        <Section show="onEnterSuccess">
          <ul>
            {this.props.gists
              .filter(gist => gist.description)
              .map(gist => <li key={gist.id}>{gist.description}</li>)}
          </ul>
        </Section>
        <Section show="onEnterError" hide="onEnterFetching">
          <button onClick={this.handleClick}>Retry</button>
          Oh, snap!
        </Section>
      </div>
    )
  }
}

const options = {
  devTools: true,
  initialData: { gists: [] },
}

export default withStateChart(statechart, options)(App)
