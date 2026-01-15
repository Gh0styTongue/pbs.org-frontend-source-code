import { RefObject, useEffect } from 'react';

// custom hook to monitor clicks outside of a component
// then fire the callback function
// largely taken from https://stackoverflow.com/a/42234988
const useOutsideClick = (
  refs: Array<RefObject<HTMLElement | null>>,
  callbackFnc: () => void
  ) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      let isOutside = true;
      // we go through each ref and check if the click falls inside one of them
      // if so, we don't fire the callback
      refs.forEach((ref) => {
        if (ref.current && ref.current.contains(event.target as HTMLElement)) {
          isOutside = false;
        }
      });

      if (isOutside) {
        callbackFnc();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [refs, callbackFnc]);
};

export { useOutsideClick };
