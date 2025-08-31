import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FruitRecommendation {
  id: number;
  name: string;
  benefits: string;
  glycemicIndex: number;
  sugarContent: number;
  calories: number;
  fiber: number;
  vitaminC: number;
  potassium: number;
  image: string | null;
  recommendationLevel: 'recommended' | 'moderate' | 'limit' | 'avoid' | 'neutral';
  reasons: string[];
  score: number; // Priority score for ranking
}

// Comprehensive disease-to-fruit recommendations mapping
const DISEASE_FRUIT_RECOMMENDATIONS = {
  'diabetes_type_1': {
    recommended: [
      { name: 'Blueberries', reasons: ['Low glycemic index (53)', 'High antioxidants help with blood sugar control', 'Rich in fiber to slow glucose absorption'] },
      { name: 'Strawberries', reasons: ['Very low glycemic index (40)', 'High vitamin C boosts immune system', 'Natural fiber helps regulate blood sugar'] },
      { name: 'Blackberries', reasons: ['Low glycemic index (25)', 'High fiber content slows sugar absorption', 'Antioxidants reduce inflammation'] },
      { name: 'Raspberries', reasons: ['Low glycemic index (32)', 'Excellent fiber content', 'Low sugar content safe for diabetics'] },
      { name: 'Avocado', reasons: ['Extremely low glycemic index (10)', 'Healthy fats help insulin sensitivity', 'Rich in fiber and potassium'] },
      { name: 'Cherries', reasons: ['Low glycemic index (22)', 'Anti-inflammatory properties', 'May help improve insulin sensitivity'] },
      { name: 'Apricot', reasons: ['Low to moderate glycemic index (57)', 'Good fiber content', 'Rich in vitamin A and antioxidants'] }
    ],
    moderate: [
      { name: 'Apple', reasons: ['Moderate glycemic index (36)', 'Good fiber in skin', 'Natural sugars with fiber help slow absorption'] },
      { name: 'Orange', reasons: ['Moderate glycemic index (45)', 'High vitamin C', 'Fiber helps with blood sugar control'] },
      { name: 'Peach', reasons: ['Moderate glycemic index (56)', 'Good vitamin C content', 'Natural fiber content'] },
      { name: 'Plum', reasons: ['Moderate glycemic index (24)', 'Antioxidants and fiber', 'Relatively low sugar content'] }
    ],
    limit: [
      { name: 'Grape', reasons: ['Higher glycemic index (62)', 'Higher natural sugar content', 'Consume in small portions only'] },
      { name: 'Cantaloupe', reasons: ['High glycemic index (65)', 'High sugar content', 'Should be limited and paired with protein'] },
      { name: 'Pineapple', reasons: ['High glycemic index (84)', 'Very high sugar content', 'Consume only in very small amounts'] }
    ],
    avoid: [
      { name: 'Watermelon', reasons: ['Very high glycemic index (80)', 'High sugar content with low fiber', 'Can cause rapid blood sugar spikes'] },
      { name: 'Dates', reasons: ['Extremely high glycemic index (103)', 'Very concentrated sugar content', 'Not suitable for diabetic diet'] }
    ]
  },
  
  'diabetes_type_2': {
    recommended: [
      { name: 'Blueberries', reasons: ['Improves insulin sensitivity', 'Low glycemic index helps blood sugar control', 'Antioxidants reduce diabetic complications'] },
      { name: 'Strawberries', reasons: ['Low glycemic index (40)', 'High fiber helps glucose control', 'Vitamin C supports immune system'] },
      { name: 'Blackberries', reasons: ['Excellent for blood sugar control', 'High fiber and low sugar', 'Antioxidants reduce inflammation'] },
      { name: 'Raspberries', reasons: ['Very low impact on blood sugar', 'High fiber content', 'May improve insulin function'] },
      { name: 'Avocado', reasons: ['Healthy fats improve insulin sensitivity', 'Nearly zero carbs', 'Helps with weight management'] },
      { name: 'Cherries', reasons: ['Anti-inflammatory properties', 'May reduce insulin resistance', 'Low glycemic impact'] },
      { name: 'Apple', reasons: ['Pectin fiber helps blood sugar control', 'Antioxidants support metabolic health', 'Moderate glycemic index when eaten whole'] }
    ],
    moderate: [
      { name: 'Orange', reasons: ['Good vitamin C for immune support', 'Fiber helps slow sugar absorption', 'Moderate glycemic index'] },
      { name: 'Kiwi', reasons: ['Good fiber content', 'Low to moderate glycemic index', 'Rich in vitamin C'] },
      { name: 'Peach', reasons: ['Moderate sugar content', 'Good fiber when eaten with skin', 'Provides essential vitamins'] }
    ],
    limit: [
      { name: 'Banana', reasons: ['Higher glycemic index when ripe', 'Higher carb content', 'Choose green/unripe bananas if consumed'] },
      { name: 'Mango', reasons: ['Higher sugar content', 'Higher glycemic index', 'Limit to small portions'] },
      { name: 'Grape', reasons: ['Concentrated natural sugars', 'Higher glycemic index', 'Easy to overconsume'] }
    ],
    avoid: [
      { name: 'Watermelon', reasons: ['Very high glycemic index', 'Low fiber, high sugar', 'Can cause blood sugar spikes'] },
      { name: 'Dates', reasons: ['Extremely high in concentrated sugars', 'Very high glycemic index', 'Not suitable for diabetic management'] }
    ]
  },

  'hypertension': {
    recommended: [
      { name: 'Banana', reasons: ['High potassium helps lower blood pressure', 'Natural ACE inhibitor properties', 'Magnesium supports heart health'] },
      { name: 'Avocado', reasons: ['High potassium (975mg per cup)', 'Healthy fats support heart health', 'May help reduce blood pressure'] },
      { name: 'Orange', reasons: ['High potassium and vitamin C', 'Folate supports cardiovascular health', 'Natural nitrates help blood flow'] },
      { name: 'Cantaloupe', reasons: ['Excellent potassium source', 'High water content helps hydration', 'Low sodium fruit'] },
      { name: 'Honeydew', reasons: ['High potassium content', 'Natural diuretic properties', 'Low sodium'] },
      { name: 'Kiwi', reasons: ['High potassium and vitamin C', 'May help reduce blood pressure', 'Antioxidants support heart health'] },
      { name: 'Pomegranate', reasons: ['Natural ACE inhibitors', 'Antioxidants improve blood flow', 'May help reduce systolic blood pressure'] }
    ],
    moderate: [
      { name: 'Apple', reasons: ['Moderate potassium content', 'Fiber supports heart health', 'Antioxidants beneficial for circulation'] },
      { name: 'Grape', reasons: ['Resveratrol supports heart health', 'Natural compounds may help blood pressure', 'Antioxidant properties'] }
    ],
    limit: [
      { name: 'Coconut', reasons: ['High saturated fat content', 'High calorie density', 'May not support blood pressure goals'] }
    ],
    avoid: []
  },

  'high_cholesterol': {
    recommended: [
      { name: 'Avocado', reasons: ['Monounsaturated fats lower LDL cholesterol', 'High fiber binds cholesterol', 'Phytosterols block cholesterol absorption'] },
      { name: 'Apple', reasons: ['Pectin fiber reduces cholesterol absorption', 'Antioxidants prevent LDL oxidation', 'Soluble fiber lowers cholesterol'] },
      { name: 'Orange', reasons: ['Pectin and soluble fiber lower cholesterol', 'Vitamin C prevents oxidative damage', 'Flavonoids improve lipid profile'] },
      { name: 'Strawberries', reasons: ['High fiber content', 'Antioxidants protect against cholesterol oxidation', 'May help raise HDL cholesterol'] },
      { name: 'Blueberries', reasons: ['Antioxidants improve cholesterol profile', 'Fiber helps reduce LDL cholesterol', 'Pterostilbene lowers cholesterol'] },
      { name: 'Pomegranate', reasons: ['Antioxidants prevent LDL oxidation', 'May reduce cholesterol buildup in arteries', 'Supports overall heart health'] }
    ],
    moderate: [
      { name: 'Grape', reasons: ['Resveratrol may help cholesterol levels', 'Antioxidants support heart health', 'Moderate fiber content'] },
      { name: 'Kiwi', reasons: ['Good fiber content', 'Vitamin C supports heart health', 'Natural antioxidants'] }
    ],
    limit: [
      { name: 'Coconut', reasons: ['High in saturated fats', 'May raise LDL cholesterol', 'High calorie content'] }
    ],
    avoid: []
  },

  'heart_disease': {
    recommended: [
      { name: 'Blueberries', reasons: ['Anthocyanins reduce heart disease risk', 'Anti-inflammatory properties', 'Improve blood vessel function'] },
      { name: 'Strawberries', reasons: ['High in heart-protective antioxidants', 'Anti-inflammatory compounds', 'Support healthy blood pressure'] },
      { name: 'Avocado', reasons: ['Monounsaturated fats protect heart', 'Potassium supports heart rhythm', 'May reduce cardiovascular risk'] },
      { name: 'Orange', reasons: ['Folate supports heart health', 'Vitamin C strengthens blood vessels', 'Potassium helps heart function'] },
      { name: 'Pomegranate', reasons: ['Powerful antioxidants protect arteries', 'May improve blood flow', 'Reduces inflammation in heart'] },
      { name: 'Apple', reasons: ['Quercetin protects heart health', 'Soluble fiber supports circulation', 'Anti-inflammatory properties'] }
    ],
    moderate: [
      { name: 'Grape', reasons: ['Resveratrol supports heart health', 'Antioxidants protect blood vessels', 'Moderate consumption beneficial'] },
      { name: 'Cherry', reasons: ['Anti-inflammatory properties', 'Antioxidants support heart health', 'May help reduce heart disease markers'] }
    ],
    limit: [
      { name: 'Coconut', reasons: ['High saturated fat may stress heart', 'High calorie density', 'Not optimal for heart health'] }
    ],
    avoid: []
  },

  'obesity': {
    recommended: [
      { name: 'Apple', reasons: ['High fiber promotes satiety', 'Low calorie density', 'Pectin helps feel full longer'] },
      { name: 'Strawberries', reasons: ['Very low calorie (32 per cup)', 'High water content', 'Natural sweetness satisfies cravings'] },
      { name: 'Blueberries', reasons: ['Low calorie but very nutritious', 'High fiber promotes fullness', 'Antioxidants support metabolism'] },
      { name: 'Blackberries', reasons: ['Extremely high fiber content', 'Low calorie density', 'Helps control appetite'] },
      { name: 'Raspberries', reasons: ['Highest fiber content of berries', 'Very low calories', 'Natural appetite suppressant'] },
      { name: 'Watermelon', reasons: ['Very low calorie (46 per cup)', 'High water content promotes fullness', 'Natural diuretic properties'] },
      { name: 'Cantaloupe', reasons: ['Low calorie, high volume', 'High water content', 'Natural sweetness without excess calories'] }
    ],
    moderate: [
      { name: 'Orange', reasons: ['Moderate calories with good fiber', 'Vitamin C supports metabolism', 'Natural sugars provide energy'] },
      { name: 'Kiwi', reasons: ['Good fiber for satiety', 'Moderate calorie content', 'Digestive enzymes may help metabolism'] }
    ],
    limit: [
      { name: 'Avocado', reasons: ['Very high calorie density', 'High fat content', 'Easy to overconsume calories'] },
      { name: 'Banana', reasons: ['Higher calorie content', 'Higher carbohydrate density', 'Easy to eat multiple servings'] },
      { name: 'Grape', reasons: ['Higher sugar concentration', 'Easy to overconsume', 'Calorie-dense for portion size'] }
    ],
    avoid: [
      { name: 'Dates', reasons: ['Extremely high calorie density', 'Very high sugar content', 'Easy to overconsume calories'] },
      { name: 'Coconut', reasons: ['Very high calorie and fat content', 'Calorie-dense', 'Not suitable for weight loss'] }
    ]
  },

  'kidney_stone': {
    recommended: [
      { name: 'Lemon', reasons: ['Citric acid prevents stone formation', 'Natural stone dissolving properties', 'Increases urine citrate levels'] },
      { name: 'Lime', reasons: ['High citric acid content', 'Helps prevent calcium oxalate stones', 'Natural diuretic properties'] },
      { name: 'Orange', reasons: ['Good citric acid content', 'High water content aids hydration', 'Potassium helps prevent stones'] },
      { name: 'Watermelon', reasons: ['Very high water content', 'Natural diuretic effect', 'Helps flush kidneys'] },
      { name: 'Cantaloupe', reasons: ['High water content', 'Low oxalate fruit', 'Supports kidney hydration'] }
    ],
    moderate: [
      { name: 'Apple', reasons: ['Low oxalate content', 'Good hydration', 'Generally safe for kidney health'] },
      { name: 'Grape', reasons: ['Low oxalate levels', 'Good hydration source', 'Safe for most kidney stone types'] }
    ],
    limit: [
      { name: 'Strawberries', reasons: ['Moderate oxalate content', 'May contribute to oxalate stones', 'Consume in moderation'] },
      { name: 'Blackberries', reasons: ['Higher oxalate content', 'May increase stone risk', 'Limit if prone to oxalate stones'] }
    ],
    avoid: [
      { name: 'Raspberries', reasons: ['Very high oxalate content', 'High risk for oxalate stone formation', 'Should be avoided with kidney stones'] },
      { name: 'Fig', reasons: ['High oxalate content', 'May promote stone formation', 'Not recommended for kidney stone patients'] }
    ]
  }
};

export class FruitRecommendationService {
  
  /**
   * Get personalized fruit recommendations based on user's medical conditions
   */
  async getPersonalizedRecommendations(userConditions: string[]): Promise<FruitRecommendation[]> {
    try {
      // Get all fruits from database
      const allFruits = await prisma.fruit.findMany({
        orderBy: { name: 'asc' }
      });

      const fruitRecommendations: Map<string, FruitRecommendation> = new Map();

      // Initialize all fruits with neutral recommendation
      allFruits.forEach(fruit => {
        fruitRecommendations.set(fruit.name, {
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
          recommendationLevel: 'neutral',
          reasons: [],
          score: 0
        });
      });

      // Process each user condition
      userConditions.forEach(condition => {
        const recommendations = DISEASE_FRUIT_RECOMMENDATIONS[condition as keyof typeof DISEASE_FRUIT_RECOMMENDATIONS];
        
        if (recommendations) {
          // Process recommended fruits
          recommendations.recommended?.forEach(rec => {
            const fruit = this.findFruitByName(fruitRecommendations, rec.name);
            if (fruit) {
              fruit.recommendationLevel = 'recommended';
              fruit.reasons.push(...rec.reasons);
              fruit.score += 10; // High priority
            }
          });

          // Process moderate fruits
          recommendations.moderate?.forEach(rec => {
            const fruit = this.findFruitByName(fruitRecommendations, rec.name);
            if (fruit && fruit.recommendationLevel === 'neutral') {
              fruit.recommendationLevel = 'moderate';
              fruit.reasons.push(...rec.reasons);
              fruit.score += 5; // Medium priority
            }
          });

          // Process limit fruits
          recommendations.limit?.forEach(rec => {
            const fruit = this.findFruitByName(fruitRecommendations, rec.name);
            if (fruit && ['neutral', 'moderate'].includes(fruit.recommendationLevel)) {
              fruit.recommendationLevel = 'limit';
              fruit.reasons.push(...rec.reasons);
              fruit.score -= 5; // Lower priority
            }
          });

          // Process avoid fruits
          recommendations.avoid?.forEach(rec => {
            const fruit = this.findFruitByName(fruitRecommendations, rec.name);
            if (fruit) {
              fruit.recommendationLevel = 'avoid';
              fruit.reasons.push(...rec.reasons);
              fruit.score -= 10; // Lowest priority
            }
          });
        }
      });

      // Convert to array and sort by recommendation level and score
      const result = Array.from(fruitRecommendations.values())
        .sort((a, b) => {
          const levelOrder = { 'recommended': 4, 'moderate': 3, 'neutral': 2, 'limit': 1, 'avoid': 0 };
          const levelDiff = levelOrder[b.recommendationLevel] - levelOrder[a.recommendationLevel];
          if (levelDiff !== 0) return levelDiff;
          return b.score - a.score; // Higher score first
        });

      console.log(`Generated ${result.length} personalized recommendations for conditions: ${userConditions.join(', ')}`);
      console.log(`Recommended fruits: ${result.filter(f => f.recommendationLevel === 'recommended').length}`);
      console.log(`Moderate fruits: ${result.filter(f => f.recommendationLevel === 'moderate').length}`);
      console.log(`Limited fruits: ${result.filter(f => f.recommendationLevel === 'limit').length}`);
      console.log(`Avoid fruits: ${result.filter(f => f.recommendationLevel === 'avoid').length}`);

      return result;
      
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      throw error;
    }
  }

  /**
   * Find fruit by name (case insensitive, partial match)
   */
  private findFruitByName(fruitMap: Map<string, FruitRecommendation>, searchName: string): FruitRecommendation | undefined {
    // First try exact match
    const exactMatch = fruitMap.get(searchName);
    if (exactMatch) return exactMatch;

    // Try case insensitive match
    for (const [name, fruit] of fruitMap) {
      if (name.toLowerCase() === searchName.toLowerCase()) {
        return fruit;
      }
    }

    // Try partial match
    for (const [name, fruit] of fruitMap) {
      if (name.toLowerCase().includes(searchName.toLowerCase()) || 
          searchName.toLowerCase().includes(name.toLowerCase())) {
        return fruit;
      }
    }

    return undefined;
  }

  /**
   * Get recommendations summary for a user
   */
  async getRecommendationSummary(userConditions: string[]) {
    const recommendations = await this.getPersonalizedRecommendations(userConditions);
    
    return {
      totalFruits: recommendations.length,
      recommended: recommendations.filter(f => f.recommendationLevel === 'recommended').length,
      moderate: recommendations.filter(f => f.recommendationLevel === 'moderate').length,
      limit: recommendations.filter(f => f.recommendationLevel === 'limit').length,
      avoid: recommendations.filter(f => f.recommendationLevel === 'avoid').length,
      topRecommended: recommendations
        .filter(f => f.recommendationLevel === 'recommended')
        .slice(0, 5)
        .map(f => ({ name: f.name, reasons: f.reasons.slice(0, 2) }))
    };
  }
}

export const fruitRecommendationService = new FruitRecommendationService();
