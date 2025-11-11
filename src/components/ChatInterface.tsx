import { useState, useRef, useEffect } from 'react'
import { LLMModel, ChatMessage } from '../types'
import { submitInference, pollJobResult } from '../api/inference'
import './ChatInterface.css'

interface ChatInterfaceProps {
  model: LLMModel
  onBack: () => void
}

function ChatInterface({ model, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `¡Hola! Soy ${model.name}. ${model.description} ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Mensaje temporal mientras procesa
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '🔄 Procesando tu solicitud en el cluster GPU...',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // Enviar el job
      const response = await submitInference({
        prompt: inputMessage,
        model: model.id,
        max_tokens: 1000
      })

      const jobId = response.job_id

      // Actualizar mensaje de loading con Job ID
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: `⏳ Job enviado (ID: ${jobId}). Esperando respuesta del modelo ${model.name}...` }
            : msg
        )
      )

      // Consultar el resultado cada 3 segundos
      const result = await pollJobResult(jobId, 60000) // timeout 60 segundos

      // Reemplazar mensaje de loading con la respuesta real
      const assistantMessage: ChatMessage = {
        id: loadingMessage.id,
        role: 'assistant',
        content: result,
        timestamp: new Date()
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? assistantMessage : msg
        )
      )

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'No se pudo procesar tu solicitud'}`,
        timestamp: new Date()
      }
      
      // Reemplazar mensaje de loading con error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? errorMessage : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-interface">
      <header className="chat-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div className="model-info">
          <span className="model-icon" style={{ background: model.color }}>{model.icon}</span>
          <div>
            <h2 className="model-title">{model.name}</h2>
            <p className="model-subtitle">Modelo de IA especializado</p>
          </div>
        </div>
        <div></div>
      </header>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Escribe tu mensaje para ${model.name}...`}
            disabled={isLoading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
            style={{ background: model.color }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInterface