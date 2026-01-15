import { type RefObject, useEffect } from 'react'
import { type CallbackSetter } from '@/lib/types/utility'

import isClient from '@/lib/hooks/shared/isClient'
import createHandlerSetter from '@/lib/hooks/shared/createHandlerSetter'
import safeHasOwnProperty from '@/lib/hooks/shared/safeHasOwnProperty'
import noop from '@/lib/hooks/shared/noop'

/**
 * Accepts the reference to an HTML Element and an event name then performs the necessary operations to listen to the event
 * when fired from that HTML Element.
 */
const useEvent = <TEvent extends Event, TElement extends HTMLElement = HTMLElement>
  (target: RefObject<TElement>, eventName: string, options?: AddEventListenerOptions) => {
  const [handler, setHandler] = createHandlerSetter<TEvent>()

  if (!!target && !safeHasOwnProperty(target, 'current')) {
    throw new Error('Unable to assign any scroll event to the given ref')
  }

  useEffect(() => {
    const cb: EventListenerOrEventListenerObject = (event) => {
      if (handler.current) {
        handler.current(event as TEvent)
      }
    }

    if (target.current?.addEventListener) {
      target.current.addEventListener(eventName, cb, options)
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      target.current.removeEventListener(eventName, cb, options)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, target.current, options])

  return setHandler
}

/**
 * Accepts an event name then returns a callback setter for a function to be performed when the event triggers.
 */
const useGlobalEvent = <TEvent extends Event>(eventName: keyof WindowEventMap, opts?: AddEventListenerOptions) => {
  if (!isClient) {
    return noop as CallbackSetter<TEvent>
  }

  const target = { current: window } as unknown as RefObject<HTMLElement> // that's a bit of a hack but it works
  return useEvent<TEvent>(target, eventName, opts)
}

export { useGlobalEvent, useEvent }
