import { LLMModel } from '../types'
import './ModelSelector.css'

interface ModelSelectorProps {
  models: LLMModel[]
  onModelSelect: (model: LLMModel) => void
}

function ModelSelector({ models, onModelSelect }: ModelSelectorProps) {
  return (
    <div className="model-selector">
      <div className="container">
        <header className="header">
          <h1 className="title">UnaCloudAI</h1>
          <p className="subtitle">Elige el modelo de IA que mejor se adapte a tus necesidades</p>
        </header>

        <div className="models-grid">
          {models.map((model) => (
            <div
              key={model.id}
              className="model-card"
              onClick={() => onModelSelect(model)}
              style={{ '--accent-color': model.color } as React.CSSProperties}
            >
              <div className="model-icon">{model.icon}</div>
              <h3 className="model-name">{model.name}</h3>
              <p className="model-description">{model.description}</p>
              <div className="model-button">
                <span>Comenzar chat</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>Powered by UnaCloudAI • Tecnología de vanguardia en IA</p>
        </footer>
      </div>
    </div>
  )
}

export default ModelSelector