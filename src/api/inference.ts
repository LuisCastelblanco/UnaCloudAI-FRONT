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
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al enviar la inferencia')
  }

  return response.json()
}

interface JobResultResponse {
  job_id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'not_found'
  response?: string
  error: boolean
  message?: string
}

// Función para consultar el resultado de un job
export async function getJobResult(jobId: string): Promise<JobResultResponse> {
  const response = await fetch(`${API_BASE_URL}/api/job-result?job_id=${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error consultando el resultado del job')
  }

  return response.json()
}

// Función para consultar el resultado con polling (reintenta hasta que esté listo)
export async function pollJobResult(
  jobId: string,
  timeout: number = 60000 // 60 segundos por defecto
): Promise<string> {
  const startTime = Date.now()
  const pollInterval = 3000 // 3 segundos

  while (Date.now() - startTime < timeout) {
    const result = await getJobResult(jobId)

    if (result.status === 'completed' && result.response) {
      return result.response
    }

    if (result.status === 'failed' || result.error) {
      throw new Error(result.message || 'El job falló')
    }

    if (result.status === 'not_found') {
      throw new Error('Job no encontrado')
    }

    // Esperar antes de volver a consultar
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error('Timeout: El job tardó demasiado en completarse')
}