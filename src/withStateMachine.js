import React from 'react'
import PropTypes from 'prop-types'
import { Machine } from 'xstate'
import { getComponentName, isStateless } from './utils'

const withStateChart = (statechart, options = {}) => Component => {
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
      return { actions: this.state.actions }
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
        if (this.instance && prevState.actions !== this.state.actions) {
          this.state.actions.forEach(action => {
            if (this.instance[action]) {
              this.instance[action]()
            }
          })
        }

        if (
          this.devTools &&
          prevState.machineState !== this.state.machineState
        ) {
          this.devTools.send(this.state.event, this.state)
        }
      } else {
        this.jumpToAction = false
      }
    }

    handleRef = element => {
      this.instance = element
    }

    handleTransition = (event, updater) => {
      this.setState(prevState => {
        const stateChange =
          typeof updater === 'function'
            ? updater(prevState.componentState)
            : updater
        const { value, effects } = this.machine.transition(
          prevState.machineState,
          event,
          stateChange
        )

        return {
          actions: effects.entry.concat(effects.exit),
          componentState: { ...prevState.componentState, ...stateChange },
          event,
          machineState: value,
        }
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          ref={this.handleRef}
          transition={this.handleTransition}
        />
      )
    }
  }

  StateMachine.childContextTypes = {
    actions: PropTypes.arrayOf(PropTypes.string),
  }

  return StateMachine
}

export default withStateChart
