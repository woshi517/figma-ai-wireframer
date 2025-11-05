import { Request, Response } from 'express';
import { z } from 'zod';
import { UsageResponse, UsageRecord } from '../types.js';
import { getUsageRecords } from './generate-with-key.js';

const UsageRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
});

export async function getUsage(req: Request, res: Response) {
  try {
    const { userId } = UsageRequestSchema.parse(req.body);
    
    // Get all usage records for this user
    const allRecords = getUsageRecords();
    const userRecords = allRecords.filter(record => record.userId === userId);
    
    if (userRecords.length === 0) {
      const response: UsageResponse = {
        success: true,
        data: {
          totalCost: 0,
          totalTokens: 0,
          generations: 0,
          records: [],
          dailyUsage: []
        }
      };
      return res.json(response);
    }

    // Calculate totals
    const totalCost = userRecords.reduce((sum, record) => sum + record.cost, 0);
    const totalTokens = userRecords.reduce((sum, record) => sum + record.totalTokens, 0);
    const generations = userRecords.length;

    // Group by date for daily usage
    const dailyUsageMap = new Map<string, { cost: number; tokens: number; generations: number }>();
    
    userRecords.forEach(record => {
      const date = record.timestamp.split('T')[0]; // Extract date part
      
      if (!dailyUsageMap.has(date)) {
        dailyUsageMap.set(date, { cost: 0, tokens: 0, generations: 0 });
      }
      
      const daily = dailyUsageMap.get(date)!;
      daily.cost += record.cost;
      daily.tokens += record.totalTokens;
      daily.generations += 1;
    });

    // Convert to array and sort by date (most recent first)
    const dailyUsage = Array.from(dailyUsageMap.entries())
      .map(([date, data]) => ({
        date,
        cost: Math.round(data.cost * 10000) / 10000, // Round to 4 decimal places
        tokens: data.tokens,
        generations: data.generations
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Get last 30 days of usage
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRecords = userRecords
      .filter(record => new Date(record.timestamp) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const response: UsageResponse = {
      success: true,
      data: {
        totalCost: Math.round(totalCost * 10000) / 10000, // Round to 4 decimal places
        totalTokens,
        generations,
        records: recentRecords,
        dailyUsage
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Get usage error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      } as UsageResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as UsageResponse);
  }
}