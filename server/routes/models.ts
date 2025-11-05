import { Request, Response } from 'express';
import { z } from 'zod';
import fetch from 'node-fetch';
import { ModelsResponse, ModelInfo } from '../types.js';

// Cache models for 1 hour to avoid excessive API calls
let cachedModels: ModelInfo[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const ModelsRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required')
});

export async function getModels(req: Request, res: Response) {
  try {
    const { apiKey } = ModelsRequestSchema.parse(req.body);
    
    // Check cache first
    const now = Date.now();
    if (cachedModels && (now - cacheTimestamp) < CACHE_DURATION) {
      const response: ModelsResponse = {
        success: true,
        data: cachedModels
      };
      return res.json(response);
    }

    // Fetch models from OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('OpenRouter models API error:', response.status, response.statusText);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch models from OpenRouter'
      } as ModelsResponse);
    }

    const data = await response.json() as any;
    
    if (!data.data || !Array.isArray(data.data)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from OpenRouter models API'
      } as ModelsResponse);
    }

    // Filter and transform models to our format
    const models: ModelInfo[] = data.data
      .filter((model: any) => {
        // Filter for models that support chat completions
        return model.id && 
               model.name && 
               model.pricing &&
               !model.id.includes('vision') && // Exclude vision models for now
               !model.id.includes('image');   // Exclude image models
      })
      .map((model: any): ModelInfo => ({
        id: model.id,
        name: model.name,
        description: model.description,
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || '0'),
          completion: parseFloat(model.pricing?.completion || '0')
        },
        context_length: model.context_length || 4096,
        top_provider: model.top_provider
      }))
      .sort((a: ModelInfo, b: ModelInfo) => a.name.localeCompare(b.name));

    // Cache the results
    cachedModels = models;
    cacheTimestamp = now;

    const modelsResponse: ModelsResponse = {
      success: true,
      data: models
    };

    res.json(modelsResponse);

  } catch (error) {
    console.error('Get models error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      } as ModelsResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ModelsResponse);
  }
}