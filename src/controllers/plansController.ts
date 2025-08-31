import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schemas
const createPlanSchema = z.object({
  selectedFruits: z.array(z.number()).optional(),
  preferences: z.object({
    mealsPerDay: z.number().optional(),
    servingsPerMeal: z.number().optional(),
    variety: z.boolean().optional()
  }).optional(),
  userId: z.number(),
  week: z.number().optional(),
  year: z.number().optional()
});

const getPlansSchema = z.object({
  userId: z.string()
});

const deletePlanSchema = z.object({
  planId: z.string()
});

// Helper function to get week number
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const generatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, selectedFruits, preferences } = createPlanSchema.parse(req.body);

    // Get user data including medical conditions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
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

    // Get current week and year
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();

    // Check if plan already exists for this week
    const existingPlan = await prisma.weeklyPlan.findFirst({
      where: {
        userId: userId,
        week: currentWeek,
        year: currentYear
      }
    });

    if (existingPlan) {
      res.status(200).json({
        success: true,
        data: {
          plan: existingPlan,
          message: 'Plan already exists for this week'
        }
      });
      return;
    }

    // Generate fallback plan for now
    const aiPlan = {
      dailyPlans: [
        { 
          day: 1, 
          dayName: 'Monday', 
          fruits: [
            { fruitName: 'Apple', quantity: 1, timeOfDay: 'morning', benefits: 'Rich in fiber' },
            { fruitName: 'Banana', quantity: 1, timeOfDay: 'afternoon', benefits: 'High in potassium' }
          ]
        },
        { 
          day: 2, 
          dayName: 'Tuesday', 
          fruits: [
            { fruitName: 'Orange', quantity: 1, timeOfDay: 'morning', benefits: 'High in Vitamin C' },
            { fruitName: 'Grapes', quantity: 1, timeOfDay: 'evening', benefits: 'Antioxidants' }
          ]
        },
        { 
          day: 3, 
          dayName: 'Wednesday', 
          fruits: [
            { fruitName: 'Kiwi', quantity: 1, timeOfDay: 'morning', benefits: 'Vitamin C and fiber' },
            { fruitName: 'Strawberry', quantity: 1, timeOfDay: 'afternoon', benefits: 'Low calories, high nutrients' }
          ]
        },
        { 
          day: 4, 
          dayName: 'Thursday', 
          fruits: [
            { fruitName: 'Mango', quantity: 1, timeOfDay: 'morning', benefits: 'Rich in vitamin A' },
            { fruitName: 'Pineapple', quantity: 1, timeOfDay: 'evening', benefits: 'Digestive enzymes' }
          ]
        },
        { 
          day: 5, 
          dayName: 'Friday', 
          fruits: [
            { fruitName: 'Blueberry', quantity: 1, timeOfDay: 'morning', benefits: 'Antioxidants and brain health' },
            { fruitName: 'Peach', quantity: 1, timeOfDay: 'afternoon', benefits: 'Vitamin A and C' }
          ]
        },
        { 
          day: 6, 
          dayName: 'Saturday', 
          fruits: [
            { fruitName: 'Cherry', quantity: 1, timeOfDay: 'morning', benefits: 'Anti-inflammatory' },
            { fruitName: 'Watermelon', quantity: 1, timeOfDay: 'evening', benefits: 'Hydration and lycopene' }
          ]
        },
        { 
          day: 7, 
          dayName: 'Sunday', 
          fruits: [
            { fruitName: 'Papaya', quantity: 1, timeOfDay: 'morning', benefits: 'Digestive health' },
            { fruitName: 'Pomegranate', quantity: 1, timeOfDay: 'afternoon', benefits: 'Heart health' }
          ]
        }
      ],
      explanation: 'This is a balanced weekly fruit plan designed to provide variety and essential nutrients throughout the week.',
      nutritionalSummary: {
        totalFruits: 14,
        varietyCount: 14,
        keyNutrients: ['Vitamin C', 'Fiber', 'Antioxidants', 'Potassium'],
        weeklyBenefits: 'Improved digestion, immune support, heart health, and antioxidant protection'
      }
    };

    // Save plan to database
    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        userId: userId,
        week: currentWeek,
        year: currentYear,
        planData: JSON.parse(JSON.stringify(aiPlan.dailyPlans)), // Ensure proper JSON format
        explanation: aiPlan.explanation,
        nutritionalSummary: JSON.parse(JSON.stringify(aiPlan.nutritionalSummary)) // Ensure proper JSON format
      }
    });

    res.status(201).json({
      success: true,
      data: {
        plan: weeklyPlan,
        explanation: aiPlan.explanation,
        nutritionalSummary: aiPlan.nutritionalSummary
      }
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    
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
      error: 'Failed to generate weekly plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getPlansSchema.parse(req.params);
    const userIdNumber = parseInt(userId);

    if (isNaN(userIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
      return;
    }

    const plans = await prisma.weeklyPlan.findMany({
      where: {
        userId: userIdNumber
      },
      orderBy: [
        { year: 'desc' },
        { week: 'desc' }
      ],
      take: 10 // Limit to last 10 plans
    });

    res.json({
      success: true,
      data: {
        plans,
        total: plans.length
      }
    });

  } catch (error) {
    console.error('Error fetching user plans:', error);
    
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
      error: 'Failed to fetch user plans',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCurrentWeekPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getPlansSchema.parse(req.params);
    const userIdNumber = parseInt(userId);

    if (isNaN(userIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
      return;
    }

    // Get current week and year
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();

    const currentPlan = await prisma.weeklyPlan.findFirst({
      where: {
        userId: userIdNumber,
        week: currentWeek,
        year: currentYear
      }
    });

    if (!currentPlan) {
      res.status(404).json({
        success: false,
        error: 'No plan found for current week'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        plan: currentPlan
      }
    });

  } catch (error) {
    console.error('Error fetching current week plan:', error);
    
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
      error: 'Failed to fetch current week plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = deletePlanSchema.parse(req.params);
    const planIdNumber = parseInt(planId);

    if (isNaN(planIdNumber)) {
      res.status(400).json({
        success: false,
        error: 'Invalid plan ID'
      });
      return;
    }

    // Check if plan exists
    const existingPlan = await prisma.weeklyPlan.findUnique({
      where: { id: planIdNumber }
    });

    if (!existingPlan) {
      res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
      return;
    }

    // Delete the plan
    await prisma.weeklyPlan.delete({
      where: { id: planIdNumber }
    });

    res.json({
      success: true,
      data: {
        message: 'Plan deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting plan:', error);
    
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
      error: 'Failed to delete plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
