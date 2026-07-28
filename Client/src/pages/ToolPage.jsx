import { useNavigate, useParams } from 'react-router-dom'

const toolForms = {
  'ip-geo': {
    label: 'IP or domain',
    placeholder: 'example.com',
  },
  'url-shortener': {
    label: 'Destination URL',
    placeholder: 'https://example.com',
  },
  'dns-lookup': {
    label: 'Domain or IP address',
    placeholder: 'example.com',
  },
  'rdap-whois': {
    label: 'Domain or IP address',
    placeholder: 'example.com',
  },
  'request-bin': {
    label: 'Request endpoint',
    placeholder: 'https://requestbin.example',
  },
  'rate-limiter': {
    label: 'Rate test input',
    placeholder: 'Send a request payload',
  },
}

function ToolPage({ tools }) {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const tool = tools.find((item) => item.id === toolId)

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

  const form = toolForms[tool.id] || toolForms['ip-geo']

  return (
    <section className="playground">
      <div className="playground-heading">
        <div className="playground-title">
          <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
          <div>
            <p className="eyebrow">TOOL PLAYGROUND</p>
            <h2>{tool.name}</h2>
          </div>
        </div>
        <button className="close-button" type="button" onClick={() => navigate('/')}>Back to library</button>
      </div>

      <div className="playground-body">
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
      </div>
    </section>
  )
}

export default ToolPage
