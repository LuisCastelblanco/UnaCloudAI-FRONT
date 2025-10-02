import { useState } from 'react'
import ModelSelector from './components/ModelSelector'
import ChatInterface from './components/ChatInterface'
import { LLMModel } from './types'
import './App.css'

const models: LLMModel[] = [
  {
    id: 'senecoder',
    name: 'SeneCoder',
    description: 'Especializado en tareas de programación y desarrollo de código. Perfecto para resolver problemas técnicos, debug, y escribir código de calidad.',
    color: '#3B82F6',
    icon: '💻'
  },
  {
    id: 'seneacademico',
    name: 'SeneAcademico',
    description: 'Diseñado para trabajos investigativos y análisis profundos. Ideal para investigación académica, análisis de documentos y escritura científica.',
    color: '#10B981',
    icon: '📚'
  },
  {
    id: 'seneca',
    name: 'Seneca',
    description: 'Modelo versátil para tareas variadas y conversaciones generales. Tu asistente para todo tipo de consultas y proyectos diversos.',
    color: '#8B5CF6',
    icon: '🧠'
  }
]

function App() {
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null)

  const handleModelSelect = (model: LLMModel) => {
    setSelectedModel(model)
  }

  const handleBackToModels = () => {
    setSelectedModel(null)
  }

  return (
    <div className="app">
      {!selectedModel ? (
        <ModelSelector models={models} onModelSelect={handleModelSelect} />
      ) : (
        <ChatInterface model={selectedModel} onBack={handleBackToModels} />
      )}
    </div>
  )
}

export default App