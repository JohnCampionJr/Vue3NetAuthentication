import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    count: 0
  }),
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.count = 0
    },
  },
})
