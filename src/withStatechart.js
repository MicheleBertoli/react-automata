import React from 'react'
import PropTypes from 'prop-types'
import { Machine, State, StateNode } from 'xstate'
import idx from 'idx'
import invariant from 'invariant'
import memoizeOne from 'memoize-one'
import { getComponentName, isStateless, stringify } from './utils'

const memoizedStringify = memoizeOne(stringify)

const withStatechart = (statechart, options = {}) => Component => {
  class StateMachine extends React.PureComponent {
    machine = statechart instanceof StateNode ? statechart : Machine(statechart)

    state = {
      componentState: this.props.initialData,
      machineState: this.props.initialMachineState || this.machine.initialState,
    }

    instance = React.createRef()

    ref = !isStateless(Component) ? this.instance : null

    getChildContext() {
      const channel = options.channel || 'DEFAULT'

      return {
        automata: {
          ...this.context.automata,
          [channel]: {
            actions: this.state.machineState.actions,
            machineState:
              this.state.machineState.toString() ||
              memoizedStringify(this.state.machineState.value),
          },
        },
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

      this.runActions()
    }

    componentDidUpdate(prevProps, prevState) {
      if (!this.jumpToAction) {
        this.handleComponentDidUpdate(prevProps, prevState)
      } else {
        this.jumpToAction = false
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

    runAction = effect => {
      switch (typeof effect) {
        case 'string':
          if (this.instance.current[effect]) {
            this.instance.current[effect](
              this.state.componentState,
              this.lastEvent
            )
          }
          break
        case 'object':
          if (effect.type === 'xstate.start' || effect.type === 'xstate.stop') {
            if (this.instance.current[effect.activity]) {
              this.instance.current[effect.activity](
                effect.type === 'xstate.start'
              )
            }
          } else if (this.instance.current[effect.type]) {
            this.instance.current[effect.type](
              this.state.componentState,
              this.lastEvent
            )
          }
          break
        case 'function':
          effect(this.state.componentState, this.lastEvent)
          break
      }
    }

    runActions() {
      if (idx(this, _ => _.instance.current)) {
        this.state.machineState.actions.forEach(this.runAction)
      }
    }

    handleComponentDidUpdate(prevProps, prevState) {
      if (prevState.machineState.actions !== this.state.machineState.actions) {
        this.runActions()
      }

      if (prevState.machineState !== this.state.machineState) {
        if (idx(this, _ => _.instance.current.componentDidTransition)) {
          this.instance.current.componentDidTransition(
            prevState.machineState,
            this.lastEvent
          )
        }

        if (this.devTools) {
          this.devTools.send(this.lastEvent, this.state)
        }
      }

      this.isTransitioning = false
    }

    handleTransition = (event, updater) => {
      invariant(
        !this.isTransitioning,
        'Cannot transition on "%s" in the middle of a transition on "%s".',
        event,
        this.lastEvent
      )

      this.lastEvent = event
      this.isTransitioning = true

      if (idx(this, _ => _.instance.current.componentWillTransition)) {
        this.instance.current.componentWillTransition(event)
      }

      this.setState(prevState => {
        const stateChange =
          typeof updater === 'function'
            ? updater(prevState.componentState)
            : updater
        const machineState = this.machine.transition(
          prevState.machineState,
          event,
          stateChange
        )

        if (
          machineState === prevState.machineState &&
          (!stateChange || stateChange === prevState.componentState)
        ) {
          this.isTransitioning = false

          return null
        }

        return {
          componentState: { ...prevState.componentState, ...stateChange },
          machineState,
        }
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          machineState={this.state.machineState}
          ref={this.ref}
          transition={this.handleTransition}
        />
      )
    }
  }

  StateMachine.childContextTypes = {
    automata: PropTypes.object,
  }

  StateMachine.contextTypes = {
    automata: PropTypes.object,
  }

  StateMachine.propTypes = {
    initialData: PropTypes.object,
    initialMachineState: PropTypes.instanceOf(State),
  }

  StateMachine.isStateMachine = true

  return StateMachine
}

export default withStatechart
