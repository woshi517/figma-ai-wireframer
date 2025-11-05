import { WireframeSpec, WireframeChild, GenerateRequest, GenerateResponse, ComponentMap } from '../shared/types.js';

export { WireframeSpec, WireframeChild, GenerateRequest, GenerateResponse, ComponentMap };

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: number;  // per 1M tokens
    completion: number; // per 1M tokens
  };
  context_length: number;
  top_provider?: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}

export interface UsageRecord {
  userId: string;
  timestamp: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  prompt?: string;
}

export interface GenerateWithKeyRequest {
  prompt: string;
  apiKey: string;
  model: string;
  userId?: string;
}

export interface GenerateWithKeyResponse {
  success: boolean;
  data?: WireframeSpec;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  error?: string;
}

export interface ModelsResponse {
  success: boolean;
  data?: ModelInfo[];
  error?: string;
}

export interface UsageResponse {
  success: boolean;
  data?: {
    totalCost: number;
    totalTokens: number;
    generations: number;
    records: UsageRecord[];
    dailyUsage: Array<{
      date: string;
      cost: number;
      tokens: number;
      generations: number;
    }>;
  };
  error?: string;
}