"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;
// store.js
var state = {
  chatId: null,
  userId: null,
  isLoggedIn: false,
  theme: "light" // add more variables as needed

};
var store = {
  // Get a value by key
  get: function get(key) {
    return state[key];
  },
  // Set a value by key
  set: function set(key, value) {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    } else {
      console.warn("Key ".concat(key, " does not exist in the store."));
    }
  },
  // Optionally, get the whole state (useful for debugging or resetting)
  getState: function getState() {
    return state;
  },
  // Optionally, reset the store
  reset: function reset() {
    Object.keys(state).forEach(function (key) {
      return state[key] = null;
    });
  }
};
exports.store = store;