import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'

const withStateMachine = config => Component => {
  class StateMachine extends React.Component {
    state = {
      machineState: this.machine.getInitialState(),
    }

    getChildContext() {
      return { ...this.state }
    }

    machine = Machine(config)

    handleTransition = action => {
      this.setState(prevState => ({
        machineState: this.machine.transition(prevState.machineState, action)
          .value,
      }))
    }

    render() {
      return <Component {...this.props} transition={this.handleTransition} />
    }
  }

  StateMachine.childContextTypes = {
    machineState: PropTypes.string,
  }

  return StateMachine
}

export default withStateMachine
