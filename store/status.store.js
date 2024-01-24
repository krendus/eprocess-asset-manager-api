import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class StatusStore {
  authenticated = false;
  constructor() {
    makeObservable(this, {
      authenticated: observable,
      setStatus: action.bound,
    })
  }
  setStatus(value) {
    this.authenticated = value;
  }
}

// Instantiate the counter store.
const statusStore = new StatusStore();
// Create a React Context with the counter store instance.
export const StatusStoreContext = React.createContext(statusStore);
export const useStatusStore = () => React.useContext(StatusStoreContext)
