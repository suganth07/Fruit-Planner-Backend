import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface WeeklyPlanRequest {
  userId: number;
  userConditions: string[];
  selectedFruits: number[];
  preferences: {
    mealsPerDay?: number;
    servingsPerMeal?: number;
    variety?: boolean;
  };
}

interface DailyPlan {
  day: number; // 0-6 (Sunday-Saturday)
  dayName: string;
  fruits: {
    fruitId: number;
    fruitName: string;
    timeOfDay: string; // 'morning', 'afternoon', 'evening'
    quantity: number;
    benefits: string;
  }[];
}

interface WeeklyPlanResponse {
  dailyPlans: DailyPlan[];
  explanation: string;
  nutritionalSummary: {
    totalCalories: number;
    totalFiber: number;
    totalVitaminC: number;
    avgGlycemicIndex: number;
    varietyScore: number;
  };
}

// Fruit database (simplified - in real app this would come from database)
const fruitDatabase = [
  { id: 1, name: 'Apple', calories: 52, fiber: 2.4, vitaminC: 4.6, glycemicIndex: 38, benefits: 'Rich in fiber, helps lower cholesterol' },
  { id: 2, name: 'Banana', calories: 89, fiber: 2.6, vitaminC: 8.7, glycemicIndex: 62, benefits: 'High in potassium, supports muscle function' },
  { id: 3, name: 'Orange', calories: 47, fiber: 2.4, vitaminC: 53.2, glycemicIndex: 45, benefits: 'Excellent source of vitamin C' },
  { id: 4, name: 'Strawberry', calories: 32, fiber: 2.0, vitaminC: 58.8, glycemicIndex: 40, benefits: 'Low in calories, high antioxidants' },
  { id: 5, name: 'Kiwi', calories: 61, fiber: 3.0, vitaminC: 92.7, glycemicIndex: 58, benefits: 'High vitamin C, aids digestion' },
  { id: 6, name: 'Blueberry', calories: 57, fiber: 2.4, vitaminC: 9.7, glycemicIndex: 53, benefits: 'High antioxidants, improves memory' },
  { id: 7, name: 'Grapes', calories: 62, fiber: 0.9, vitaminC: 3.2, glycemicIndex: 59, benefits: 'Rich in antioxidants, supports heart health' },
  { id: 8, name: 'Mango', calories: 60, fiber: 1.6, vitaminC: 36.4, glycemicIndex: 60, benefits: 'Rich in vitamin A, supports eye health' },
];

export const generateWeeklyPlan = async (request: WeeklyPlanRequest): Promise<WeeklyPlanResponse> => {
  try {
    const { userConditions, selectedFruits, preferences } = request;
    
    // Get selected fruits data
    const availableFruits = selectedFruits.length > 0 
      ? fruitDatabase.filter(fruit => selectedFruits.includes(fruit.id))
      : fruitDatabase;

    // Create AI prompt
    const prompt = createAIPrompt(userConditions, availableFruits, preferences);

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // Parse AI response and create structured plan
    const weeklyPlan = parseAIResponse(aiText, availableFruits);

    return weeklyPlan;

  } catch (error) {
    console.error('Error generating weekly plan with AI:', error);
    
    // Fallback: Generate a basic plan without AI
    return generateFallbackPlan(request);
  }
};

function createAIPrompt(conditions: string[], fruits: any[], preferences: any): string {
  const conditionsText = conditions.length > 0 ? conditions.join(', ') : 'none';
  const fruitsText = fruits.map(f => `${f.name} (${f.calories} cal, ${f.fiber}g fiber, ${f.vitaminC}mg vitamin C)`).join(', ');
  
  return `
As a nutrition expert, create a personalized weekly fruit meal plan with the following requirements:

USER PROFILE:
- Medical conditions: ${conditionsText}
- Meals per day: ${preferences.mealsPerDay || 3}
- Servings per meal: ${preferences.servingsPerMeal || 1}
- Variety preference: ${preferences.variety ? 'High variety' : 'Simple plan'}

AVAILABLE FRUITS:
${fruitsText}

REQUIREMENTS:
1. Create a 7-day plan (Sunday to Saturday)
2. Consider medical conditions when selecting fruits
3. Distribute fruits across different times of day (morning, afternoon, evening)
4. Balance nutrition across the week
5. Provide specific benefits for each fruit choice
6. Ensure variety in the plan

Please respond in this exact JSON format:
{
  "dailyPlans": [
    {
      "day": 0,
      "dayName": "Sunday",
      "fruits": [
        {
          "fruitName": "Apple",
          "timeOfDay": "morning",
          "quantity": 1,
          "benefits": "Rich in fiber, helps lower cholesterol"
        }
      ]
    }
  ],
  "explanation": "This plan is designed for someone with [conditions]. The fruits are selected to...",
  "nutritionalHighlights": "Total weekly intake provides... Focus on vitamin C from..."
}

Create a complete 7-day plan following this format.
`;
}

function parseAIResponse(aiText: string, availableFruits: any[]): WeeklyPlanResponse {
  try {
    // Try to extract JSON from AI response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Map fruit names to IDs and add missing data
      const dailyPlans: DailyPlan[] = parsed.dailyPlans.map((day: any) => ({
        day: day.day,
        dayName: day.dayName,
        fruits: day.fruits.map((fruit: any) => {
          const fruitData = availableFruits.find(f => 
            f.name.toLowerCase() === fruit.fruitName.toLowerCase()
          );
          
          return {
            fruitId: fruitData?.id || 1,
            fruitName: fruit.fruitName,
            timeOfDay: fruit.timeOfDay,
            quantity: fruit.quantity || 1,
            benefits: fruit.benefits
          };
        })
      }));

      // Calculate nutritional summary
      const nutritionalSummary = calculateNutritionalSummary(dailyPlans, availableFruits);

      return {
        dailyPlans,
        explanation: parsed.explanation || 'AI-generated personalized meal plan',
        nutritionalSummary
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback if parsing fails
  throw new Error('Failed to parse AI response');
}

function generateFallbackPlan(request: WeeklyPlanRequest): WeeklyPlanResponse {
  const { selectedFruits, preferences } = request;
  const availableFruits = selectedFruits.length > 0 
    ? fruitDatabase.filter(fruit => selectedFruits.includes(fruit.id))
    : fruitDatabase.slice(0, 5); // Use first 5 fruits as fallback

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['morning', 'afternoon', 'evening'];
  const mealsPerDay = preferences.mealsPerDay || 3;

  const dailyPlans: DailyPlan[] = dayNames.map((dayName, dayIndex) => {
    const fruits = [];
    
    for (let mealIndex = 0; mealIndex < mealsPerDay; mealIndex++) {
      const fruitIndex = (dayIndex + mealIndex) % availableFruits.length;
      const fruit = availableFruits[fruitIndex];
      
      fruits.push({
        fruitId: fruit.id,
        fruitName: fruit.name,
        timeOfDay: timeSlots[mealIndex % timeSlots.length],
        quantity: preferences.servingsPerMeal || 1,
        benefits: fruit.benefits
      });
    }

    return {
      day: dayIndex,
      dayName,
      fruits
    };
  });

  const nutritionalSummary = calculateNutritionalSummary(dailyPlans, availableFruits);

  return {
    dailyPlans,
    explanation: 'This is a balanced weekly fruit plan created based on your selected fruits and preferences.',
    nutritionalSummary
  };
}

function calculateNutritionalSummary(dailyPlans: DailyPlan[], fruitDatabase: any[]) {
  let totalCalories = 0;
  let totalFiber = 0;
  let totalVitaminC = 0;
  let totalGlycemicIndex = 0;
  let fruitCount = 0;
  const uniqueFruits = new Set();

  dailyPlans.forEach(day => {
    day.fruits.forEach(fruit => {
      const fruitData = fruitDatabase.find(f => f.id === fruit.fruitId);
      if (fruitData) {
        totalCalories += fruitData.calories * fruit.quantity;
        totalFiber += fruitData.fiber * fruit.quantity;
        totalVitaminC += fruitData.vitaminC * fruit.quantity;
        totalGlycemicIndex += fruitData.glycemicIndex;
        fruitCount++;
        uniqueFruits.add(fruit.fruitId);
      }
    });
  });

  return {
    totalCalories: Math.round(totalCalories),
    totalFiber: Math.round(totalFiber * 10) / 10,
    totalVitaminC: Math.round(totalVitaminC * 10) / 10,
    avgGlycemicIndex: fruitCount > 0 ? Math.round(totalGlycemicIndex / fruitCount) : 0,
    varietyScore: uniqueFruits.size
  };
}
