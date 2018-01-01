import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'
import { getComponentName, isStateless } from './utils'

const withStateMachine = (config, options = {}) => Component => {
  class StateMachine extends React.Component {
    machine = Machine(config)

    state = {
      componentState: options.initialData,
      event: null,
      machineState: this.machine.initialState,
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
        this.state.event
      ) {
        if (this.instance && this.instance.componentDidTransition) {
          this.instance.componentDidTransition(
            prevState.machineState,
            this.state.event
          )
        }

        if (this.devTools) {
          this.devTools.send(this.state.event, {
            componentState: this.state.componentState,
            machineState: this.state.machineState,
          })
        }
      }
    }

    handleRef = element => {
      this.instance = element
    }

    handleTransition = (event, updater) => {
      if (this.instance && this.instance.componentWillTransition) {
        this.instance.componentWillTransition(event)
      }

      this.setState(prevState => {
        const stateChange =
          typeof updater === 'function'
            ? updater(prevState.componentState)
            : updater

        return {
          componentState: { ...prevState.componentState, ...stateChange },
          event,
          machineState: this.machine
            .transition(prevState.machineState, event)
            .toString(),
        }
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          machineState={this.state.machineState}
          ref={isStateless(Component) ? null : this.handleRef}
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
