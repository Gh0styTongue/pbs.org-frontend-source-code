import { useEffect, useRef } from 'react'
import isFunction from '@/lib/helpers/isFunction'
import { type GenericFunction, type Noop } from '@/lib/types/utility'
import createHandlerSetter from '@/lib/hooks/shared/createHandlerSetter'

/**
 * Returns a callback setter for a function to be performed when the component did mount.
 */
const useDidMount = <TCallback extends GenericFunction = Noop>(callback?: TCallback) => {
  const mountRef = useRef(false)
  const [handler, setHandler] = createHandlerSetter<undefined>(callback)

  useEffect(() => {
    if (isFunction(handler?.current) && !mountRef.current) {
      handler.current()
      mountRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return setHandler
}

export default useDidMount
