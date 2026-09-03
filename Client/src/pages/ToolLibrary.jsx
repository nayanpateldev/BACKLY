import { Link } from 'react-router-dom'

function ToolLibrary({ tools }) {
  return (
    <section className="tool-library">
      <div className="page-intro">
        <span className="intro-orb" />
        <div>
          <p className="eyebrow">TOOL PLAYGROUND</p>
          <h2>Everything you need,<br />in <span className="highlight">one place.</span></h2>
          <p className="intro-copy">A focused collection of practical tools for exploring backend fundamentals.</p>
        </div>
      </div>

      <div className="tools-list">
        {tools.map((tool, index) => (
          <Link className="tool-card" key={tool.id} to={`/tool/${tool.id}`}>
            <span className="tool-number">0{index + 1}</span>
            <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
            <span className="tool-card-copy">
              <span className="tool-card-title">{tool.name}</span>
              <span>{tool.description}</span>
            </span>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ToolLibrary
