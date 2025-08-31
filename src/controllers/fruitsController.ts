import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
