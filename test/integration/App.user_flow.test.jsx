import { screen } from '@testing-library/react'
import { renderApp, userEvent, setupMockLocalStorage } from '../test-utils/helpers'

describe('App User Flow', () => {
  beforeEach(() => {
    setupMockLocalStorage()
  })

  it('saves input to history and localStorage', async () => {
    const user = userEvent.setup()
    renderApp()
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'x+1')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getAllByTestId('history-item')).toHaveLength(1)
    const stored = JSON.parse(window.localStorage.getItem('latex_history'))
    expect(stored).toContain('x+1')
  })

  it('clears history', async () => {
    const user = userEvent.setup()
    renderApp()
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'abc')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getAllByTestId('history-item')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryByTestId('history-item')).not.toBeInTheDocument()
    expect(window.localStorage.getItem('latex_history')).toBeNull()
  })

  it('adds a custom template and inserts it', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByPlaceholderText('Button label'), 'Custom')
    await user.type(screen.getByPlaceholderText('LaTeX template'), '\\sqrt{}')
    await user.click(screen.getByRole('button', { name: /add template/i }))
    await user.click(screen.getByRole('button', { name: 'Custom' }))
    expect(screen.getByRole('textbox').value).toContain('\\sqrt{}')
  })
})
