import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schemas
const saveUserFruitsSchema = z.object({
  userId: z.number(),
  fruitIds: z.array(z.number())
});

const getUserFruitsSchema = z.object({
  userId: z.string()
});

// Helper function to get current week and year
const getCurrentWeekInfo = () => {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return { week, year: now.getFullYear() };
};

export const saveUserFruits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, fruitIds } = saveUserFruitsSchema.parse(req.body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const { week, year } = getCurrentWeekInfo();

    // Clear existing selections for this user and week
    await prisma.userFruitSelection.deleteMany({
      where: {
        userId: userId,
        week: week,
        year: year
      }
    });

    // Create new selections
    const selections = [];
    for (let i = 0; i < fruitIds.length; i++) {
      const fruitId = fruitIds[i];
      
      // Verify fruit exists
      const fruit = await prisma.fruit.findUnique({
        where: { id: fruitId }
      });

      if (fruit) {
        // Distribute fruits across the week
        const dayOfWeek = i % 7; // 0-6
        const timeOfDay = i % 3 === 0 ? 'morning' : i % 3 === 1 ? 'afternoon' : 'evening';
        
        selections.push({
          userId: userId,
          fruitId: fruitId,
          week: week,
          year: year,
          dayOfWeek: dayOfWeek,
          timeOfDay: timeOfDay,
          quantity: 1
        });
      }
    }

    // Save all selections
    if (selections.length > 0) {
      await prisma.userFruitSelection.createMany({
        data: selections
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'User fruits saved successfully',
        savedCount: selections.length,
        week: week,
        year: year
      }
    });

  } catch (error) {
    console.error('Error saving user fruits:', error);
    
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
      error: 'Failed to save user fruits',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserFruits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getUserFruitsSchema.parse(req.params);
    const userIdNumber = parseInt(userId);

    if (isNaN(userIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
      return;
    }

    const { week, year } = getCurrentWeekInfo();

    // Get user's fruit selections for current week
    const selections = await prisma.userFruitSelection.findMany({
      where: {
        userId: userIdNumber,
        week: week,
        year: year
      },
      include: {
        fruit: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { timeOfDay: 'asc' }
      ]
    });

    // Get unique fruit IDs
    const fruitIds = [...new Set(selections.map(s => s.fruitId))];

    res.status(200).json({
      success: true,
      data: {
        fruitIds: fruitIds,
        selections: selections,
        week: week,
        year: year
      }
    });

  } catch (error) {
    console.error('Error getting user fruits:', error);
    
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
      error: 'Failed to get user fruits',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserFruitsForWeek = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getUserFruitsSchema.parse(req.params);
    const userIdNumber = parseInt(userId);

    if (isNaN(userIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
      return;
    }

    const { week, year } = getCurrentWeekInfo();

    // Get user's fruit selections for current week organized by day
    const selections = await prisma.userFruitSelection.findMany({
      where: {
        userId: userIdNumber,
        week: week,
        year: year
      },
      include: {
        fruit: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { timeOfDay: 'asc' }
      ]
    });

    // Organize by day
    const weekPlan = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let day = 0; day < 7; day++) {
      const daySelections = selections.filter(s => s.dayOfWeek === day);
      
      weekPlan.push({
        day: day + 1,
        dayName: dayNames[day],
        fruits: daySelections.map(s => ({
          fruitId: s.fruitId,
          fruitName: s.fruit.name,
          timeOfDay: s.timeOfDay,
          quantity: s.quantity,
          benefits: s.fruit.benefits,
          notes: s.notes
        }))
      });
    }

    res.status(200).json({
      success: true,
      data: {
        weekPlan: weekPlan,
        totalSelections: selections.length,
        week: week,
        year: year
      }
    });

  } catch (error) {
    console.error('Error getting user fruits for week:', error);
    
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
      error: 'Failed to get user fruits for week',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
