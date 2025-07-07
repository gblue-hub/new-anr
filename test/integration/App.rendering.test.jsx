import { screen } from '@testing-library/react'
import { renderApp, setupMockLocalStorage } from '../test-utils/helpers'

describe('App Rendering', () => {
  beforeEach(() => {
    setupMockLocalStorage()
  })

  it('shows the initial interface', () => {
    const { container } = renderApp()
    expect(screen.getByRole('heading', { name: /latex builder \(stable\)/i })).toBeInTheDocument()
    const textarea = screen.getByRole('textbox')
    expect(textarea.value).toBe('\\int_{a}^{b} f(x) \\, dx')
    expect(container.querySelector('.preview-container .katex')).toBeInTheDocument()
  })
})
