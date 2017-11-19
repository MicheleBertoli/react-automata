import React from 'react'
import ReactDOM from 'react-dom'
import { withStateMachine } from '../src'
import App, { machine } from './App'

const SuperApp = withStateMachine(machine)(App)

ReactDOM.render(<SuperApp />, document.body)
