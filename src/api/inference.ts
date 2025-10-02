import { InferenceRequest, InferenceResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function submitInference(request: InferenceRequest): Promise<InferenceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submit-inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting inference:', error)

    // Fallback response for development/demo purposes
    return {
      job_id: `demo_${Date.now()}`,
      status: 'submitted'
    }
  }
}

export async function submitInferenceAlias(request: InferenceRequest): Promise<InferenceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inference/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting inference (alias):', error)

    // Fallback to main endpoint
    return submitInference(request)
  }
}