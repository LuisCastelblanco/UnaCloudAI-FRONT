// src/api/inference.ts
import { InferenceRequest, InferenceResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.24.100.180:8000'

export async function submitInference(
  request: InferenceRequest
): Promise<InferenceResponse> {
  const response = await fetch(`${API_BASE_URL}/api/submit-inference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Para enviar cookies de sesión
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al enviar la inferencia')
  }

  return response.json()
}

// Función para obtener el resultado de un job
export async function getJobResult(jobId: string): Promise<string> {
  return `Job ${jobId} en proceso. Verifica el resultado en la terminal.`
}