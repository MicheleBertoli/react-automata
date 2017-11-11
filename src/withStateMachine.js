import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'

const withStateMachine = config => Component => {
  class StateMachine extends React.Component {
    machine = Machine(config)

    state = {
      action: null,
      machineState: this.machine.getInitialState(),
    }

    getChildContext() {
      return { machineState: this.state.machineState }
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        this.instance.componentDidTransition &&
        prevState.machineState !== this.state.machineState &&
        this.state.action
      ) {
        this.instance.componentDidTransition(
          prevState.machineState,
          this.state.action
        )
      }
    }

    handleRef = element => {
      this.instance = element
    }

    handleTransition = action => {
      if (this.instance.componentWillTransition) {
        this.instance.componentWillTransition(action)
      }

      this.setState(prevState => ({
        action,
        machineState: this.machine.transition(prevState.machineState, action)
          .value,
      }))
    }

    render() {
      return (
        <Component
          {...this.props}
          ref={this.handleRef}
          transition={this.handleTransition}
        />
      )
    }
  }

  StateMachine.childContextTypes = {
    machineState: PropTypes.string,
  }

  return StateMachine
}

export default withStateMachine
