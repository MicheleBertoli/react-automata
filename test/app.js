import React from 'react'
import { State } from '../src'

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

export default App
