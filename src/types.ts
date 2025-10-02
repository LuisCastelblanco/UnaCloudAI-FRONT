export interface LLMModel {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InferenceRequest {
  prompt: string;
  model: string;
  max_tokens: number;
}

export interface InferenceResponse {
  job_id: string;
  status: string;
}