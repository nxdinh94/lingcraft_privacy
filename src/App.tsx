import { useEffect, useState } from 'react'
import logoWithText from './assets/logo_with_text.png'
import privacySource from './assets/privacy-policy.md?raw'
import termsSource from './assets/terms-of-use.md?raw'
import './App.css'

type RouteKey = 'home' | 'privacy' | 'terms'

type Block =
  | { type: 'h1' | 'h2' | 'p'; text: string }
  | { type: 'ul'; items: string[] }

type LegalDocument = {
  eyebrow: string
  title: string
  summary: string
  effectiveDate: string
  blocks: Block[]
}

const routeMap: Record<string, RouteKey> = {
  '/': 'home',
  '/privacy': 'privacy',
  '/terms': 'terms',
}

const documents: Record<Exclude<RouteKey, 'home'>, LegalDocument> = {
  privacy: buildDocument(
    privacySource,
    'Data & Permissions',
    'How Ling Craft handles sign-in, learning data, audio, ads, and storage across the product.',
  ),
  terms: buildDocument(
    termsSource,
    'Rights & Responsibilities',
    'The conditions for using Ling Craft, including acceptable use, AI output caveats, and service limits.',
  ),
}

function normalizePath(pathname: string): RouteKey {
  return routeMap[pathname.replace(/\/+$/, '') || '/'] ?? 'privacy'
}

function navigateTo(path: '/' | '/privacy' | '/terms', setRoute: (route: RouteKey) => void) {
  window.history.pushState({}, '', path)
  setRoute(normalizePath(path))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function buildDocument(source: string, eyebrow: string, summary: string): LegalDocument {
  const lines = source.split(/\r?\n/)
  const blocks: Block[] = []
  let index = 0
  let title = ''
  let effectiveDate = ''

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      title = line.slice(2).trim()
      blocks.push({ type: 'h1', text: title })
      index += 1
      continue
    }

    if (/^Effective date:/i.test(line)) {
      effectiveDate = line.replace(/^Effective date:\s*/i, '').trim()
      blocks.push({ type: 'p', text: line })
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() })
      index += 1
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []

      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2).trim())
        index += 1
      }

      blocks.push({ type: 'ul', items })
      continue
    }

    const paragraph: string[] = [line]
    index += 1

    while (index < lines.length) {
      const nextLine = lines[index].trim()

      if (!nextLine || nextLine.startsWith('#') || nextLine.startsWith('- ')) {
        break
      }

      paragraph.push(nextLine)
      index += 1
    }

    blocks.push({ type: 'p', text: paragraph.join(' ') })
  }

  return {
    eyebrow,
    title,
    summary,
    effectiveDate,
    blocks,
  }
}

function formatInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

function renderBlocks(blocks: Block[]) {
  return blocks.map((block, index) => {
    if (block.type === 'h1') {
      return null
    }

    if (block.type === 'h2') {
      return (
        <section key={`${block.text}-${index}`} className="doc-section">
          <h2>{block.text}</h2>
        </section>
      )
    }

    if (block.type === 'ul') {
      return (
        <ul key={`list-${index}`} className="doc-list">
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{formatInline(item)}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={`${block.text}-${index}`} className="doc-paragraph">
        {formatInline(block.text)}
      </p>
    )
  })
}

function App() {
  const [route, setRoute] = useState<RouteKey>(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const activeDocument = route === 'home' ? null : documents[route]

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => navigateTo('/', setRoute)}
          aria-label="Go to legal home"
        >
          <img className="brand-logo" src={logoWithText} alt="Ling Craft Legal Center" />
        </button>

        <nav className="topnav" aria-label="Legal documents">
          <button
            type="button"
            className={route === 'privacy' ? 'nav-pill active' : 'nav-pill'}
            onClick={() => navigateTo('/privacy', setRoute)}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className={route === 'terms' ? 'nav-pill active' : 'nav-pill'}
            onClick={() => navigateTo('/terms', setRoute)}
          >
            Terms of Use
          </button>
        </nav>
      </header>

      {route === 'home' ? (
        <section className="landing-panel">
          <div className="landing-copy simple-home">
            <p className="eyebrow">Legal Documents</p>
            <h1>Simple access to Ling Craft policies.</h1>
            <p className="lede">
              Read the privacy policy and terms of use in one place.
            </p>
            <div className="cta-row">
              <button
                type="button"
                className="cta-primary"
                onClick={() => navigateTo('/privacy', setRoute)}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="cta-secondary"
                onClick={() => navigateTo('/terms', setRoute)}
              >
                Terms of Use
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="document-layout">
          <aside className="document-sidebar">
            <p className="eyebrow">{activeDocument?.eyebrow}</p>
            <h1>{activeDocument?.title}</h1>
            <p className="lede">{activeDocument?.summary}</p>

            <div className="meta-card">
              <span>Effective date</span>
              <strong>{activeDocument?.effectiveDate}</strong>
            </div>

            <div className="quick-links">
              <button
                type="button"
                className="jump-link"
                onClick={() => navigateTo('/privacy', setRoute)}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="jump-link"
                onClick={() => navigateTo('/terms', setRoute)}
              >
                Terms of Use
              </button>
            </div>
          </aside>

          <article className="document-card">{activeDocument && renderBlocks(activeDocument.blocks)}</article>
        </section>
      )}
    </main>
  )
}

export default App
