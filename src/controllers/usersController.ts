import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

// Validation schemas
const updateConditionsSchema = z.object({
  conditions: z.array(z.string())
});

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  conditions: z.array(z.string()).optional()
});

export const updateUserConditions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const { conditions } = updateConditionsSchema.parse(req.body);

    // Log the conditions being saved for debugging
    console.log('Saving conditions for user:', userId, 'Conditions:', conditions);

    // Update user conditions in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        conditions,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        conditions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Updated user:', updatedUser);

    res.json({
      success: true,
      message: 'Medical conditions updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error updating user conditions:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update user conditions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const updateData = updateProfileSchema.parse(req.body);

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        conditions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        conditions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// New function to get personalized fruit recommendations
export const getPersonalizedFruits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    // Get user with conditions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        conditions: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Get all fruits with their restrictions
    const fruits = await prisma.fruit.findMany({
      include: {
        restrictions: true
      }
    });

    // Filter fruits based on user conditions
    const personalizedFruits = fruits.map(fruit => {
      const userConditions = user.conditions || [];
      const relevantRestrictions = fruit.restrictions.filter(restriction => 
        userConditions.includes(restriction.condition)
      );

      let recommendationLevel = 'neutral';
      let reasons: string[] = [];

      if (relevantRestrictions.length > 0) {
        // Determine the most restrictive level
        const levels = relevantRestrictions.map(r => r.restrictionLevel);
        if (levels.includes('avoid')) {
          recommendationLevel = 'avoid';
        } else if (levels.includes('limit')) {
          recommendationLevel = 'limit';
        } else if (levels.includes('moderate')) {
          recommendationLevel = 'moderate';
        } else if (levels.includes('recommended')) {
          recommendationLevel = 'recommended';
        }

        reasons = relevantRestrictions.map(r => r.reason);
      }

      return {
        ...fruit,
        recommendationLevel,
        reasons,
        restrictions: undefined // Remove detailed restrictions from response
      };
    });

    // Sort fruits by recommendation level (recommended first, avoid last)
    const sortOrder = { recommended: 0, moderate: 1, neutral: 2, limit: 3, avoid: 4 };
    personalizedFruits.sort((a, b) => 
      sortOrder[a.recommendationLevel as keyof typeof sortOrder] - 
      sortOrder[b.recommendationLevel as keyof typeof sortOrder]
    );

    res.json({
      success: true,
      data: {
        fruits: personalizedFruits,
        userConditions: user.conditions
      }
    });

  } catch (error) {
    console.error('Error getting personalized fruits:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get personalized fruit recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
