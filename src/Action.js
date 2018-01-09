/* @flow */
import PropTypes from 'prop-types'
import createConditional from './createConditional'

const displayName = 'Action'

const contextTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
}

const propTypes = {
  children: PropTypes.node,
  hide: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  initial: PropTypes.bool,
  show: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

const matches = (
  value: string | Array<string>,
  actions: Array<string>
): boolean =>
  actions &&
  (Array.isArray(value)
    ? actions.some((action: string): boolean => value.includes(action))
    : actions.includes(value))

const initial = (props: { initial?: boolean }): boolean =>
  Boolean(props.initial)

export const shouldShow = (
  props: { show: string },
  context: { actions: Array<string> }
) => matches(props.show, context.actions)

export const shouldHide = (
  props: { hide?: string, show: string },
  context: { actions: Array<string> }
): boolean =>
  props.hide
    ? matches(props.hide, context.actions)
    : !matches(props.show, context.actions)

export default createConditional({
  displayName,
  contextTypes,
  propTypes,
  initial,
  shouldShow,
  shouldHide,
})
