import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Component', () => {
  it('renders the heading "LaTeX Builder (Stable)"', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /LaTeX Builder \(Stable\)/i })
    expect(heading).toBeInTheDocument()
  })

  it('clears the input when the clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const textarea = screen.getByRole('textbox')
    expect(textarea.value).not.toBe('')
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(textarea.value).toBe('')
  })
})
