export function createMockLocalStorage(initial = {}) {
  let store = { ...initial }
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
    },
    setItem(key, value) {
      store[key] = String(value)
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    },
    key(index) {
      return Object.keys(store)[index] || null
    },
    get length() {
      return Object.keys(store).length
    }
  }
}

export function setupMockLocalStorage(initial = {}) {
  const mock = createMockLocalStorage(initial)
  Object.defineProperty(window, 'localStorage', { value: mock, writable: true })
  return mock
}
