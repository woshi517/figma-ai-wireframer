import { Request, Response } from 'express';
import { z } from 'zod';
import fetch from 'node-fetch';

const ValidateKeyRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required')
});

export async function validateApiKey(req: Request, res: Response) {
  try {
    const { apiKey } = ValidateKeyRequestSchema.parse(req.body);
    
    // Test the API key by making a minimal request to the models endpoint
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API key validation error:', response.status, response.statusText);
      
      let errorMessage = 'Invalid API key';
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your API key may not have the required permissions.';
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits in your OpenRouter account.';
      }
      
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }

    // Try to get user info to provide more details
    try {
      const userResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        return res.json({
          success: true,
          data: {
            valid: true,
            message: 'API key is valid',
            userInfo: {
              email: userData.data?.email || 'Unknown',
              usage: userData.data?.usage || null,
              limit: userData.data?.limit || null
            }
          }
        });
      }
    } catch (userError) {
      // If we can't get user info, the key is still valid
      console.log('Could not fetch user info, but key is valid');
    }

    res.json({
      success: true,
      data: {
        valid: true,
        message: 'API key is valid'
      }
    });

  } catch (error) {
    console.error('Validate API key error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}