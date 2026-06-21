import { useEffect, useState } from 'react'
import logoWithText from './assets/logo_with_text.png'
import appIcon from './assets/ling-craft-app-icon-circle.svg'
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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

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

  // Track scroll progress and scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      } else {
        setScrollProgress(0)
      }
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initialize in case of loaded scroll offset
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [route])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeDocument = route === 'privacy' || route === 'terms' ? documents[route] : null

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      {/* Reading Progress Bar */}
      {activeDocument && (
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }} 
          aria-hidden="true"
        />
      )}

      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => navigateTo('/', setRoute)}
          aria-label="Go to legal home"
        >
          <img className="brand-logo desktop-logo" src={logoWithText} alt="Ling Craft Legal Center" />
          <div className="brand-mobile-container">
            <img className="brand-logo-compact" src={appIcon} alt="Ling Craft Icon" />
            <span className="brand-title">Ling Craft <span className="brand-subtitle">Legal</span></span>
          </div>
        </button>

        <nav className="topnav segmented-control" aria-label="Legal documents">
          <button
            type="button"
            className={route === 'home' ? 'segment-pill active' : 'segment-pill'}
            onClick={() => navigateTo('/', setRoute)}
          >
            Home
          </button>
          <button
            type="button"
            className={route === 'privacy' ? 'segment-pill active' : 'segment-pill'}
            onClick={() => navigateTo('/privacy', setRoute)}
          >
            Privacy
          </button>
          <button
            type="button"
            className={route === 'terms' ? 'segment-pill active' : 'segment-pill'}
            onClick={() => navigateTo('/terms', setRoute)}
          >
            Terms
          </button>
          <button
            type="button"
            className={route === 'support' ? 'segment-pill active' : 'segment-pill'}
            onClick={() => navigateTo('/support', setRoute)}
          >
            Support
          </button>
        </nav>
      </header>

      {route === 'home' ? (
        <section className="landing-panel">
          <div className="landing-copy simple-home">
            <div className="landing-logo-container">
              <img className="landing-icon" src={appIcon} alt="Ling Craft App Icon" />
            </div>
            <p className="eyebrow">Legal Center</p>
            <h1>Simple access to Ling Craft policies.</h1>
            <p className="lede">
              Read the privacy policy, terms of use, or request support and data deletion in one place.
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
            <h1>Ling Craft Help &amp; Support</h1>
            <p className="lede">
              Contact our team, ask privacy questions, or request deletion of your account and
              associated data.
            </p>
          </article>

          <article className="support-card">
            <h2>Contact</h2>
            <div className="contact-list">
              <a href="mailto:nguyenxuandinh336@gmail.com" className="contact-item">
                <div className="contact-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-info">
                  <span className="contact-label">Email Support</span>
                  <span className="contact-value">nguyenxuandinh336@gmail.com</span>
                </div>
                <span className="contact-arrow" aria-hidden="true">→</span>
              </a>
              
              <a href="tel:0384566800" className="contact-item">
                <div className="contact-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-info">
                  <span className="contact-label">Call Support</span>
                  <span className="contact-value">0384566800</span>
                </div>
                <span className="contact-arrow" aria-hidden="true">→</span>
              </a>
            </div>
            <p className="doc-paragraph note-paragraph">
              Include your account email and a short description of the issue so support can
              verify and process your request faster.
            </p>
          </article>

          <article id="delete-account-and-data" className="support-card">
            <h2>Delete your account and data</h2>
            <ul className="doc-list-styled">
              <li>
                <div className="step-num">1</div>
                <div className="step-text">Send an email to <code>nguyenxuandinh336@gmail.com</code> with the subject <code>Delete my Ling Craft account</code>.</div>
              </li>
              <li>
                <div className="step-num">2</div>
                <div className="step-text">In the email, include the email address linked to your Ling Craft account.</div>
              </li>
              <li>
                <div className="step-num">3</div>
                <div className="step-text">State clearly whether you want to delete only your account access or your account together with related stored data.</div>
              </li>
              <li>
                <div className="step-num">4</div>
                <div className="step-text">Support may contact you to verify ownership before deletion is completed.</div>
              </li>
              <li>
                <div className="step-num">5</div>
                <div className="step-text">After verification, the deletion request will be processed and your remote account data will be removed where applicable.</div>
              </li>
            </ul>
          </article>

          <article className="support-card">
            <h2>What may be deleted</h2>
            <ul className="doc-list-styled delete-warnings">
              <li>
                <span className="warning-bullet">✓</span>
                <div className="step-text">Account profile data linked to your authenticated Ling Craft account.</div>
              </li>
              <li>
                <span className="warning-bullet">✓</span>
                <div className="step-text">Remote learning data such as saved preferences, vocabulary-related records, and related account-linked content stored for app operation.</div>
              </li>
              <li>
                <span className="warning-bullet">⚠️</span>
                <div className="step-text">Local data on your device is not removed automatically by an email request. You should also uninstall the app or clear local app storage on your device if needed.</div>
              </li>
            </ul>
          </article>
        </section>
      ) : (
        <section className="document-layout">
          <aside className="document-sidebar desktop-only">
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
                className={`jump-link ${route === 'privacy' ? 'active-link' : ''}`}
                onClick={() => navigateTo('/privacy', setRoute)}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className={`jump-link ${route === 'terms' ? 'active-link' : ''}`}
                onClick={() => navigateTo('/terms', setRoute)}
              >
                Terms of Use
              </button>
            </div>
          </aside>

          <article className="document-card">
            {/* Mobile Header (renders inside card, only displayed on mobile via CSS) */}
            <header className="document-header-mobile mobile-only">
              <p className="eyebrow">{activeDocument?.eyebrow}</p>
              <h1>{activeDocument?.title}</h1>
              <p className="lede">{activeDocument?.summary}</p>
              <div className="meta-card-mobile">
                <span>Effective date: <strong>{activeDocument?.effectiveDate}</strong></span>
              </div>
            </header>

            <div className="document-body-content">
              {activeDocument && renderBlocks(activeDocument.blocks)}
            </div>
          </article>
        </section>
      )}

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </main>
  )
}

export default App
