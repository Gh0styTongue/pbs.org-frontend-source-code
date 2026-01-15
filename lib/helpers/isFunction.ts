// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SomeFunction = (...args: any[]) => any

const isFunction = (functionToCheck: unknown): functionToCheck is SomeFunction => (
  typeof functionToCheck === 'function' &&
  !!functionToCheck.constructor &&
  !!functionToCheck.call &&
  !!functionToCheck.apply
)

export default isFunction
