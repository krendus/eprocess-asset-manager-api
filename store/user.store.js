import React from 'react';
import { makeObservable, action, observable } from 'mobx';

class UserStore {
  user = null;
  token = "";

  constructor() {
    makeObservable(this, {
      user: observable,
      addUser: action.bound,
      removeUser: action.bound
    })
  }

  addUser(user) {
    this.user = user;
  }

  removeUser() {
    this.user = null;
  }
}

// Instantiate the counter store.
const userStore = new UserStore();
// Create a React Context with the counter store instance.
export const UserStoreContext = React.createContext(userStore);
export const useUserStore = () => React.useContext(UserStoreContext)
