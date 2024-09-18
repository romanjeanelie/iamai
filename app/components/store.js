// store.js
const state = {
  chatId: null,
  userId: null,
  isLoggedIn: false,
  theme: "light",
  // add more variables as needed
};

export const store = {
  // Get a value by key
  get(key) {
    return state[key];
  },

  // Set a value by key
  set(key, value) {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    } else {
      console.warn(`Key ${key} does not exist in the store.`);
    }
  },

  // Optionally, get the whole state (useful for debugging or resetting)
  getState() {
    return state;
  },

  // Optionally, reset the store
  reset() {
    Object.keys(state).forEach((key) => (state[key] = null));
  },
};
