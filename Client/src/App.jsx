import { useEffect, useRef, useState } from 'react'
import { NavLink, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.scss'
import BACKLYLogo from './assets/BACKLY.webp'
import ToolLibrary from './pages/ToolLibrary.jsx'
import ToolPage from './pages/ToolPage.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'

const tools = [
  { id: 'ip-geo', name: 'My IP + Geo', description: 'Find your public IP address and geographic details.', icon: '◎', tag: 'Network' },
  { id: 'url-shortener', name: 'URL Shortner', description: 'Create a clean, shareable link in seconds.', icon: '↗', tag: 'Utility' },
  { id: 'dns-lookup', name: 'DNS Lookup', description: 'Inspect DNS records for any domain.', icon: '⌁', tag: 'Network' },
  { id: 'rdap-whois', name: 'RDAP WHOIS', description: 'Look up domain registration details with RDAP.', icon: '◌', tag: 'Lookup' },
  { id: 'request-bin', name: 'Request Bin', description: 'Inspect HTTP requests sent to a unique endpoint.', icon: '⌘', tag: 'HTTP' },
  { id: 'rate-limiter', name: 'Rate Limiter Demo', description: 'Test how a rate limit responds to requests.', icon: '◴', tag: 'Demo' },
]

function ToolIcon({ children }) {
  return <span className="tool-icon" aria-hidden="true">{children}</span>
}

function matchesSearch(tool, query) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return true

  const searchable = `${tool.name} ${tool.description} ${tool.tag}`.toLowerCase()
  const queryTerms = trimmed.split(/\s+/)
  return queryTerms.every((term) => {
    if (term.length === 1) {
      return searchable
        .split(/[^a-z0-9]+/)
        .some((token) => token.startsWith(term))
    }
    return searchable.includes(term)
  })
}

function App() {
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const location = useLocation()
  const filteredTools = tools.filter((tool) => matchesSearch(tool, query))

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const currentToolId = location.pathname.startsWith('/tool/')
    ? location.pathname.replace('/tool/', '').split('/')[0]
    : null
  const activeToolMatchesQuery = currentToolId ? filteredTools.some((tool) => tool.id === currentToolId) : true

  function ToolPageRoute() {
    if (!activeToolMatchesQuery) {
      return <Navigate to="/" replace />
    }
    return <ToolPage tools={tools} />
  }

  return (
    <Routes location={location}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand brand-link" to="/">
          <span className="brand-mark">
            <img src={BACKLYLogo} alt="BACKLY logo" />
          </span>
          <span>BACKLY</span>
        </NavLink>

        <nav className="sidebar-nav" aria-label="Tools navigation">
          <NavLink className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`} to="/" end>
            <ToolIcon>⌂</ToolIcon>
            <span>Home</span>
          </NavLink>
          <p className="nav-label">TOOLS</p>
          {filteredTools.map((tool) => (
            <NavLink
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
              key={tool.id}
              to={`/tool/${tool.id}`}
            >
              <ToolIcon>{tool.icon}</ToolIcon>
              <span>{tool.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span>Made with efforts by <strong>Nayan Patel</strong>💜</span>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">DEVELOPER WORKSPACE</p>
            <h1>Backend Training</h1>
          </div>
          <div className="header-search">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools..."
              aria-label="Search tools"
            />
            <kbd>⌘ K</kbd>
          </div>
          <NavLink className="signup-link" to="/signup">Create account</NavLink>
        </header>

        <main className="main-content">
          <Routes location={location}>
            <Route path="/" element={<ToolLibrary tools={filteredTools} query={query} />} />
            <Route path="/tool/:toolId" element={<ToolPageRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer>© 2026 BACKLY. All Rights Reserved.</footer>
      </div></div>} />
    </Routes>
  )
}

export default App
