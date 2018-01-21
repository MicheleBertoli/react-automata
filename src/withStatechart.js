import React from 'react'
import PropTypes from 'prop-types'
import { State, Machine } from 'xstate'
import { getComponentName, isStateless, stringify } from './utils'

const withStatechart = (statechart, options = {}) => Component => {
  class StateMachine extends React.Component {
    machine = Machine(statechart)

    constructor(props) {
      super(props)

      const { initialData } = props

      const initialMachineState = this.props.initialMachineState
        ? State.from(this.props.initialMachineState)
        : this.machine.initialState

      this.state = {
        actions: initialMachineState.actions,
        componentState: initialData,
        machineState: initialMachineState,
      }

      this.handleRef = isStateless(Component) ? null : this.handleRef
    }

    getChildContext() {
      return {
        actions: this.state.actions,
        machineState:
          this.state.machineState.toString() ||
          stringify(this.state.machineState.value),
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

      this.runActionMethods()
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

    runActionMethods() {
      if (this.instance) {
        this.state.actions.forEach(action => {
          if (this.instance[action]) {
            this.instance[action]()
          }
        })
      }
    }

    handleComponentDidUpdate(prevProps, prevState) {
      if (prevState.actions !== this.state.actions) {
        this.runActionMethods()
      }

      if (prevState.machineState !== this.state.machineState) {
        if (this.instance && this.instance.componentDidTransition) {
          this.instance.componentDidTransition(
            prevState.machineState.value,
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
          prevState.machineState.value,
          event,
          stateChange
        )

        return {
          actions: nextState.actions,
          componentState: { ...prevState.componentState, ...stateChange },
          event,
          machineState: nextState,
        }
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          machineState={this.state.machineState.value}
          ref={this.handleRef}
          transition={this.handleTransition}
        />
      )
    }
  }

  StateMachine.propTypes = {
    initialMachineState: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    initialData: PropTypes.any,
  }

  StateMachine.childContextTypes = {
    actions: PropTypes.arrayOf(PropTypes.string),
    machineState: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  }

  return StateMachine
}

export default withStatechart
