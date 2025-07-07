import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import App from '../../src/App.jsx'
import { setupMockLocalStorage } from './mockLocalStorage.js'

export function renderApp() {
  return render(<App />)
}

export { userEvent, setupMockLocalStorage }
