// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage

const isStorageAvailable = (type: 'localStorage' | 'sessionStorage') => {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error) {
    return (
      error instanceof DOMException &&
      error.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

const canAccessStorage = (type: 'localStorage' | 'sessionStorage') =>{
  return (typeof window !== "undefined" && isStorageAvailable(type))
}

export { isStorageAvailable, canAccessStorage }
