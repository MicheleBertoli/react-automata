import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'
import { getComponentName, isStateless } from './utils'

const withStatechart = (statechart, options = {}) => Component => {
  class StateMachine extends React.Component {
    machine = Machine(statechart)

    state = {
      actions: null,
      componentState: options.initialData,
      machineState: this.machine.initialState,
    }

    constructor(props) {
      super(props)

      this.handleRef = isStateless(Component) ? null : this.handleRef
    }

    getChildContext() {
      return {
        actions: this.state.actions,
        machineState: this.state.machineState,
      }
    }

    componentDidMount() {
      if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
          name: getComponentName(Component),
        })
        this.devTools.init(this.state)

        this.unsubscribe = this.devTools.subscribe(message => {
          if (
            message.type === 'DISPATCH' &&
            message.payload.type === 'JUMP_TO_ACTION'
          ) {
            this.jumpToAction = true
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
      if (!this.jumpToAction) {
        this.handleComponentDidUpdate(prevProps, prevState)
      } else {
        this.jumpToAction = false
      }
    }

    handleComponentDidUpdate(prevProps, prevState) {
      if (prevState.actions !== this.state.actions && this.instance) {
        this.state.actions.forEach(action => {
          if (this.instance[action]) {
            this.instance[action]()
          }
        })
      }

      if (prevState.machineState !== this.state.machineState) {
        if (this.instance && this.instance.componentDidTransition) {
          this.instance.componentDidTransition(
            prevState.machineState,
            this.state.event
          )
        }

        if (this.devTools) {
          this.devTools.send(this.state.event, this.state)
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
        const nextState = this.machine.transition(
          prevState.machineState,
          event,
          stateChange
        )

        return {
          actions: nextState.effects.exit.concat(nextState.effects.entry),
          componentState: { ...prevState.componentState, ...stateChange },
          event,
          machineState: nextState.toString(),
        }
      })
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
    actions: PropTypes.arrayOf(PropTypes.string),
    machineState: PropTypes.string,
  }

  return StateMachine
}

export default withStatechart
