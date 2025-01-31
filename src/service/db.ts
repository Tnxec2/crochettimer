let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;
const dbName= 'crochetDB';

export type CrochetProject = {
  id: string;
  name: string;
  hasMultipleParts: boolean;
  hasTimer: boolean;
  hasSecondCounter: boolean;
  parts?: CrochetPart[];
  counter: number;
  secondCounter: number;
  timerOn: boolean;
  time: number;
  note: string;
  archived?: boolean;
}

export type CrochetPart = {
  id: string;
  name: string;
  counter: number;
  secondCounter: number;
}

export enum Stores {
  Projects = 'crochet_projects',
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open(dbName);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Projects)) {
        // console.log('Creating projects store');
        db.createObjectStore(Stores.Projects, { keyPath: 'id' });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      try {
        db = request.result;
        version = db.version;
        // console.log('request.onsuccess - initDB', version);
        resolve(true);
      } catch (error) {
        
      }

    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addData = <T>(storeName: string, data: T): Promise<T|string|null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      // console.log('request.onsuccess - addData', data);
      db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
}

export const deleteData = (storeName: string, key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // again open the connection
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      // console.log('request.onsuccess - deleteData', key);
      db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        resolve(false);
      }
    };
  });
};

export const updateData = <T>(storeName: string, key: string, data: T): Promise<T|string|null> => {
  return new Promise((resolve) => {
    console.log('update data');
    
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      // console.log('request.onsuccess - updateData', key);
      db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const res = store.get(key);
      res.onsuccess = () => {
        const newData = { ...res.result, ...data };        
        store.put(newData);
        resolve(newData);
      };
      res.onerror = () => {
        resolve(null);
      }
    };
  });
};