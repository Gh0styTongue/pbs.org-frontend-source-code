import { useLayoutEffect, useRef } from 'react'
import isFunction from '@/lib/helpers/isFunction'
import { type GenericFunction } from '@/lib/types/utility'
import createHandlerSetter from '@/lib/hooks/shared/createHandlerSetter'

/**
 * Returns a callback setter for a callback to be performed when the component will unmount.
 */
const useWillUnmount = <TCallback extends GenericFunction>(callback?: TCallback) => {
  const mountRef = useRef(false)
  const [handler, setHandler] = createHandlerSetter<undefined>(callback)

  useLayoutEffect(() => {
    mountRef.current = true

    return () => {
      if (isFunction(handler?.current) && mountRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        handler.current()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return setHandler
}

export default useWillUnmount
