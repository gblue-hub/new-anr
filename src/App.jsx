import React, { useState, useRef, useEffect, useMemo } from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'
import './App.css'

function App() {
  const [latex, setLatex] = useState('\\int_{a}^{b} f(x) \\, dx')
  const [cursorPos, setCursorPos] = useState(0)
  const [customTemplates, setCustomTemplates] = useState([])
  const [newLabel, setNewLabel] = useState('')
  const [newTemplate, setNewTemplate] = useState('')

  const [history, setHistory] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('latex_history'))
      return Array.isArray(stored) ? stored.slice(-10) : []
    } catch {
      return []
    }
  })

  const textareaRef = useRef(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (ta && ta.selectionStart !== cursorPos) {
      ta.setSelectionRange(cursorPos, cursorPos)
    }
  }, [cursorPos])

  const insertTemplate = (template) => {
    const ta = textareaRef.current
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = latex.slice(start, end)

    let piece = template
    if (template.includes('{}')) {
      piece = selected
        ? template.replace('{}', `{${selected}}`)
        : template
    }

    const newLatex = latex.slice(0, start) + piece + latex.slice(end)
    setLatex(newLatex)

    const idx = piece.indexOf('{}')
    const nextPos = idx >= 0 ? start + idx + 1 : start + piece.length
    setCursorPos(nextPos)
    ta.focus()
  }

  const handleSaveToHistory = () => {
    const current = latex.trim()
    if (!current) return

    const deduped = [...new Set([...history.filter(x => x !== current), current])]
    const trimmed = deduped.slice(-10)

    setHistory(trimmed)
    localStorage.setItem('latex_history', JSON.stringify(trimmed))
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem('latex_history')
  }

  const renderMath = useMemo(() => {
    try {
      return <InlineMath math={latex} />
    } catch (e) {
      return <span className="error-text">{e.message}</span>
    }
  }, [latex])

  const handleCopy = () => {
    if (!latex.trim()) return
    navigator.clipboard?.writeText?.(latex)
  }

  const clearLatex = () => {
    setLatex('')
    textareaRef.current?.focus()
  }

  const addTemplate = () => {
    if (!newLabel.trim() || !newTemplate.trim()) return
    setCustomTemplates(prev => [...prev, { name: newLabel, tpl: newTemplate }])
    setNewLabel('')
    setNewTemplate('')
  }

  const templates = [
    { name: 'Fraction', tpl: '\\frac{}{}' },
    { name: '√ Root', tpl: '\\sqrt{}' },
    ...customTemplates
  ]

  const loadHistoryItem = (item) => {
    setLatex(item)
    setCursorPos(item.length)
    textareaRef.current?.focus()
  }

  return (
    <div className="app-container">
      <h1 className="app-title">LaTeX Builder (Stable)</h1>

      <div className="toolbar">
        {templates.map(t => (
          <button key={t.name} className="btn toolbar-btn" onClick={() => insertTemplate(t.tpl)}>
            {t.name}
          </button>
        ))}
        <button className="btn btn-copy" onClick={handleCopy} disabled={latex.trim().length === 0}>
          Copy
        </button>
        <button className="btn btn-clear" onClick={clearLatex}>Clear</button>
        <button className="btn btn-save" onClick={handleSaveToHistory}>Save</button>
        <button className="btn btn-clear-history" onClick={handleClearHistory}>Clear History</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ minWidth: '140px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>History</h4>
          {history.length === 0 && <p style={{ fontStyle: 'italic' }}>No history</p>}
          {history.slice().reverse().map((item, idx) => (
            <div
              key={idx}
              data-testid="history-item"
              className="history-item"
              onClick={() => loadHistoryItem(item)}
              style={{
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: '1px solid #ddd',
                marginBottom: '4px'
              }}
            >
              <InlineMath math={item} />
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="latex-input"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          onClick={(e) => setCursorPos(e.target.selectionStart)}
          onKeyUp={(e) => setCursorPos(e.target.selectionStart)}
          placeholder="Enter LaTeX here…"
          rows={4}
        />
      </div>

      <div className="preview-container">
        {renderMath}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h4>Add New Template</h4>
        <input
          type="text"
          placeholder="Button label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="LaTeX template"
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button className="btn" onClick={addTemplate}>Add Template</button>
      </div>
    </div>
  )
}

export default App
