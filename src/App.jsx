import { useState } from 'react'
import './App.css'

const API_URL = 'https://smart-url-shortener-ufi7.onrender.com'

function App() {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [shortened, setShortened] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('smartlink-theme') === 'dark'
  })

  async function handleShorten(event) {
    event.preventDefault()
    setError('')
    setShortened(null)
    setCopied(false)

    if (!url.trim()) {
      setError('Please enter a URL first.')
      return
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError('Please enter a valid website URL.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.startsWith('http') ? url : `https://${url}`,
          ...(alias.trim() ? { custom_alias: alias.trim() } : {}),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not shorten this URL.')
      }

      setShortened(data)
      setUrl('')
      setAlias('')
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please try again in a moment.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!shortened) return

    try {
      await navigator.clipboard.writeText(shortened.short_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed. Please copy the short link manually.')
    }
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="navbar">
        <a className="brand" href="#" aria-label="SmartLink home">
          <span className="brand-icon">↗</span>
          <span>smart<span className="brand-light">link</span></span>
        </a>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="nav-actions">
  <button
    className="theme-toggle"
    type="button"
    onClick={() => {
      const nextMode = !darkMode
      setDarkMode(nextMode)
      localStorage.setItem('smartlink-theme', nextMode ? 'dark' : 'light')
    }}
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? '☀️' : '🌙'}
    <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
  </button>

  <a className="nav-button" href="#shortener">
    Get started <span>↗</span>
  </a>
</div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="announcement">
              <span className="status-dot"></span>
              SIMPLE LINKS. SMARTER INSIGHTS.
            </div>

            <h1>
              Short links.
              <br />
              <span>Big possibilities.</span>
            </h1>

            <p className="hero-description">
              Transform long URLs into clean, shareable links.
              Track clicks and understand how people engage with your links.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#shortener">
                Shorten a link <span>↘</span>
              </a>
              <a className="secondary-button" href="#features">
                Explore features
              </a>
            </div>

            <div className="trust-row">
              <span className="trust-check">✓</span>
              No account required
              <span className="trust-separator">·</span>
              Free to try
            </div>
          </div>

          <div className="hero-visual" aria-label="Example link analytics">
            <div className="floating-tag tag-top">✦ Smart analytics</div>

            <div className="preview-card">
              <div className="preview-top">
                <div>
                  <span className="mini-label">LINK PERFORMANCE</span>
                  <h3>Your links, at a glance</h3>
                </div>
                <span className="live-badge"><span></span> LIVE</span>
              </div>

              <div className="preview-metric">
                <div>
                  <span className="mini-label">TOTAL CLICKS</span>
                  <strong>2,480</strong>
                </div>
                <span className="metric-growth">↗ 18.6%</span>
              </div>

              <div className="chart" aria-hidden="true">
                {[35, 49, 39, 62, 45, 72, 55, 80, 64, 92, 68, 100].map(
                  (height, index) => (
                    <div className="chart-column" key={index}>
                      <span style={{ height: `${height}%` }}></span>
                    </div>
                  ),
                )}
              </div>

              <div className="chart-labels">
                <span>MON</span><span>TUE</span><span>WED</span>
                <span>THU</span><span>FRI</span><span>SAT</span>
              </div>

              <div className="preview-link">
                <div className="link-symbol">↗</div>
                <div className="preview-link-text">
                  <strong>smartlink.app/demo</strong>
                  <span>Example shortened link</span>
                </div>
                <span className="link-arrow">↗</span>
              </div>
            </div>

            <div className="floating-tag tag-bottom">
              <span className="purple-dot"></span> Made for sharing
            </div>
          </div>
        </section>

        <section className="shortener-section" id="shortener">
          <div className="section-heading">
            <span className="eyebrow">YOUR LINK, REIMAGINED</span>
            <h2>Make every link count.</h2>
            <p>Paste your long URL below and let SmartLink do the rest.</p>
          </div>

          <form className="shortener-card" onSubmit={handleShorten}>
            <label htmlFor="long-url">Destination URL</label>

            <div className="url-input-wrap">
              <span className="input-icon">↗</span>
              <input
                id="long-url"
                type="text"
                placeholder="https://example.com/your/very/long/link"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
            </div>

            <label htmlFor="custom-alias">
              Custom alias <span className="optional">(optional)</span>
            </label>

            <div className="url-input-wrap alias-wrap">
              <span className="input-prefix">smartlink /</span>
              <input
                id="custom-alias"
                type="text"
                placeholder="my-link"
                value={alias}
                onChange={(event) => setAlias(event.target.value)}
              />
            </div>

            <button className="shorten-button" type="submit" disabled={loading}>
              {loading ? 'Creating your link...' : 'Shorten URL'}
              {!loading && <span>→</span>}
            </button>

            {error && <div className="message error-message" role="alert">{error}</div>}

            {shortened && (
              <div className="result-card" aria-live="polite">
                <div className="result-icon">✓</div>
                <div className="result-content">
                  <span className="mini-label">YOUR SHORT LINK IS READY</span>
                  <a href={shortened.short_url} target="_blank" rel="noreferrer">
                    {shortened.short_url}
                  </a>
                  <span className="original-url">{shortened.original_url}</span>
                </div>
                <button className="copy-button" type="button" onClick={handleCopy}>
                  {copied ? '✓ Copied!' : 'Copy link'}
                </button>
              </div>
            )}

            <p className="form-footnote">
              <span>🔒</span> Your link is created securely and ready to share.
            </p>
          </form>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">WHY SMARTLINK?</span>
            <h2>Small links. Smart tools.</h2>
            <p>Everything you need to create and understand better links.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon icon-purple">↗</div>
              <h3>Shorten in seconds</h3>
              <p>Turn long, complicated URLs into clean links that are easy to share.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon icon-blue">⌁</div>
              <h3>Track every click</h3>
              <p>Record visits to your shortened links and see how they perform.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon icon-pink">▦</div>
              <h3>Understand performance</h3>
              <p>Retrieve click counts and link details through your analytics API.</p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-copy">
            <span className="eyebrow">THREE SIMPLE STEPS</span>
            <h2>From long URL to ready-to-share.</h2>
            <p>Get started in seconds. No complicated setup required.</p>
          </div>

          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">01</span>
              <div><h3>Paste your URL</h3><p>Enter the destination you want to share.</p></div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div><h3>Create your short link</h3><p>Let SmartLink generate a unique, shareable code.</p></div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div><h3>Share and track</h3><p>Copy your link and check its click analytics.</p></div>
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div>
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h2>Your next great link starts here.</h2>
          </div>
          <a className="primary-button" href="#shortener">Create a short link <span>→</span></a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#">
          <span className="brand-icon">↗</span>
          <span>smart<span className="brand-light">link</span></span>
        </a>
        <p>Make every link count.</p>
        <span>Built with React + FastAPI</span>
      </footer>
    </div>
  )
}

export default App