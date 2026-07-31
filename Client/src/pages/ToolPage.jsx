import { useEffect, useState } from 'react'
import { Copy as CopyIcon, LoaderCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const toolForms = {
  'url-shortner': {
    label: 'Destination URL',
    placeholder: 'Paste your long URL here...',
  },
  'pastebin': {
    label: 'Paste content',
    placeholder: 'Enter your text here',
  },
  'qr': {
    label: 'Text or URL',
    placeholder: 'https://example.com',
  },
  'file-sharing': {
    label: 'File or message',
    placeholder: 'Select a file or add details',
  },
  'authkit': {
    label: 'Auth input',
    placeholder: 'Enter credentials or token',
  },
}

function formatDate(value) {
  if (!value) return 'Unknown'
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ToolPage({ tools }) {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const tool = tools.find((item) => item.id === toolId)
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState(null)
  const [urls, setUrls] = useState([])
  const [historyError, setHistoryError] = useState('')
  const [qrMode, setQrMode] = useState('url')
  const [qrUrl, setQrUrl] = useState('')
  const [upiId, setUpiId] = useState('')
  const [upiAmount, setUpiAmount] = useState('100.00')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [authMode, setAuthMode] = useState('password')
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [passwordResult, setPasswordResult] = useState('')
  const [passwordGenerating, setPasswordGenerating] = useState(false)

  const getPasswordStrength = () => {
    const checks = [includeUpper, includeLower, includeNumbers, includeSymbols].filter(Boolean).length
    const lengthScore = Math.min(passwordLength / 16, 1)
    const strengthScore = checks * 0.2 + lengthScore * 0.6

    if (strengthScore >= 0.9) {
      return { label: 'Very strong', value: 100, variant: 'very-strong' }
    }
    if (strengthScore >= 0.7) {
      return { label: 'Strong', value: 80, variant: 'strong' }
    }
    if (strengthScore >= 0.45) {
      return { label: 'Fair', value: 55, variant: 'fair' }
    }
    return { label: 'Weak', value: 30, variant: 'weak' }
  }

  const [hashInput, setHashInput] = useState('')
  const [hashAlgo, setHashAlgo] = useState('SHA-256')
  const [hashResult, setHashResult] = useState('')
  const [jwtInput, setJwtInput] = useState('')
  const [jwtMode, setJwtMode] = useState('decode')
  const [jwtResult, setJwtResult] = useState('')
  const token = window?.localStorage?.getItem('token') || ''
  const isUrlShortener = tool?.id === 'url-shortner'
  const isQR = tool?.id === 'qr'
  const isAuthKit = tool?.id === 'authkit'

  useEffect(() => {
    if (!isUrlShortener || !token) return

    const controller = new AbortController()

    async function fetchUrls() {
      setHistoryError('')
      try {
        const response = await fetch('/tools/urlShortner', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load saved URLs.')
        }

        setUrls(data.data || [])
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setHistoryError(fetchError.message)
        }
      }
    }

    fetchUrls()
    return () => controller.abort()
  }, [isUrlShortener, token])

  const handleShorten = async () => {
    setError('')
    setFeedback('')

    if (!originalUrl.trim()) {
      setError('Enter a valid destination URL.')
      return
    }

    if (!token) {
      setError('Sign in to create and save short URLs.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        originalUrl: originalUrl.trim(),
      }
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim()
      }

      const response = await fetch('/tools/urlShortner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create short URL.')
      }

      setResult(data.data)
      setFeedback('Short URL created successfully.')
      setOriginalUrl('')
      setCustomAlias(data.data.customAlias || '')
      setUrls((current) => [data.data, ...current])
    } catch (postError) {
      setError(postError.message || 'Unable to shorten URL.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      setFeedback('Copied to clipboard.')
      setError('')
    } catch {
      setError('Unable to copy the link.')
      setFeedback('')
    }
  }

  const handleGenerateQr = () => {
    setError('')
    setFeedback('')

    if (qrMode === 'url') {
      if (!qrUrl.trim()) {
        setError('Enter a valid URL.')
        return
      }
    } else {
      if (!upiId.trim()) {
        setError('Enter a valid UPI ID.')
        return
      }
      if (!upiAmount.trim()) {
        setError('Enter a valid amount.')
        return
      }
    }

    setQrGenerated(true)
    setFeedback('QR ready. Scan it with any compatible app.')
  }

  const handleGeneratePassword = () => {
    if (passwordGenerating) return
    setError('')
    setFeedback('')
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'
    let charset = ''

    if (includeUpper) charset += upper
    if (includeLower) charset += lower
    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols

    if (!charset) {
      setError('Select at least one character type.')
      return
    }

    const length = Math.max(4, Math.min(64, passwordLength))
    setPasswordGenerating(true)
    window.setTimeout(() => {
      let password = ''
      for (let i = 0; i < length; i += 1) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }

      setPasswordResult(password)
      setFeedback('Password generated.')
      setPasswordGenerating(false)
    }, 350)
  }

  const handleHash = () => {
    setError('')
    setFeedback('')
    if (!hashInput.trim()) {
      setError('Enter text to hash.')
      return
    }

    const encoded = new TextEncoder().encode(hashInput)
    let algo = 'SHA-256'
    if (hashAlgo === 'SHA-1') algo = 'SHA-1'
    if (hashAlgo === 'SHA-384') algo = 'SHA-384'
    if (hashAlgo === 'SHA-512') algo = 'SHA-512'

    window.crypto.subtle.digest(algo, encoded).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      setHashResult(hashHex)
      setFeedback('Text hashed.')
    }).catch(() => {
      setError('Unable to generate hash.')
    })
  }

  const handleJwt = () => {
    setError('')
    setFeedback('')
    if (!jwtInput.trim()) {
      setError('Enter a JWT to decode.')
      return
    }

    try {
      const parts = jwtInput.trim().split('.')
      if (parts.length < 2) {
        throw new Error('Invalid JWT format.')
      }

      const base64UrlDecode = (value) => {
        const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
        return decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
            .join(''),
        )
      }

      const decoded = {
        header: JSON.parse(base64UrlDecode(parts[0])),
        payload: JSON.parse(base64UrlDecode(parts[1])),
      }

      setJwtResult(
        jwtMode === 'decode'
          ? JSON.stringify(decoded, null, 2)
          : window.btoa(JSON.stringify(decoded.payload)),
      )
      setFeedback(jwtMode === 'decode' ? 'JWT decoded.' : 'Payload base64 encoded.')
    } catch (decodeError) {
      setError(decodeError.message || 'Invalid JWT.')
    }
  }

  if (!tool) {
    return (
      <section className="playground">
        <div className="playground-heading">
          <div className="playground-title">
            <span className="tool-icon">?</span>
            <div>
              <p className="eyebrow">TOOL NOT FOUND</p>
              <h2>Sorry, that tool does not exist.</h2>
            </div>
          </div>
          <button className="close-button" type="button" onClick={() => navigate('/')}>Back to library</button>
        </div>
        <div className="playground-body">
          <p className="intro-copy">Choose an available tool from the sidebar or return home.</p>
        </div>
      </section>
    )
  }

  const form = toolForms[tool.id] || toolForms['url-shortner']
  const comingSoonTools = ['pastebin', 'file-sharing']
  const isComingSoon = comingSoonTools.includes(toolId)

  return (
    <section className="playground">
      <div className="playground-heading">
        <div className="playground-title">
          <span className="tool-icon" aria-hidden="true">
            {tool.icon}
          </span>
          <div>
            <h2>{tool.name}</h2>
          </div>
        </div>
        <button className="close-button" type="button" onClick={() => navigate('/')}>
          Back to library
        </button>
      </div>

      <div className="playground-body url-shortener-page">
        {isUrlShortener ? (
          <>
              <div className="tool-header">
              <p>Make a short, shareable link.</p>
            </div>

            <div className="url-input-row">
              <div className="url-input-field">
                <span className="url-input-icon">↗</span>
                <input
                  id="tool-input"
                  value={originalUrl}
                  onChange={(event) => {
                    setOriginalUrl(event.target.value)
                    setError('')
                    setFeedback('')
                  }}
                  placeholder={form.placeholder}
                />
              </div>
              <button type="button" className="primary-button" onClick={handleShorten} disabled={loading}>
                {loading ? 'Shortening…' : 'Shorten URL'}
              </button>
            </div>

            <div className="alias-row">
              <label htmlFor="alias-input">Custom alias</label>
              <input
                id="alias-input"
                value={customAlias}
                onChange={(event) => {
                  setCustomAlias(event.target.value)
                  setError('')
                  setFeedback('')
                }}
                placeholder="short-link"
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {feedback && <p className="form-success">{feedback}</p>}

            {result && (
              <div className="result-card simple-result-card">
                <div className="result-row result-row--space">
                  <span className="result-label">Short URL</span>
                  <button type="button" onClick={() => handleCopy(result.shortUrl)}>
                    Copy
                  </button>
                </div>
                <a className="short-url-link" href={result.shortUrl} target="_blank" rel="noreferrer">
                  {result.shortUrl}
                </a>
                <div className="short-url-meta">
                  <span>Original URL: {result.originalUrl}</span>
                  <span>Alias: {result.customAlias || result.shortCode}</span>
                </div>
              </div>
            )}

            <div className="short-url-table-card">
              <div className="table-header">
                <h4>Your shortened links</h4>
              </div>
              {urls.length === 0 ? (
                <div className="empty-links-panel">
                  <div className="empty-state-icon">🔗</div>
                  <h4>No links yet</h4>
                  <p>Your shortened links will appear here once you create one.</p>
                </div>
              ) : (
                <table className="short-url-table">
                  <thead>
                    <tr>
                      <th>Original URL</th>
                      <th>Short URL</th>
                      <th>Custom alias</th>
                      <th>Created at</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <a href={item.originalUrl} target="_blank" rel="noreferrer">
                            {item.originalUrl}
                          </a>
                        </td>
                        <td>
                          <a href={item.shortUrl} target="_blank" rel="noreferrer">
                            {item.shortUrl}
                          </a>
                        </td>
                        <td>{item.customAlias || item.shortCode}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <button type="button" className="row-action" onClick={() => window.open(item.shortUrl, '_blank')}>
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : isComingSoon ? (
          <div className="coming-soon-panel">
            <div className="coming-soon-icon">{tool.icon}</div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <span className="coming-soon-badge">Coming soon</span>
          </div>        ) : isAuthKit ? (
          <div className="authkit-page">
            <div className="qr-header authkit-header">
              <p className="qr-eyebrow">AuthKit</p>
              <p className="qr-description">Compact password, hashing, and JWT tools in one fast utility.</p>
            </div>

            <div className="authkit-mode-row">
              <button
                type="button"
                className={authMode === 'password' ? 'authkit-mode-button active' : 'authkit-mode-button'}
                onClick={() => setAuthMode('password')}
              >
                Password
              </button>
              <button
                type="button"
                className={authMode === 'hasher' ? 'authkit-mode-button active' : 'authkit-mode-button'}
                onClick={() => setAuthMode('hasher')}
              >
                Hasher
              </button>
              <button
                type="button"
                className={authMode === 'jwt' ? 'authkit-mode-button active' : 'authkit-mode-button'}
                onClick={() => setAuthMode('jwt')}
              >
                JWT
              </button>
            </div>

            {authMode === 'password' ? (
              <div className="authkit-password-layout">
                <div className="authkit-promo-copy">
                  <h2>Strong. Secure.<br />Awesome. Try our<br />random password<br />generator.</h2>
                  <p>A powerful generator for powerful passwords to protect your online accounts.</p>
                </div>
                <section className="authkit-password-card" aria-labelledby="password-generator-title">
                <div className="authkit-card-heading">
                  <h3 id="password-generator-title">Password Generator</h3>
                  <p>Generate strong, secure passwords.</p>
                </div>
                <div className="authkit-password-top-row">
                  <div className="authkit-password-field">
                    <input
                      className="authkit-text-input authkit-generated-input"
                      type="text"
                      readOnly
                      tabIndex="-1"
                      value={passwordResult}
                      placeholder="Generated password"
                    />
                    <button
                      type="button"
                      className="authkit-copy-button"
                      onClick={() => handleCopy(passwordResult)}
                      disabled={!passwordResult}
                      aria-label="Copy generated password"
                      title="Copy generated password"
                    >
                      <CopyIcon size={16} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="authkit-primary-button"
                    onClick={handleGeneratePassword}
                    disabled={passwordGenerating}
                    aria-busy={passwordGenerating}
                  >
                    {passwordGenerating ? <LoaderCircle className="authkit-spinner" size={16} aria-hidden="true" /> : 'Generate'}
                  </button>
                </div>
                <div className="authkit-slider-row">
                  <label htmlFor="password-length">Password length</label>
                  <span className="authkit-range-value">{passwordLength}</span>
                </div>
                <div className="authkit-slider-track">
                  <input
                    id="password-length"
                    className="authkit-range-input"
                    type="range"
                    min="4"
                    max="64"
                    value={passwordLength}
                    onChange={(event) => setPasswordLength(Number(event.target.value))}
                  />
                </div>
                <p className="authkit-section-label">Include</p>
                <div className="authkit-check-row">
                  <label className="authkit-checkbox">
                    <span>Uppercase</span>
                    <div className="authkit-switch-wrap">
                      <input
                        type="checkbox"
                        checked={includeUpper}
                        onChange={(event) => setIncludeUpper(event.target.checked)}
                      />
                      <span className="authkit-switch" aria-hidden="true" />
                    </div>
                  </label>
                  <label className="authkit-checkbox">
                    <span>Lowercase</span>
                    <div className="authkit-switch-wrap">
                      <input
                        type="checkbox"
                        checked={includeLower}
                        onChange={(event) => setIncludeLower(event.target.checked)}
                      />
                      <span className="authkit-switch" aria-hidden="true" />
                    </div>
                  </label>
                  <label className="authkit-checkbox">
                    <span>Numbers</span>
                    <div className="authkit-switch-wrap">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(event) => setIncludeNumbers(event.target.checked)}
                      />
                      <span className="authkit-switch" aria-hidden="true" />
                    </div>
                  </label>
                  <label className="authkit-checkbox">
                    <span>Symbols</span>
                    <div className="authkit-switch-wrap">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(event) => setIncludeSymbols(event.target.checked)}
                      />
                      <span className="authkit-switch" aria-hidden="true" />
                    </div>
                  </label>
                </div>
                <div className="authkit-strength-row">
                  <span>Password strength</span>
                  <span className="strength-label">{getPasswordStrength().label}</span>
                </div>
                <div className="authkit-strength-bar">
                  <div
                    className={`authkit-strength-fill ${getPasswordStrength().variant}`}
                    style={{ width: `${getPasswordStrength().value}%` }}
                  />
                </div>
                </section>
              </div>
            ) : authMode === 'hasher' ? (
              <>
                <div className="authkit-action-row">
                  <div className="authkit-input-group">
                    <label htmlFor="hash-input">Text to hash</label>
                    <input
                      id="hash-input"
                      className="authkit-text-input"
                      value={hashInput}
                      onChange={(event) => setHashInput(event.target.value)}
                      placeholder="Enter text"
                    />
                  </div>
                  <button type="button" className="authkit-primary-button" onClick={handleHash}>
                    Hash
                  </button>
                </div>
                <div className="authkit-subrow">
                  <label htmlFor="hash-algo">Algorithm</label>
                  <select
                    id="hash-algo"
                    value={hashAlgo}
                    onChange={(event) => setHashAlgo(event.target.value)}
                  >
                    <option>SHA-1</option>
                    <option>SHA-256</option>
                    <option>SHA-384</option>
                    <option>SHA-512</option>
                  </select>
                </div>
                {hashResult && (
                  <div className="authkit-result-card">
                    <div className="result-row result-row--space">
                      <span className="result-label">Hash output</span>
                      <button type="button" onClick={() => handleCopy(hashResult)}>
                        Copy
                      </button>
                    </div>
                    <pre>{hashResult}</pre>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="authkit-input-full">
                  <label htmlFor="jwt-input">JWT token</label>
                  <textarea
                    id="jwt-input"
                    className="authkit-textarea"
                    rows="4"
                    value={jwtInput}
                    onChange={(event) => setJwtInput(event.target.value)}
                    placeholder="Paste a JWT here"
                  />
                </div>
                <div className="authkit-mode-row authkit-jwt-row">
                  <button
                    type="button"
                    className={jwtMode === 'decode' ? 'authkit-mode-button active' : 'authkit-mode-button'}
                    onClick={() => setJwtMode('decode')}
                  >
                    Decode
                  </button>
                  <button
                    type="button"
                    className={jwtMode === 'encode' ? 'authkit-mode-button active' : 'authkit-mode-button'}
                    onClick={() => setJwtMode('encode')}
                  >
                    Encode payload
                  </button>
                </div>
                <button type="button" className="authkit-primary-button" onClick={handleJwt}>
                  {jwtMode === 'decode' ? 'Decode JWT' : 'Encode payload'}
                </button>
                {jwtResult && (
                  <div className="authkit-result-card">
                    <div className="result-row result-row--space">
                      <span className="result-label">Result</span>
                      <button type="button" onClick={() => handleCopy(jwtResult)}>
                        Copy
                      </button>
                    </div>
                    <pre>{jwtResult}</pre>
                  </div>
                )}
              </>
            )}
          </div>        ) : isQR ? (
          <div className="qr-page">
            <div className="qr-header">
              <p className="qr-eyebrow">QR Generator</p>
              <p className="qr-description">Generate QR codes for URLs or UPI IDs instantly.</p>
            </div>

            <div className="qr-mode-row">
              <button
                type="button"
                className={qrMode === 'url' ? 'qr-mode-button active' : 'qr-mode-button'}
                onClick={() => setQrMode('url')}
              >
                <span className="qr-mode-icon">↗</span>
                URL
              </button>
              <button
                type="button"
                className={qrMode === 'upi' ? 'qr-mode-button active' : 'qr-mode-button'}
                onClick={() => setQrMode('upi')}
              >
                UPI
              </button>
            </div>

              <div className="qr-input-grid">
              {qrMode === 'url' ? (
                <>
                  <div className="qr-url-row">
                    <div className="qr-input-group">
                      <label htmlFor="qr-url-input">Enter URL</label>
                      <input
                        id="qr-url-input"
                        value={qrUrl}
                        onChange={(event) => setQrUrl(event.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <button type="button" className="primary-button" onClick={handleGenerateQr}>
                      Generate QR
                    </button>
                  </div>
                  <p className="qr-hint">Enter the full URL you want to convert into QR code.</p>
                </>
              ) : (
                <>
                  <div className="qr-upi-row">
                    <div className="qr-input-group">
                      <label htmlFor="upi-id-input">UPI ID</label>
                      <input
                        id="upi-id-input"
                        value={upiId}
                        onChange={(event) => setUpiId(event.target.value)}
                        placeholder="example@upi"
                      />
                    </div>
                    <div className="qr-input-group">
                      <label htmlFor="upi-amount-input">Amount (₹)</label>
                      <input
                        id="upi-amount-input"
                        value={upiAmount}
                        onChange={(event) => setUpiAmount(event.target.value)}
                        placeholder="100.00"
                      />
                    </div>
                    <button type="button" className="primary-button qr-amount-button" onClick={handleGenerateQr}>
                      Generate QR
                    </button>
                  </div>
                  <div className="qr-hint-row">
                    <p className="qr-hint">Enter your UPI ID (e.g. name@upi)</p>
                    <p className="qr-hint">Enter the amount (e.g. 100, 500, 1000)</p>
                  </div>
                </>
              )}
            </div>

            {error && <p className="form-error">{error}</p>}
            {feedback && <p className="form-success">{feedback}</p>}

            <div className="qr-result-card">
              <div className="qr-result-placeholder">
                <span className="empty-state-icon">⌘</span>
                <h4>Your QR code will appear here</h4>
                <p>
                  {qrMode === 'url'
                    ? 'Enter a URL above and click Generate QR to get started.'
                    : 'Fill in the UPI ID and amount above and click Generate QR to get started.'}
                </p>
              </div>
            </div>

            <div className="qr-note-card">
              <strong>Note</strong>
              <p>The QR code will contain the UPI payment link. You can scan it using any UPI app to make the payment.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="playground-intro">
              <span className="pulse-icon">{tool.icon}</span>
              <h3>Ready when you are.</h3>
              <p>{tool.description} Enter a value below to start exploring.</p>
            </div>
            <div className="form-panel">
              <label htmlFor="tool-input">{form.label}</label>
              <div className="input-row">
                <input id="tool-input" placeholder={form.placeholder} />
                <button type="button">Run tool <span>→</span></button>
              </div>
              <p className="form-note">Training mode — results will be connected to the backend later.</p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ToolPage
