import { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Copy as CopyIcon, Eye, EyeOff, Hash, LoaderCircle, RefreshCw, ShieldCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toolsApi from '../api/tools'

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

function createRandomSalt(length) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_'
  const bytes = new Uint8Array(length)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

function parseJwtJson(value, fieldName) {
  try {
    const parsed = JSON.parse(value)
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error()
    return parsed
  } catch {
    throw new Error(`${fieldName} must be a valid JSON object.`)
  }
}

function isValidJwtJson(value) {
  try {
    const parsed = JSON.parse(value)
    return Boolean(parsed) && !Array.isArray(parsed) && typeof parsed === 'object'
  } catch { return false }
}

function JwtOutput({ token, onCopy }) {
  const [header = '', payload = '', signature = ''] = token.split('.')

  return (
    <aside className="jwt-output-card" aria-label="Encoded JWT preview">
      <div className="jwt-output-head"><div><span>JWT Signature</span><strong>Encoded JWT</strong></div><button type="button" onClick={onCopy} aria-label="Copy encoded JWT"><CopyIcon size={17} /></button></div>
      <code><span className="jwt-token-header">{header}</span>.<span className="jwt-token-payload">{payload}</span>.<span className="jwt-token-signature">{signature}</span></code>
      <div className="jwt-output-note"><ShieldCheck size={16} /><span>Signed by the JWT API. Use Decoder to inspect and verify it.</span></div>
    </aside>
  )
}

function JwtDecodedCard({ title, content, tone }) {
  return (
    <section className={`jwt-decoded-card ${tone}`}>
      <div><span>{title}</span><Check size={15} /></div>
      <pre>{content}</pre>
    </section>
  )
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
  const [qrResult, setQrResult] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
  const [authMode, setAuthMode] = useState('password')
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [passwordResult, setPasswordResult] = useState('')
  const [passwordGenerating, setPasswordGenerating] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordCopyMessage, setPasswordCopyMessage] = useState('')
  const [passwordToolView, setPasswordToolView] = useState('generator')
  const [passwordHealthInput, setPasswordHealthInput] = useState('')
  const [showPasswordHealthInput, setShowPasswordHealthInput] = useState(false)
  const [passwordHealth, setPasswordHealth] = useState(null)
  const [passwordHealthLoading, setPasswordHealthLoading] = useState(false)
  const [passwordHealthError, setPasswordHealthError] = useState('')

  const [hashMethod, setHashMethod] = useState('basic')
  const [hashAction, setHashAction] = useState('generate')
  const [hashText, setHashText] = useState('')
  const [hashSalt, setHashSalt] = useState(() => createRandomSalt(32))
  const [hashSaltLength, setHashSaltLength] = useState(32)
  const [hashValue, setHashValue] = useState('')
  const [hashCostFactor, setHashCostFactor] = useState(10)
  const [hashResult, setHashResult] = useState(null)
  const [hashLoading, setHashLoading] = useState(false)
  const [hashError, setHashError] = useState('')
  const [hashMessage, setHashMessage] = useState('')
  const [showHashText, setShowHashText] = useState(false)
  const [jwtMode, setJwtMode] = useState('decode')
  const [jwtAlgorithm, setJwtAlgorithm] = useState('HS256')
  const [jwtHeader, setJwtHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
  const [jwtPayload, setJwtPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "role": "admin",\n  "iat": 1719820800\n}')
  const [jwtSecret, setJwtSecret] = useState('a-string-secret-at-least-256-bits-long')
  const [jwtExpiresIn, setJwtExpiresIn] = useState('1h')
  const [jwtVerifySecret, setJwtVerifySecret] = useState('')
  const [jwtVerification, setJwtVerification] = useState(null)
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE5ODIwODAwfQ.KMUFsIDTnFmyG3nMiGM6H9FNFUR0f3wh7SmqJp-QV30')
  const [jwtLoading, setJwtLoading] = useState(false)
  const [jwtError, setJwtError] = useState('')
  const isUrlShortener = tool?.id === 'url-shortner'
  const isQR = tool?.id === 'qr'
  const isAuthKit = tool?.id === 'authkit'

  useEffect(() => {
    if (!isUrlShortener) return
    let isCurrent = true

    async function fetchUrls() {
      setHistoryError('')
      try {
        const { data } = await toolsApi.getUrls()
        if (isCurrent) setUrls(data.data || [])
      } catch (fetchError) {
        if (isCurrent) setHistoryError(fetchError.response?.data?.message || '')
      }
    }

    fetchUrls()
    return () => { isCurrent = false }
  }, [isUrlShortener])

  const handleShorten = async () => {
    setError('')
    setFeedback('')

    setLoading(true)

    try {
      const payload = {
        originalUrl: originalUrl.trim(),
      }
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim()
      }

      const { data } = await toolsApi.createShortUrl(payload)

      setResult(data.data)
      setFeedback('Short URL created successfully.')
      setOriginalUrl('')
      setCustomAlias(data.data.customAlias || '')
      setUrls((current) => [data.data, ...current])
    } catch (postError) {
      setError(postError.response?.data?.message || '')
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

  const handleCopyPassword = async () => {
    if (!passwordResult) return
    try {
      await navigator.clipboard.writeText(passwordResult)
      setPasswordCopyMessage('Password copied to clipboard.')
    } catch {
      setPasswordCopyMessage('Unable to copy the password.')
    }
  }

  const handleGenerateQr = async () => {
    setError('')
    setFeedback('')
    setQrLoading(true)

    try {
      const response = qrMode === 'url'
        ? await toolsApi.generateUrlQr({ url: qrUrl.trim() })
        : await toolsApi.generateUpiQr({
          upiId: upiId.trim(),
          name: 'BACKLY',
          amount: upiAmount ? Number(upiAmount) : undefined,
        })
      setQrResult(response.data.data?.qr || '')
      setFeedback(response.data.message || '')
    } catch (requestError) {
      setError(requestError.response?.data?.message || '')
      setQrResult('')
    } finally {
      setQrLoading(false)
    }
  }

  const handleGeneratePassword = async () => {
    if (passwordGenerating) return
    setPasswordError('')
    setPasswordCopyMessage('')
    setPasswordGenerating(true)

    try {
      const { data } = await toolsApi.generatePassword({
        length: passwordLength,
        uppercase: includeUpper,
        lowercase: includeLower,
        numbers: includeNumbers,
        symbols: includeSymbols,
      })
      setPasswordResult(data.data?.password || '')
    } catch (requestError) {
      setPasswordError(requestError.response?.data?.message || '')
    } finally {
      setPasswordGenerating(false)
    }
  }

  const handlePasswordHealthCheck = async () => {
    setPasswordHealthError('')
    setPasswordHealth(null)
    if (!passwordHealthInput) return

    setPasswordHealthLoading(true)
    try {
      const { data } = await toolsApi.passwordStrength({ password: passwordHealthInput })
      setPasswordHealth(data.data)
    } catch (requestError) {
      setPasswordHealthError(requestError.response?.data?.message || '')
    } finally {
      setPasswordHealthLoading(false)
    }
  }

  const updateHashField = (setter) => (event) => {
    setter(event.target.value)
    setHashError('')
    setHashMessage('')
  }

  const generateRandomSalt = (length = hashSaltLength) => {
    setHashSalt(createRandomSalt(length))
    setHashError('')
  }

  const changeHashMethod = (method) => {
    setHashMethod(method)
    setHashAction('generate')
    setHashText('')
    setHashSalt(method === 'basic' ? '' : createRandomSalt(32))
    setHashValue('')
    setHashSaltLength(32)
    setHashCostFactor(10)
    setHashResult(null)
    setHashError('')
    setHashMessage('')
    setShowHashText(false)
  }

  const handleHasher = async () => {
    const needsSalt = hashMethod !== 'basic'
    setHashError('')
    setHashMessage('')

    if (!hashText.trim()) {
      setHashError('Enter the text or password to hash.')
      return
    }
    if (needsSalt && hashSalt.trim().length < 4) {
      setHashError('Salt must be at least 4 characters.')
      return
    }
    if (hashAction === 'verify' && !hashValue.trim()) {
      setHashError('Paste a bcrypt hash to verify.')
      return
    }

    const payload = { text: hashText.trim() }
    if (needsSalt) payload.salt = hashSalt.trim()
    if (hashAction === 'generate') payload.costFactor = hashCostFactor
    else payload.hash = hashValue.trim()

    const endpoint = hashMethod === 'basic'
      ? (hashAction === 'generate' ? toolsApi.generateBasicHash : toolsApi.verifyBasicHash)
      : hashMethod === 'salt'
        ? (hashAction === 'generate' ? toolsApi.generateSaltHash : toolsApi.verifySaltHash)
        : (hashAction === 'generate' ? toolsApi.generateSaltPepperHash : toolsApi.verifySaltPepperHash)

    setHashLoading(true)
    try {
      const { data } = await endpoint(payload)
      setHashResult(data.data || null)
      setHashMessage(data.message || (hashAction === 'generate' ? 'Hash generated.' : 'Verification complete.'))
    } catch (requestError) {
      setHashResult(null)
      setHashError(requestError.response?.data?.message || requestError.message || 'Unable to process this hash.')
    } finally {
      setHashLoading(false)
    }
  }

  const handleJwt = async () => {
    setJwtError('')
    setJwtLoading(true)

    try {
      if (jwtMode === 'encode') {
        const header = parseJwtJson(jwtHeader, 'Header')
        const payload = parseJwtJson(jwtPayload, 'Payload')
        if (header.alg && header.alg !== jwtAlgorithm) {
          throw new Error('Header algorithm must match the selected algorithm.')
        }
        if (header.typ && header.typ !== 'JWT') {
          throw new Error("Header type must be 'JWT'.")
        }
        const { data } = await toolsApi.encodeJwt({
          header,
          payload,
          algorithm: jwtAlgorithm,
          secret: jwtSecret,
          expiresIn: jwtExpiresIn.trim() || undefined,
        })
        setJwtInput(data.data?.token || '')
        setFeedback(data.message || '')
      } else {
        const { data } = await toolsApi.decodeJwt({ token: jwtInput.trim() })
        setJwtHeader(JSON.stringify(data.data?.header || {}, null, 2))
        setJwtPayload(JSON.stringify(data.data?.payload || {}, null, 2))
        setFeedback(data.message || '')
      }
    } catch (requestError) {
      setJwtError(requestError.response?.data?.message || requestError.message || '')
    } finally {
      setJwtLoading(false)
    }
  }

  const handleGenerateJwtSecret = async () => {
    setJwtError('')
    try {
      const { data } = await toolsApi.generateJwtSecret({ bits: jwtAlgorithm === 'HS512' ? 512 : jwtAlgorithm === 'HS384' ? 384 : 256 })
      setJwtSecret(data.data?.secret || '')
      setFeedback('A secure signing secret was generated.')
    } catch (requestError) {
      setJwtError(requestError.response?.data?.message || requestError.message || 'Unable to generate a signing secret.')
    }
  }

  const handleJwtVerify = async () => {
    setJwtError('')
    setJwtVerification(null)
    if (!jwtVerifySecret.trim()) {
      setJwtError('Enter the signing secret to verify this token.')
      return
    }
    setJwtLoading(true)
    try {
      const { data } = await toolsApi.verifyJwt({ token: jwtInput.trim(), secret: jwtVerifySecret })
      setJwtVerification(data.data)
      setFeedback(data.message || '')
    } catch (requestError) {
      setJwtError(requestError.response?.data?.message || requestError.message || 'JWT verification failed.')
    } finally {
      setJwtLoading(false)
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
          <button className="close-button" type="button" onClick={() => navigate('/home')}>Back to library</button>
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
        <button className="close-button" type="button" onClick={() => navigate('/home')}>
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
                maxLength={7}
                onChange={(event) => {
                  setCustomAlias(event.target.value)
                  setError('')
                  setFeedback('')
                }}
                placeholder="short123"
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {feedback && <p className="form-success">{feedback}</p>}

            {result && (
              <div className="result-card simple-result-card short-url-result-card">
                <div className="result-row result-row--space">
                  <span className="result-label">Short URL</span>
                  <button type="button" onClick={() => handleCopy(result.shortUrl)}>
                    Copy
                  </button>
                </div>
                <a className="short-url-link" href={result.shortUrl} target="_blank" rel="noreferrer">
                  {result.shortUrl}
                </a>
                <div className="short-url-details">
                  <div><span>Original URL</span><strong>{result.originalUrl}</strong></div>
                  <div><span>Status</span><strong className={result.isActive === false ? 'url-status inactive' : 'url-status'}>{result.isActive === false ? 'Inactive' : 'Active'}</strong></div>
                  <div><span>Alias</span><strong>{result.customAlias || result.shortCode}</strong></div>
                  <div><span>Expires</span><strong>{result.expiresAt || 'Never'}</strong></div>
                </div>
              </div>
            )}

            <div className="short-url-table-card">
              <div className="table-header">
                <h4>Your shortened links</h4>
              </div>
              {historyError && <p className="form-error short-url-history-error" role="alert">{historyError}</p>}
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
                        <td data-label="Original URL">
                          <a href={item.originalUrl} target="_blank" rel="noreferrer">
                            {item.originalUrl}
                          </a>
                        </td>
                        <td data-label="Short URL">
                          <a href={item.shortUrl} target="_blank" rel="noreferrer">
                            {item.shortUrl}
                          </a>
                        </td>
                        <td data-label="Custom alias">{item.customAlias || item.shortCode}</td>
                        <td data-label="Created">{formatDate(item.createdAt)}</td>
                        <td data-label="Actions">
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
                  <h2>Strong Passwords, Instantly.</h2>
                  <p>Create unique passwords that keep your accounts safe.</p>
                </div>
                <section className="authkit-password-card" aria-labelledby="password-generator-title">
                {passwordToolView === 'generator' ? (
                  <>
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
                      onClick={handleCopyPassword}
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
                {passwordError && <p className="password-health-error" role="alert">{passwordError}</p>}
                {passwordCopyMessage && <p className="password-copy-message" role="status">{passwordCopyMessage}</p>}
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
                <button type="button" className="password-health-entry" onClick={() => setPasswordToolView('health')}>
                  Check your password&apos;s health here <span aria-hidden="true">→</span>
                </button>
                  </>
                ) : (
                  <div className="password-health-checker">
                    <button type="button" className="password-health-back" onClick={() => setPasswordToolView('generator')}><ArrowLeft size={15} /> Back to generator</button>
                    <div className="authkit-card-heading">
                      <h3 id="password-generator-title">Password Health Checker</h3>
                      <p>Check how resilient a password is before you use it.</p>
                    </div>
                    <label className="password-health-field" htmlFor="password-health-input">
                      <span>Password to check</span>
                      <div className="password-health-input-wrap">
                        <input id="password-health-input" type={showPasswordHealthInput ? 'text' : 'password'} value={passwordHealthInput} onChange={(event) => { setPasswordHealthInput(event.target.value); setPasswordHealth(null); setPasswordHealthError('') }} placeholder="Enter a password" />
                        <button type="button" onClick={() => setShowPasswordHealthInput((current) => !current)} aria-label={showPasswordHealthInput ? 'Hide password' : 'Reveal password'}>{showPasswordHealthInput ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                      </div>
                    </label>
                    <button type="button" className="authkit-primary-button password-health-submit" onClick={handlePasswordHealthCheck} disabled={!passwordHealthInput || passwordHealthLoading}>
                      {passwordHealthLoading ? <LoaderCircle className="authkit-spinner" size={16} aria-hidden="true" /> : 'Check health'}
                    </button>
                    {passwordHealthError && <p className="password-health-error" role="alert">{passwordHealthError}</p>}
                    <div className="password-health-result" aria-live="polite">
                      <div className="authkit-strength-row"><span>Password health</span><span className="strength-label">{passwordHealth ? passwordHealth.strength : 'Waiting for analysis'}</span></div>
                      <div className="authkit-strength-bar"><div className={`authkit-strength-fill ${passwordHealth ? `health-${passwordHealth.score}` : ''}`} style={{ width: `${passwordHealth?.percentage || 0}%` }} /></div>
                      <p>{passwordHealth ? `${passwordHealth.score}/${passwordHealth.maxScore} strength score from the security API.` : 'The health score from the backend will appear here.'}</p>
                    </div>
                  </div>
                )}
                </section>
              </div>
            ) : authMode === 'hasher' ? (
              <section className="hasher-workspace" aria-label="Bcrypt hash utility">
                <div className="hasher-promo">
                  <span className="hasher-promo-icon"><Hash size={23} /></span>
                  <div><h2>Secure Hashes,<br /><em>Every Time.</em></h2><p>Generate and verify bcrypt hashes using Basic, Salt, or Salt + Pepper protection.</p></div>
                </div>
                <div className="hasher-card">
                  <div className="hasher-tabs" role="tablist" aria-label="Hash method">
                    {[['basic', 'Basic Hash'], ['salt', 'Salt Hash'], ['salt-pepper', 'Salt + Pepper Hash']].map(([value, label]) => (
                      <button key={value} type="button" role="tab" aria-selected={hashMethod === value} className={hashMethod === value ? 'active' : ''} onClick={() => changeHashMethod(value)}>{label}</button>
                    ))}
                  </div>
                  <div className="hasher-action-toggle" aria-label="Hash action">
                    <button type="button" className={hashAction === 'generate' ? 'active' : ''} onClick={() => { setHashAction('generate'); setHashResult(null) }}>Generate</button>
                    <button type="button" className={hashAction === 'verify' ? 'active' : ''} onClick={() => { setHashAction('verify'); setHashResult(null) }}>Verify</button>
                  </div>
                  <label className="hasher-field" htmlFor="hasher-text"><span>{hashAction === 'generate' ? 'Text or password' : 'Original text or password'}</span><div className="hasher-secret-input"><input id="hasher-text" type={showHashText ? 'text' : 'password'} value={hashText} onChange={updateHashField(setHashText)} placeholder="Enter text..." /><button type="button" onClick={() => setShowHashText((value) => !value)} aria-label={showHashText ? 'Hide text' : 'Show text'}>{showHashText ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
                  {hashMethod !== 'basic' && <div className="hasher-salt-section"><label className="hasher-field" htmlFor="hasher-salt"><span>Salt</span><input id="hasher-salt" value={hashSalt} onChange={updateHashField(setHashSalt)} placeholder="Secure random salt" /></label><label className="hasher-field hasher-range-field" htmlFor="hasher-salt-length"><span>Salt length <b>{hashSaltLength}</b></span><input id="hasher-salt-length" type="range" min="8" max="64" value={hashSaltLength} onChange={(event) => { const length = Number(event.target.value); setHashSaltLength(length); generateRandomSalt(length) }} /><small>8 <i>{hashSaltLength} characters</i> 64</small></label></div>}
                  {hashAction === 'generate' ? <label className="hasher-field hasher-range-field" htmlFor="hasher-cost"><span>Salt rounds <b>{hashCostFactor}</b></span><input id="hasher-cost" type="range" min="4" max="19" value={hashCostFactor} onChange={(event) => setHashCostFactor(Number(event.target.value))} /><small>4 <i>{hashCostFactor} rounds</i> 19</small></label> : <label className="hasher-field" htmlFor="hasher-hash"><span>Bcrypt hash to verify</span><textarea id="hasher-hash" value={hashValue} onChange={updateHashField(setHashValue)} placeholder="$2b$10$..." /></label>}
                  <button type="button" className="hasher-submit" onClick={handleHasher} disabled={hashLoading}>{hashLoading ? <LoaderCircle className="authkit-spinner" size={18} /> : <Hash size={18} />}{hashLoading ? 'Processing…' : hashAction === 'generate' ? 'Generate Hash' : 'Verify Hash'}</button>
                  {hashError && <p className="hasher-error" role="alert">{hashError}</p>}
                  {hashMessage && <p className="hasher-success" role="status">{hashMessage}</p>}
                  {hashResult && <div className={`hasher-result ${hashAction === 'verify' ? (hashResult.isValid ? 'is-valid' : 'is-invalid') : ''}`}><div><span>{hashAction === 'generate' ? 'Generated bcrypt hash' : 'Verification result'}</span>{hashAction === 'generate' ? <button type="button" onClick={() => handleCopy(hashResult.hash)}> <CopyIcon size={15} /> Copy</button> : <strong>{hashResult.isValid ? 'Valid hash' : 'Hash does not match'}</strong>}</div>{hashAction === 'generate' && <code>{hashResult.hash}</code>}<small>bcrypt · {hashResult.method}{hashResult.costFactor ? ` · ${hashResult.costFactor} rounds` : ''}</small></div>}
                  <p className="hasher-note"><ShieldCheck size={16} /> Salt + Pepper keeps the pepper secret on the server; it is never exposed to the browser.</p>
                </div>
              </section>
            ) : (
              <section className="jwt-workspace" aria-label="JWT debugger">
                <div className="jwt-tabs" role="tablist" aria-label="JWT debugger mode">
                  <button type="button" role="tab" aria-selected={jwtMode === 'decode'} className={jwtMode === 'decode' ? 'active' : ''} onClick={() => setJwtMode('decode')}>JWT Decoder</button>
                  <button type="button" role="tab" aria-selected={jwtMode === 'encode'} className={jwtMode === 'encode' ? 'active' : ''} onClick={() => setJwtMode('encode')}>JWT Encoder</button>
                </div>

                {jwtMode === 'encode' ? (
                  <div className="jwt-grid">
                    <div className="jwt-editor-stack">
                      <div className="jwt-editor-label"><span>Header</span><span className={isValidJwtJson(jwtHeader) ? 'jwt-valid' : 'jwt-invalid'}>{isValidJwtJson(jwtHeader) ? <><Check size={14} /> Valid JSON</> : 'Invalid JSON'}</span></div>
                      <label className="jwt-editor-card" htmlFor="jwt-header">
                        <span className="jwt-editor-title">Algorithm &amp; Token Type</span>
                        <textarea id="jwt-header" value={jwtHeader} onChange={(event) => setJwtHeader(event.target.value)} spellCheck="false" />
                      </label>
                      <div className="jwt-editor-label"><span>Payload</span><span className={isValidJwtJson(jwtPayload) ? 'jwt-valid' : 'jwt-invalid'}>{isValidJwtJson(jwtPayload) ? <><Check size={14} /> Valid JSON</> : 'Invalid JSON'}</span></div>
                      <label className="jwt-editor-card" htmlFor="jwt-payload">
                        <span className="jwt-editor-title">Data</span>
                        <textarea id="jwt-payload" value={jwtPayload} onChange={(event) => setJwtPayload(event.target.value)} spellCheck="false" />
                      </label>
                      <div className="jwt-signing-row">
                        <label className="jwt-secret-field" htmlFor="jwt-secret"><span>Signing secret <button type="button" onClick={handleGenerateJwtSecret}>Generate secure secret</button></span><input id="jwt-secret" value={jwtSecret} onChange={(event) => setJwtSecret(event.target.value)} /></label>
                        <label className="jwt-algorithm-field" htmlFor="jwt-algorithm"><span>Algorithm</span><div><select id="jwt-algorithm" value={jwtAlgorithm} onChange={(event) => { const algorithm = event.target.value; setJwtAlgorithm(algorithm); setJwtHeader(JSON.stringify({ alg: algorithm, typ: 'JWT' }, null, 2)) }}><option>HS256</option><option>HS384</option><option>HS512</option></select><ChevronDown size={16} /></div></label>
                        <label className="jwt-expiry-field" htmlFor="jwt-expiry"><span>Expires in</span><input id="jwt-expiry" value={jwtExpiresIn} onChange={(event) => setJwtExpiresIn(event.target.value)} placeholder="e.g. 1h" /></label>
                      </div>
                      <button type="button" className="jwt-submit" onClick={handleJwt} disabled={jwtLoading}>{jwtLoading ? <LoaderCircle className="authkit-spinner" size={16} /> : <ShieldCheck size={17} />} {jwtLoading ? 'Generating…' : 'Generate signed JWT'}</button>
                    </div>
                    <JwtOutput token={jwtInput} onCopy={() => handleCopy(jwtInput)} />
                  </div>
                ) : (
                  <div className="jwt-decode-layout">
                    <div className="jwt-token-entry">
                      <div className="jwt-editor-label"><span>Encoded JWT</span><button type="button" onClick={() => setJwtInput('')}>Clear</button></div>
                      <textarea value={jwtInput} onChange={(event) => setJwtInput(event.target.value)} spellCheck="false" aria-label="Encoded JWT" />
                      <button type="button" className="jwt-submit" onClick={handleJwt} disabled={jwtLoading}>{jwtLoading ? <LoaderCircle className="authkit-spinner" size={16} /> : <RefreshCw size={17} />} {jwtLoading ? 'Decoding…' : 'Decode token'}</button>
                    </div>
                    <div className="jwt-decoded-grid">
                      <JwtDecodedCard title="Header" content={jwtHeader} tone="header" />
                      <JwtDecodedCard title="Payload" content={jwtPayload} tone="payload" />
                      <div className={`jwt-verify-card ${jwtVerification ? 'verified' : ''}`}><ShieldCheck size={20} /><div><strong>{jwtVerification?.isValid ? 'Signature verified' : 'Verify the JWT signature'}</strong><span>{jwtVerification?.isValid ? `Valid ${jwtVerification.algorithm} token.` : 'Enter the signing secret to cryptographically verify this token.'}</span><div className="jwt-verify-action"><input type="password" value={jwtVerifySecret} onChange={(event) => { setJwtVerifySecret(event.target.value); setJwtVerification(null) }} placeholder="Signing secret" aria-label="JWT verification secret" /><button type="button" onClick={handleJwtVerify} disabled={jwtLoading || !jwtInput.trim()}>{jwtLoading ? 'Verifying…' : 'Verify signature'}</button></div></div></div>
                    </div>
                  </div>
                )}
                {jwtError && <p className="jwt-error" role="alert">{jwtError}</p>}
                {feedback && <p className="jwt-feedback"><Check size={14} /> {feedback}</p>}
              </section>
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
                onClick={() => { setQrMode('url'); setError(''); setFeedback(''); setQrResult('') }}
              >
                <span className="qr-mode-icon">↗</span>
                URL
              </button>
              <button
                type="button"
                className={qrMode === 'upi' ? 'qr-mode-button active' : 'qr-mode-button'}
                onClick={() => { setQrMode('upi'); setError(''); setFeedback(''); setQrResult('') }}
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
                        onChange={(event) => { setQrUrl(event.target.value); setError(''); setFeedback('') }}
                        placeholder="https://example.com"
                      />
                    </div>
                    <button type="button" className="primary-button" onClick={handleGenerateQr} disabled={qrLoading}>
                      {qrLoading ? 'Generating…' : 'Generate QR'}
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
                        onChange={(event) => { setUpiId(event.target.value); setError(''); setFeedback('') }}
                        placeholder="example@upi"
                      />
                    </div>
                    <div className="qr-input-group">
                      <label htmlFor="upi-amount-input">Amount (₹)</label>
                      <input
                        id="upi-amount-input"
                        value={upiAmount}
                        onChange={(event) => { setUpiAmount(event.target.value); setError(''); setFeedback('') }}
                        placeholder="100.00"
                      />
                    </div>
                    <button type="button" className="primary-button qr-amount-button" onClick={handleGenerateQr} disabled={qrLoading}>
                      {qrLoading ? 'Generating…' : 'Generate QR'}
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
              {qrResult ? (
                <div className="qr-result-image">
                  <img src={qrResult} alt={`Generated QR code for ${qrMode === 'url' ? 'URL' : 'UPI payment'}`} />
                  <p>Scan this QR code with a compatible app.</p>
                </div>
              ) : (
                <div className="qr-result-placeholder">
                  <span className="empty-state-icon">⌘</span>
                  <h4>Your QR code will appear here</h4>
                  <p>
                    {qrMode === 'url'
                      ? 'Enter a URL above and click Generate QR to get started.'
                      : 'Fill in the UPI ID and amount above and click Generate QR to get started.'}
                  </p>
                </div>
              )}
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
