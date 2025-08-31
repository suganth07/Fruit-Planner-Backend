import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { MedicalCondition } from '../types';

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

    // Update user conditions in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { conditions },
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
      data: updateData,
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
