import { useEffect, useState } from 'react'
import logoWithText from './assets/logo_with_text.png'
import privacySource from './assets/privacy-policy.md?raw'
import termsSource from './assets/terms-of-use.md?raw'
import './App.css'

type RouteKey = 'home' | 'privacy' | 'terms' | 'support'

type Block =
  | { type: 'h1' | 'h2' | 'p'; text: string }
  | { type: 'ul'; items: string[] }

type DocumentRouteKey = 'privacy' | 'terms'

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
  '/support': 'support',
}

const documents: Record<DocumentRouteKey, LegalDocument> = {
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

function navigateTo(
  path: '/' | '/privacy' | '/terms' | '/support',
  setRoute: (route: RouteKey) => void,
) {
  window.history.pushState({}, '', path)
  setRoute(normalizePath(path))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToHashTarget() {
  const hash = window.location.hash.slice(1)

  if (!hash) {
    return
  }

  const target = document.getElementById(hash)

  if (!target) {
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    const handleHashChange = () => {
      window.requestAnimationFrame(scrollToHashTarget)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    window.requestAnimationFrame(scrollToHashTarget)
  }, [route])

  const activeDocument = route === 'privacy' || route === 'terms' ? documents[route] : null

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
            className={route === 'support' ? 'nav-pill active' : 'nav-pill'}
            onClick={() => navigateTo('/support', setRoute)}
          >
            Support
          </button>
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
      ) : route === 'support' ? (
        <section className="support-layout">
          <article className="support-card support-hero">
            <p className="eyebrow">Support</p>
            <h1>Ling Craft support and account deletion</h1>
            <p className="lede">
              Contact support, ask privacy questions, or request deletion of your account and
              associated data.
            </p>
          </article>

          <article className="support-card">
            <h2>Contact</h2>
            <p className="doc-paragraph">
              Email: <code>nguyenxuandinh336@gmail.com</code>
            </p>
            <p className="doc-paragraph">
              Phone: <code>0384566800</code>
            </p>
            <p className="doc-paragraph">
              Include your account email and a short description of the issue so support can
              verify and process your request faster.
            </p>
          </article>

          <article id="delete-account-and-data" className="support-card">
            <h2>Delete your account and data</h2>
            <ul className="doc-list">
              <li>Send an email to `nguyenxuandinh336@gmail.com` with the subject `Delete my Ling Craft account`.</li>
              <li>In the email, include the email address linked to your Ling Craft account.</li>
              <li>State clearly whether you want to delete only your account access or your account together with related stored data.</li>
              <li>Support may contact you to verify ownership before deletion is completed.</li>
              <li>After verification, the deletion request will be processed and your remote account data will be removed where applicable.</li>
            </ul>
          </article>

          <article className="support-card">
            <h2>What may be deleted</h2>
            <ul className="doc-list">
              <li>Account profile data linked to your authenticated Ling Craft account.</li>
              <li>Remote learning data such as saved preferences, vocabulary-related records, and related account-linked content stored for app operation.</li>
              <li>Local data on your device is not removed automatically by an email request. You should also uninstall the app or clear local app storage on your device if needed.</li>
            </ul>
          </article>
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
