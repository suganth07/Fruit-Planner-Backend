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
      // Delete existing plan to create a new one
      await prisma.weeklyPlan.delete({
        where: { id: existingPlan.id }
      });
    }

    // Get user's selected fruits from database or use provided selectedFruits
    let userFruitIds = selectedFruits || [];
    
    if (!selectedFruits || selectedFruits.length === 0) {
      // Try to get from user fruit selections
      const userSelections = await prisma.userFruitSelection.findMany({
        where: {
          userId: userId,
          week: currentWeek,
          year: currentYear
        },
        select: { fruitId: true }
      });
      
      userFruitIds = [...new Set(userSelections.map(s => s.fruitId))];
    }

    // If still no fruits, get recommended fruits from fruit service
    if (userFruitIds.length === 0) {
      // Import and use the fruit recommendation service
      const { FruitRecommendationService } = await import('../services/fruitService');
      const fruitService = new FruitRecommendationService();
      
      const personalizedFruits = await fruitService.getPersonalizedRecommendations(user.conditions || []);
      const recommendedFruits = personalizedFruits
        .filter(f => f.recommendationLevel === 'recommended')
        .slice(0, 7); // Take top 7 recommended fruits
      
      userFruitIds = recommendedFruits.map(f => f.id);
    }

    // Get fruit details for the selected fruits
    const fruits = await prisma.fruit.findMany({
      where: {
        id: { in: userFruitIds }
      }
    });

    if (fruits.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No valid fruits selected or available for planning'
      });
      return;
    }

    // Generate AI-powered weekly plan using selected fruits
    const aiPlan = generateWeeklyPlanFromFruits(fruits, user.conditions || []);

    // Save user fruit selections to database
    if (selectedFruits && selectedFruits.length > 0) {
      // Clear existing selections for this week
      await prisma.userFruitSelection.deleteMany({
        where: {
          userId: userId,
          week: currentWeek,
          year: currentYear
        }
      });

      // Create new selections distributed across the week
      const selections = [];
      for (let i = 0; i < selectedFruits.length; i++) {
        const fruitId = selectedFruits[i];
        const dayOfWeek = i % 7; // 0-6
        const timeOfDay = i % 3 === 0 ? 'morning' : i % 3 === 1 ? 'afternoon' : 'evening';
        
        selections.push({
          userId: userId,
          fruitId: fruitId,
          week: currentWeek,
          year: currentYear,
          dayOfWeek: dayOfWeek,
          timeOfDay: timeOfDay,
          quantity: 1
        });
      }

      if (selections.length > 0) {
        await prisma.userFruitSelection.createMany({
          data: selections
        });
      }
    }

    // Save plan to database
    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        userId: userId,
        week: currentWeek,
        year: currentYear,
        planData: JSON.parse(JSON.stringify(aiPlan.dailyPlans)),
        explanation: aiPlan.explanation,
        nutritionalSummary: JSON.parse(JSON.stringify(aiPlan.nutritionalSummary))
      }
    });

    res.status(201).json({
      success: true,
      data: {
        plan: weeklyPlan,
        explanation: aiPlan.explanation,
        nutritionalSummary: aiPlan.nutritionalSummary,
        fruitsUsed: fruits.length
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

// Helper function to generate weekly plan from selected fruits
const generateWeeklyPlanFromFruits = (fruits: any[], conditions: string[]) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['morning', 'afternoon', 'evening'];
  
  const dailyPlans = [];
  let fruitIndex = 0;
  
  for (let day = 0; day < 7; day++) {
    const dayFruits = [];
    
    // Add 2-3 fruits per day, cycling through selected fruits
    const fruitsPerDay = Math.min(3, Math.max(1, Math.floor(fruits.length / 7) + 1));
    
    for (let meal = 0; meal < fruitsPerDay; meal++) {
      if (fruitIndex >= fruits.length) {
        fruitIndex = 0; // Cycle back to start
      }
      
      const fruit = fruits[fruitIndex];
      const timeOfDay = timeSlots[meal % timeSlots.length];
      
      dayFruits.push({
        fruitName: fruit.name,
        quantity: 1,
        timeOfDay: timeOfDay,
        benefits: fruit.benefits,
        calories: fruit.calories,
        fiber: fruit.fiber,
        vitaminC: fruit.vitaminC
      });
      
      fruitIndex++;
    }
    
    dailyPlans.push({
      day: day + 1,
      dayName: dayNames[day],
      fruits: dayFruits
    });
  }
  
  // Generate nutritional summary
  const totalFruits = dailyPlans.reduce((total, day) => total + day.fruits.length, 0);
  const uniqueFruits = new Set(fruits.map(f => f.name)).size;
  const totalCalories = dailyPlans.reduce((total, day) => 
    total + day.fruits.reduce((dayTotal, fruit) => dayTotal + fruit.calories, 0), 0
  );
  const totalFiber = dailyPlans.reduce((total, day) => 
    total + day.fruits.reduce((dayTotal, fruit) => dayTotal + fruit.fiber, 0), 0
  );
  const totalVitaminC = dailyPlans.reduce((total, day) => 
    total + day.fruits.reduce((dayTotal, fruit) => dayTotal + fruit.vitaminC, 0), 0
  );
  
  const nutritionalSummary = {
    totalFruits: totalFruits,
    varietyCount: uniqueFruits,
    weeklyCalories: Math.round(totalCalories),
    weeklyFiber: Math.round(totalFiber * 10) / 10,
    weeklyVitaminC: Math.round(totalVitaminC * 10) / 10,
    keyNutrients: ['Vitamin C', 'Fiber', 'Antioxidants', 'Natural Sugars'],
    weeklyBenefits: `Personalized nutrition plan with ${uniqueFruits} different fruits providing ${Math.round(totalCalories)} calories and ${Math.round(totalFiber * 10) / 10}g fiber for the week.`
  };
  
  const conditionsText = conditions.length > 0 
    ? ` tailored for ${conditions.map(c => c.replace(/_/g, ' ')).join(', ')}`
    : '';
  
  const explanation = `This personalized weekly fruit plan uses your selected fruits to create a balanced nutrition schedule${conditionsText}. The plan provides variety across the week while ensuring you get optimal nutrition from fruits you've chosen based on your preferences and health conditions.`;
  
  return {
    dailyPlans,
    explanation,
    nutritionalSummary
  };
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
