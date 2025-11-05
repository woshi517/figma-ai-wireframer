import { Request, Response } from 'express';
import { z } from 'zod';
import fetch from 'node-fetch';
import { 
  GenerateWithKeyRequest, 
  GenerateWithKeyResponse, 
  WireframeSpec, 
  OpenRouterRequest, 
  OpenRouterResponse,
  UsageRecord
} from '../types.js';

// Zod schemas for validation
const GenerateWithKeyRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt too long'),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model is required'),
  userId: z.string().optional()
});

const WireframeChildSchema = z.object({
  type: z.enum(['text', 'component', 'container']),
  x: z.number().optional(),
  y: z.number().optional(),
  content: z.string().optional(),
  componentName: z.string().optional(),
  width: z.union([z.number(), z.enum(['stretch', 'hug'])]).optional(),
  height: z.union([z.number(), z.enum(['stretch', 'hug'])]).optional(),
  layoutAlign: z.enum(['stretch', 'center', 'min', 'max']).optional(),
  layoutGrow: z.number().optional(),
  layoutMode: z.enum(['vertical', 'horizontal']).optional(),
  itemSpacing: z.number().optional(),
  padding: z.union([z.number(), z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional()
  })]).optional(),
  children: z.array(z.any()).optional()
});

const WireframeSpecSchema = z.object({
  type: z.literal('frame'),
  width: z.number().positive(),
  height: z.number().positive().optional(),
  layoutMode: z.enum(['vertical', 'horizontal']).optional(),
  itemSpacing: z.number().optional(),
  padding: z.union([z.number(), z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional()
  })]).optional(),
  children: z.array(WireframeChildSchema)
});

// System prompt for OpenRouter
const SYSTEM_PROMPT = `You are a Figma expert specializing in wireframe generation. Generate ONLY a valid JSON object representing a wireframe based on the user's description.

Design System Rules:
- Use auto-generated components: Button/Primary, Button/Secondary, Input/Default, Input/Password, Text/Heading, Text/Body, Container/Card, Container/Section
- Spacing: 16px padding, 12px gap between elements
- Typography: Inter font, 14px body text, 20px headings
- Colors: Primary #3B82F6, Secondary #6B7280, Background #FFFFFF
- Standard button size: 120px width, 40px height
- Standard input size: 200px width, 40px height
- Card containers have 16px padding and subtle borders
- Use auto-layout (layoutMode: "vertical" or "horizontal") for better structure
- Set appropriate x,y coordinates or use auto-layout positioning

Available Components:
- Button/Primary: Blue primary button with white text
- Button/Secondary: Gray secondary button with dark text
- Input/Default: Text input field with border
- Input/Password: Password input field with masked text
- Text/Heading: Large bold text (24px)
- Text/Body: Regular body text (14px)
- Container/Card: White container with 16px padding
- Container/Section: Light gray section container

Output Format:
{
  "type": "frame",
  "width": 375,
  "height": 667,
  "layoutMode": "vertical",
  "itemSpacing": 16,
  "padding": 16,
  "children": [
    {
      "type": "component" | "text" | "container",
      "x": 0,
      "y": 0,
      "componentName": "Button/Primary" | "Input/Default" | etc,
      "content": "text content for text elements",
      "width": optional,
      "height": optional,
      "layoutMode": "vertical" | "horizontal",
      "itemSpacing": 12,
      "padding": 16
    }
  ]
}

CRITICAL: 
- Return ONLY the JSON object, no markdown formatting
- Ensure all x,y coordinates are within the frame bounds
- Use appropriate component types from the design system
- Make the wireframe look clean and professional
- Use auto-layout for better component organization
- For mobile screens, use width: 375, height: 667 (iPhone SE dimensions)
- For desktop screens, use width: 1200, height: 800`;

// In-memory storage for usage records (in production, use a database)
const usageRecords: UsageRecord[] = [];

export async function generateWithKey(req: Request, res: Response) {
  try {
    // Validate request
    const validatedData = GenerateWithKeyRequestSchema.parse(req.body);
    
    // Prepare OpenRouter request
    const openRouterRequest: OpenRouterRequest = {
      model: validatedData.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Generate a wireframe for: ${validatedData.prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${validatedData.apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://figma-ai-wireframer.com',
        'X-Title': 'Figma Wireframe Agent',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openRouterRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      
      let errorMessage = 'Failed to generate wireframe';
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits in your OpenRouter account';
      }
      
      return res.status(500).json({
        success: false,
        error: errorMessage
      } as GenerateWithKeyResponse);
    }

    const openRouterData = await response.json() as OpenRouterResponse;
    
    if (!openRouterData.choices || openRouterData.choices.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No response from AI model'
      } as GenerateWithKeyResponse);
    }

    // Extract and parse JSON content
    const content = openRouterData.choices[0].message.content;
    let wireframeSpec: WireframeSpec;

    try {
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      wireframeSpec = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return res.status(500).json({
        success: false,
        error: 'Invalid response format from AI model'
      } as GenerateWithKeyResponse);
    }

    // Validate the generated wireframe
    try {
      WireframeSpecSchema.parse(wireframeSpec);
    } catch (validationError) {
      console.error('Invalid wireframe spec:', validationError);
      return res.status(500).json({
        success: false,
        error: 'Generated wireframe does not meet requirements'
      } as GenerateWithKeyResponse);
    }

    // Calculate cost (this would need model pricing info)
    const usage = openRouterData.usage;
    let cost = 0;
    
    if (usage) {
      // Get model pricing (this is a simplified calculation)
      // In a real implementation, you'd fetch the actual pricing from the models API
      const promptCostPer1M = 0.001; // Default fallback
      const completionCostPer1M = 0.002; // Default fallback
      
      cost = (usage.prompt_tokens / 1000000) * promptCostPer1M + 
             (usage.completion_tokens / 1000000) * completionCostPer1M;
    }

    // Record usage if userId is provided
    if (validatedData.userId && usage) {
      const usageRecord: UsageRecord = {
        userId: validatedData.userId,
        timestamp: new Date().toISOString(),
        model: validatedData.model,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        cost: cost,
        prompt: validatedData.prompt
      };
      
      usageRecords.push(usageRecord);
      
      // Keep only last 1000 records per user to prevent memory issues
      const userRecords = usageRecords.filter(r => r.userId === validatedData.userId);
      if (userRecords.length > 1000) {
        const toRemove = userRecords.slice(0, userRecords.length - 1000);
        toRemove.forEach(record => {
          const index = usageRecords.indexOf(record);
          if (index > -1) {
            usageRecords.splice(index, 1);
          }
        });
      }
    }

    // Return successful response
    const generateResponse: GenerateWithKeyResponse = {
      success: true,
      data: wireframeSpec,
      usage: usage ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        cost: cost
      } : undefined
    };

    res.json(generateResponse);

  } catch (error) {
    console.error('Generate with key error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      } as GenerateWithKeyResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as GenerateWithKeyResponse);
  }
}

// Export usage records for the usage endpoint
export function getUsageRecords(): UsageRecord[] {
  return usageRecords;
}