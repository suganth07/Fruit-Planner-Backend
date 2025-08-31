import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fruitRecommendationService } from '../services/fruitService';

const prisma = new PrismaClient();

// Get all fruits without personalization
export const getAllFruits = async (req: Request, res: Response) => {
  try {
    const fruits = await prisma.fruit.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Transform fruits to match the frontend interface
    const transformedFruits = fruits.map(fruit => ({
      id: fruit.id,
      name: fruit.name,
      benefits: fruit.benefits,
      glycemicIndex: fruit.glycemicIndex,
      sugarContent: fruit.sugarContent,
      calories: fruit.calories,
      fiber: fruit.fiber,
      vitaminC: fruit.vitaminC,
      potassium: fruit.potassium,
      image: fruit.image,
      recommendationLevel: 'neutral' as const,
      reasons: []
    }));

    res.json({
      success: true,
      fruits: transformedFruits,
      message: `Found ${transformedFruits.length} fruits`
    });
  } catch (error) {
    console.error('Error fetching all fruits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fruits',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get personalized fruit recommendations based on user's medical conditions
export const getPersonalizedFruits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }

    // Get user's medical conditions
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { conditions: true, name: true }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get personalized recommendations
    const personalizedFruits = await fruitRecommendationService.getPersonalizedRecommendations(user.conditions);

    // Get recommendation summary
    const summary = await fruitRecommendationService.getRecommendationSummary(user.conditions);

    res.json({
      success: true,
      fruits: personalizedFruits,
      summary,
      userConditions: user.conditions,
      message: `Generated personalized recommendations for ${user.name}`
    });

  } catch (error) {
    console.error('Error fetching personalized fruits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personalized fruits',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get recommended fruits only (for quick access)
export const getRecommendedFruits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }

    // Get user's medical conditions
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { conditions: true }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get personalized recommendations
    const allRecommendations = await fruitRecommendationService.getPersonalizedRecommendations(user.conditions);
    
    // Filter only recommended fruits
    const recommendedFruits = allRecommendations.filter(fruit => fruit.recommendationLevel === 'recommended');

    res.json({
      success: true,
      fruits: recommendedFruits,
      count: recommendedFruits.length,
      userConditions: user.conditions,
      message: `Found ${recommendedFruits.length} recommended fruits`
    });

  } catch (error) {
    console.error('Error fetching recommended fruits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommended fruits',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
