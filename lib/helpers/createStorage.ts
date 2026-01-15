import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { isStorageAvailable } from '@/lib/helpers/is-storage-available';

type StorageMechanism = 'localStorage' | 'sessionStorage'

function createStorage<Value>(storageMechanism: StorageMechanism): SyncStorage<Value> {
  if(isStorageAvailable(storageMechanism)) {
    return browserStorage(storageMechanism)
  } else {
    return inMemoryStorage()
  }

  function inMemoryStorage() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storage: {} as any,
      getItem: function(key: string, initialValue: Value): Value {
        const storedValue = this.storage[key];
        return storedValue ? (JSON.parse(storedValue) as Value) : initialValue;
      },
      setItem: function(key: string, newValue: Value) {
        this.storage[key] = JSON.stringify(newValue)
      },
      removeItem: function(key: string) {
        delete this.storage[key];
      },
    };
  }

  function browserStorage(storageMechanism: StorageMechanism) {
    const storage = window[storageMechanism]

    return {
      getItem: (key: string, initialValue: Value) => {
        const storedValue = storage.getItem(key);
        return storedValue ? (JSON.parse(storedValue) as Value) : initialValue;
      },
      setItem: (key: string, newValue: Value) => {
        storage.setItem(key, JSON.stringify(newValue));
      },
      removeItem: (key: string) => {
        storage.removeItem(key);
      },
    };
  }
}

export default createStorage
