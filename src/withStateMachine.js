import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'

const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

const withStateMachine = (config, options = {}) => Component => {
  class StateMachine extends React.Component {
    machine = Machine(config)

    state = {
      action: null,
      componentState: null,
      machineState: this.machine.getInitialState(),
    }

    getChildContext() {
      return { machineState: this.state.machineState }
    }

    componentDidMount() {
      if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
          name: getComponentName(Component),
        })
        this.devTools.init({ machineState: this.state.machineState })

        this.unsubscribe = this.devTools.subscribe(message => {
          if (
            message.type === 'DISPATCH' &&
            message.payload.type === 'JUMP_TO_ACTION'
          ) {
            this.setState(JSON.parse(message.state))
          }
        })
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        window.__REDUX_DEVTOOLS_EXTENSION__.disconnect()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (
        prevState.machineState !== this.state.machineState &&
        this.state.action
      ) {
        if (this.instance.componentDidTransition) {
          this.instance.componentDidTransition(
            prevState.machineState,
            this.state.action,
            this.state.payload
          )
        }

        if (this.devTools) {
          this.devTools.send(this.state.action, {
            componentState: this.state.componentState,
            machineState: this.state.machineState,
          })
        }
      }
    }

    handleRef = element => {
      this.instance = element
    }

    handleTransition = (action, payload) => {
      if (this.instance.componentWillTransition) {
        this.instance.componentWillTransition(action, payload)
      }

      this.setState(prevState => ({
        action,
        componentState: { ...this.state.componentState, ...payload },
        machineState: this.machine
          .transition(prevState.machineState, action)
          .toString(),
        payload,
      }))
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          machineState={this.state.machineState}
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
