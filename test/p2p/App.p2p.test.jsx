import { screen } from '@testing-library/react'
import { renderApp, userEvent, setupMockLocalStorage } from '../test-utils/helpers'

describe('App localStorage interactions', () => {
  it('loads existing history from localStorage', () => {
    setupMockLocalStorage({ latex_history: JSON.stringify(['a', 'b']) })
    renderApp()
    expect(screen.getAllByTestId('history-item')).toHaveLength(2)
  })

  it('inserts a template into the input', async () => {
    setupMockLocalStorage()
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: /fraction/i }))
    expect(screen.getByRole('textbox').value).toContain('\\frac{}{}')
  })
})
