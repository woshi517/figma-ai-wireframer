import { Request, Response } from 'express';
import { z } from 'zod';
import fetch from 'node-fetch';
import { 
  GenerateRequest, 
  GenerateResponse, 
  WireframeSpec, 
  OpenRouterRequest, 
  OpenRouterResponse 
} from '../types.js';

// Zod schemas for validation
const GenerateRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt too long'),
  userId: z.string().optional()
});

const WireframeChildSchema = z.object({
  type: z.enum(['text', 'component']),
  x: z.number(),
  y: z.number(),
  content: z.string().optional(),
  componentName: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional()
});

const WireframeSpecSchema = z.object({
  type: z.literal('frame'),
  width: z.number().positive(),
  height: z.number().positive(),
  children: z.array(WireframeChildSchema)
});

// System prompt for OpenRouter
const SYSTEM_PROMPT = `You are a Figma expert specializing in wireframe generation. Generate ONLY a valid JSON object representing a wireframe based on the user's description.

Design System Rules:
- Use components from the user's library: Button/Primary, Button/Secondary, Input/Default, Input/Password, Text/Heading, Text/Body, Container/Card, Container/Section
- Spacing: 16px padding, 12px gap between elements
- Typography: Inter font, 14px body text, 20px headings
- Colors: Primary #3B82F6, Secondary #6B7280, Background #FFFFFF
- Standard button size: 120px width, 40px height
- Standard input size: 200px width, 40px height
- Card containers have 16px padding and subtle borders

Output Format:
{
  "type": "frame",
  "width": 375,
  "height": 667,
  "children": [
    {
      "type": "component" | "text",
      "x": 0,
      "y": 0,
      "componentName": "Button/Primary" | "Input/Default" | etc,
      "content": "text content for text elements",
      "width": optional,
      "height": optional
    }
  ]
}

CRITICAL: 
- Return ONLY the JSON object, no markdown formatting
- Ensure all x,y coordinates are within the frame bounds
- Use appropriate component types from the design system
- Make the wireframe look clean and professional`;

export async function generateWireframe(req: Request, res: Response) {
  try {
    // Validate request
    const validatedData = GenerateRequestSchema.parse(req.body);
    
    // Check OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenRouter API key not configured'
      });
    }

    // Prepare OpenRouter request
    const openRouterRequest: OpenRouterRequest = {
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
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
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://figma-ai-wireframer.com',
        'X-Title': 'Figma Wireframe Agent',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openRouterRequest)
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate wireframe'
      });
    }

    const openRouterData = await response.json() as OpenRouterResponse;
    
    if (!openRouterData.choices || openRouterData.choices.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No response from AI model'
      });
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
      });
    }

    // Validate the generated wireframe
    try {
      WireframeSpecSchema.parse(wireframeSpec);
    } catch (validationError) {
      console.error('Invalid wireframe spec:', validationError);
      return res.status(500).json({
        success: false,
        error: 'Generated wireframe does not meet requirements'
      });
    }

    // Return successful response
    const generateResponse: GenerateResponse = {
      success: true,
      data: wireframeSpec
    };

    res.json(generateResponse);

  } catch (error) {
    console.error('Generate wireframe error:', error);
    
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