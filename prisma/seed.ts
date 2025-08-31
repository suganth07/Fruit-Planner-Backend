import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed fruits
  const fruits = [
    {
      name: 'Apple',
      benefits: 'Rich in fiber, vitamin C, and antioxidants. Helps regulate blood sugar.',
      glycemicIndex: 36,
      sugarContent: 10.4,
      calories: 52,
      fiber: 2.4,
      vitaminC: 4.6,
      potassium: 107,
    },
    {
      name: 'Banana',
      benefits: 'High in potassium, vitamin B6, and natural sugars for quick energy.',
      glycemicIndex: 51,
      sugarContent: 12.2,
      calories: 89,
      fiber: 2.6,
      vitaminC: 8.7,
      potassium: 358,
    },
    {
      name: 'Orange',
      benefits: 'Excellent source of vitamin C, folate, and flavonoids.',
      glycemicIndex: 45,
      sugarContent: 9.4,
      calories: 47,
      fiber: 2.4,
      vitaminC: 53.2,
      potassium: 181,
    },
    {
      name: 'Grapes',
      benefits: 'Contains antioxidants and resveratrol. May support heart health.',
      glycemicIndex: 59,
      sugarContent: 16.3,
      calories: 67,
      fiber: 0.9,
      vitaminC: 3.2,
      potassium: 191,
    },
    {
      name: 'Berries (Mixed)',
      benefits: 'High in antioxidants, low in sugar, excellent for diabetes management.',
      glycemicIndex: 25,
      sugarContent: 4.9,
      calories: 32,
      fiber: 2.0,
      vitaminC: 9.7,
      potassium: 77,
    },
    {
      name: 'Papaya',
      benefits: 'Rich in vitamin C, folate, and digestive enzymes.',
      glycemicIndex: 60,
      sugarContent: 7.8,
      calories: 43,
      fiber: 1.7,
      vitaminC: 60.9,
      potassium: 182,
    },
    {
      name: 'Mango',
      benefits: 'Rich in vitamin A, vitamin C, and antioxidants. Supports immune system.',
      glycemicIndex: 51,
      sugarContent: 13.7,
      calories: 65,
      fiber: 1.6,
      vitaminC: 36.4,
      potassium: 168,
    },
    {
      name: 'Pineapple',
      benefits: 'Contains bromelain enzyme and vitamin C. Aids digestion.',
      glycemicIndex: 59,
      sugarContent: 9.9,
      calories: 50,
      fiber: 1.4,
      vitaminC: 47.8,
      potassium: 109,
    },
    {
      name: 'Kiwi',
      benefits: 'Very high in vitamin C, fiber, and potassium. Supports immunity.',
      glycemicIndex: 39,
      sugarContent: 9.0,
      calories: 61,
      fiber: 3.0,
      vitaminC: 92.7,
      potassium: 312,
    },
    {
      name: 'Strawberries',
      benefits: 'Low in calories, high in vitamin C and antioxidants.',
      glycemicIndex: 40,
      sugarContent: 4.9,
      calories: 32,
      fiber: 2.0,
      vitaminC: 58.8,
      potassium: 153,
    },
    {
      name: 'Watermelon',
      benefits: 'High water content, lycopene, and vitamin A. Great for hydration.',
      glycemicIndex: 72,
      sugarContent: 6.2,
      calories: 30,
      fiber: 0.4,
      vitaminC: 8.1,
      potassium: 112,
    },
    {
      name: 'Avocado',
      benefits: 'Rich in healthy fats, fiber, and potassium. Heart-healthy.',
      glycemicIndex: 10,
      sugarContent: 0.7,
      calories: 160,
      fiber: 6.7,
      vitaminC: 10.0,
      potassium: 485,
    },
    {
      name: 'Cherries',
      benefits: 'Anti-inflammatory properties, melatonin for sleep, antioxidants.',
      glycemicIndex: 22,
      sugarContent: 8.5,
      calories: 50,
      fiber: 1.6,
      vitaminC: 7.0,
      potassium: 173,
    },
    {
      name: 'Peach',
      benefits: 'Good source of vitamin A and C, low calories, supports skin health.',
      glycemicIndex: 28,
      sugarContent: 8.4,
      calories: 39,
      fiber: 1.5,
      vitaminC: 6.6,
      potassium: 190,
    },
    {
      name: 'Plum',
      benefits: 'Rich in antioxidants, vitamin C, and fiber. Supports bone health.',
      glycemicIndex: 24,
      sugarContent: 9.9,
      calories: 46,
      fiber: 1.4,
      vitaminC: 9.5,
      potassium: 157,
    },
    {
      name: 'Grapefruit',
      benefits: 'Low in calories, high in vitamin C, may aid weight loss.',
      glycemicIndex: 25,
      sugarContent: 6.9,
      calories: 42,
      fiber: 1.6,
      vitaminC: 31.2,
      potassium: 135,
    },
    {
      name: 'Pear',
      benefits: 'High in fiber, vitamin C, and antioxidants. Good for digestion.',
      glycemicIndex: 33,
      sugarContent: 9.8,
      calories: 57,
      fiber: 3.1,
      vitaminC: 4.3,
      potassium: 116,
    },
    {
      name: 'Blueberries',
      benefits: 'Superfood with antioxidants, supports brain health and memory.',
      glycemicIndex: 53,
      sugarContent: 10.0,
      calories: 57,
      fiber: 2.4,
      vitaminC: 9.7,
      potassium: 77,
    },
    {
      name: 'Raspberries',
      benefits: 'High fiber, low sugar, rich in antioxidants and vitamin C.',
      glycemicIndex: 32,
      sugarContent: 4.4,
      calories: 52,
      fiber: 6.5,
      vitaminC: 26.2,
      potassium: 151,
    },
    {
      name: 'Blackberries',
      benefits: 'High in fiber, vitamin C, and antioxidants. Supports immune system.',
      glycemicIndex: 25,
      sugarContent: 4.9,
      calories: 43,
      fiber: 5.3,
      vitaminC: 21.0,
      potassium: 162,
    },
    {
      name: 'Pomegranate',
      benefits: 'Powerful antioxidants, anti-inflammatory, supports heart health.',
      glycemicIndex: 35,
      sugarContent: 13.7,
      calories: 83,
      fiber: 4.0,
      vitaminC: 10.2,
      potassium: 236,
    },
    {
      name: 'Lemon',
      benefits: 'High in vitamin C, citric acid, supports immune system and hydration.',
      glycemicIndex: 20,
      sugarContent: 1.5,
      calories: 17,
      fiber: 1.6,
      vitaminC: 51.0,
      potassium: 80,
    },
    {
      name: 'Lime',
      benefits: 'Rich in vitamin C and citric acid, supports digestion.',
      glycemicIndex: 25,
      sugarContent: 1.1,
      calories: 20,
      fiber: 1.8,
      vitaminC: 29.1,
      potassium: 68,
    },
    {
      name: 'Cantaloupe',
      benefits: 'High in vitamin A and C, good hydration, supports eye health.',
      glycemicIndex: 65,
      sugarContent: 7.9,
      calories: 34,
      fiber: 0.9,
      vitaminC: 36.7,
      potassium: 267,
    },
    {
      name: 'Honeydew',
      benefits: 'Good source of vitamin C and potassium, low in calories.',
      glycemicIndex: 62,
      sugarContent: 8.1,
      calories: 36,
      fiber: 0.8,
      vitaminC: 18.0,
      potassium: 228,
    },
    {
      name: 'Dragon Fruit',
      benefits: 'Rich in antioxidants, vitamin C, and fiber. Exotic superfruit.',
      glycemicIndex: 48,
      sugarContent: 7.7,
      calories: 60,
      fiber: 2.9,
      vitaminC: 20.5,
      potassium: 116,
    },
    {
      name: 'Star Fruit',
      benefits: 'Low in calories, high in vitamin C, unique star shape.',
      glycemicIndex: 45,
      sugarContent: 3.8,
      calories: 31,
      fiber: 2.8,
      vitaminC: 34.4,
      potassium: 133,
    },
    {
      name: 'Guava',
      benefits: 'Extremely high in vitamin C, fiber, and antioxidants.',
      glycemicIndex: 12,
      sugarContent: 8.9,
      calories: 68,
      fiber: 5.4,
      vitaminC: 228.3,
      potassium: 417,
    },
    {
      name: 'Passion Fruit',
      benefits: 'High in fiber, vitamin A and C, supports digestive health.',
      glycemicIndex: 30,
      sugarContent: 11.2,
      calories: 97,
      fiber: 10.4,
      vitaminC: 30.0,
      potassium: 348,
    },
    {
      name: 'Coconut',
      benefits: 'Rich in healthy fats, fiber, and electrolytes. Natural hydration.',
      glycemicIndex: 45,
      sugarContent: 6.2,
      calories: 354,
      fiber: 9.0,
      vitaminC: 3.3,
      potassium: 356,
    },
    {
      name: 'Fig',
      benefits: 'High in fiber, potassium, and antioxidants. Supports bone health.',
      glycemicIndex: 61,
      sugarContent: 16.3,
      calories: 74,
      fiber: 2.9,
      vitaminC: 2.0,
      potassium: 232,
    },
  ];

  for (const fruit of fruits) {
    await prisma.fruit.upsert({
      where: { name: fruit.name },
      update: {},
      create: fruit,
    });
  }

  // Seed fruit restrictions
  const restrictions = [
    // Diabetes restrictions
    {
      condition: 'diabetes',
      fruitName: 'Grapes',
      restrictionLevel: 'limit',
      reason: 'High glycemic index may cause blood sugar spikes',
    },
    {
      condition: 'diabetes',
      fruitName: 'Banana',
      restrictionLevel: 'moderate',
      reason: 'Medium glycemic index, consume in moderation',
    },
    {
      condition: 'diabetes',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'Low glycemic index and high fiber help regulate blood sugar',
    },
    {
      condition: 'diabetes',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'Low glycemic index and high fiber content',
    },
    {
      condition: 'diabetes',
      fruitName: 'Cherries',
      restrictionLevel: 'recommended',
      reason: 'Very low glycemic index and anti-inflammatory properties',
    },
    {
      condition: 'diabetes',
      fruitName: 'Grapefruit',
      restrictionLevel: 'recommended',
      reason: 'Low glycemic index, may help with insulin sensitivity',
    },
    {
      condition: 'diabetes',
      fruitName: 'Watermelon',
      restrictionLevel: 'limit',
      reason: 'High glycemic index despite low sugar content',
    },
    {
      condition: 'diabetes',
      fruitName: 'Pineapple',
      restrictionLevel: 'moderate',
      reason: 'Medium-high glycemic index, portion control recommended',
    },
    
    // Kidney stone restrictions
    {
      condition: 'kidney_stone',
      fruitName: 'Grapes',
      restrictionLevel: 'avoid',
      reason: 'High oxalate content may increase kidney stone risk',
    },
    {
      condition: 'kidney_stone',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'limit',
      reason: 'Contains oxalates, consume in moderation',
    },
    {
      condition: 'kidney_stone',
      fruitName: 'Lemon',
      restrictionLevel: 'recommended',
      reason: 'Citric acid may help prevent calcium oxalate stones',
    },
    {
      condition: 'kidney_stone',
      fruitName: 'Lime',
      restrictionLevel: 'recommended',
      reason: 'Natural citric acid helps prevent stone formation',
    },
    
    // Hypertension recommendations
    {
      condition: 'hypertension',
      fruitName: 'Banana',
      restrictionLevel: 'recommended',
      reason: 'High potassium content helps regulate blood pressure',
    },
    {
      condition: 'hypertension',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Good potassium source and supports cardiovascular health',
    },
    {
      condition: 'hypertension',
      fruitName: 'Avocado',
      restrictionLevel: 'recommended',
      reason: 'Very high potassium and healthy fats for heart health',
    },
    {
      condition: 'hypertension',
      fruitName: 'Kiwi',
      restrictionLevel: 'recommended',
      reason: 'High potassium and vitamin C for blood pressure control',
    },
    {
      condition: 'hypertension',
      fruitName: 'Cantaloupe',
      restrictionLevel: 'recommended',
      reason: 'Good source of potassium and low sodium',
    },
    
    // Heart disease recommendations
    {
      condition: 'heart_disease',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'High antioxidants protect against cardiovascular damage',
    },
    {
      condition: 'heart_disease',
      fruitName: 'Pomegranate',
      restrictionLevel: 'recommended',
      reason: 'Powerful antioxidants support heart health',
    },
    {
      condition: 'heart_disease',
      fruitName: 'Avocado',
      restrictionLevel: 'recommended',
      reason: 'Monounsaturated fats reduce bad cholesterol',
    },
    {
      condition: 'heart_disease',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'Soluble fiber helps lower cholesterol',
    },
    {
      condition: 'heart_disease',
      fruitName: 'Grapes',
      restrictionLevel: 'recommended',
      reason: 'Resveratrol supports cardiovascular health',
    },
    
    // High cholesterol
    {
      condition: 'high_cholesterol',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'Pectin fiber helps reduce LDL cholesterol',
    },
    {
      condition: 'high_cholesterol',
      fruitName: 'Avocado',
      restrictionLevel: 'recommended',
      reason: 'Healthy fats help improve cholesterol profile',
    },
    {
      condition: 'high_cholesterol',
      fruitName: 'Pear',
      restrictionLevel: 'recommended',
      reason: 'High soluble fiber reduces cholesterol absorption',
    },
    {
      condition: 'high_cholesterol',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'Antioxidants and fiber support healthy cholesterol levels',
    },
    
    // Digestive issues
    {
      condition: 'digestive_issues',
      fruitName: 'Papaya',
      restrictionLevel: 'recommended',
      reason: 'Papain enzyme aids protein digestion',
    },
    {
      condition: 'digestive_issues',
      fruitName: 'Pineapple',
      restrictionLevel: 'recommended',
      reason: 'Bromelain enzyme helps break down proteins',
    },
    {
      condition: 'digestive_issues',
      fruitName: 'Banana',
      restrictionLevel: 'recommended',
      reason: 'Easy to digest and soothes stomach lining',
    },
    {
      condition: 'digestive_issues',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'Pectin fiber supports healthy gut bacteria',
    },
    
    // Anemia
    {
      condition: 'anemia',
      fruitName: 'Pomegranate',
      restrictionLevel: 'recommended',
      reason: 'High in iron and folate, supports red blood cell production',
    },
    {
      condition: 'anemia',
      fruitName: 'Fig',
      restrictionLevel: 'recommended',
      reason: 'Good source of iron and vitamin C for iron absorption',
    },
    {
      condition: 'anemia',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Vitamin C enhances iron absorption from food',
    },
    {
      condition: 'anemia',
      fruitName: 'Strawberries',
      restrictionLevel: 'recommended',
      reason: 'Vitamin C and folate support healthy blood formation',
    },
    
    // Arthritis
    {
      condition: 'arthritis',
      fruitName: 'Cherries',
      restrictionLevel: 'recommended',
      reason: 'Anti-inflammatory compounds reduce joint inflammation',
    },
    {
      condition: 'arthritis',
      fruitName: 'Blueberries',
      restrictionLevel: 'recommended',
      reason: 'Antioxidants help reduce inflammation and pain',
    },
    {
      condition: 'arthritis',
      fruitName: 'Pineapple',
      restrictionLevel: 'recommended',
      reason: 'Bromelain has natural anti-inflammatory properties',
    },
    {
      condition: 'arthritis',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Vitamin C supports collagen production for joint health',
    },
    
    // Osteoporosis
    {
      condition: 'osteoporosis',
      fruitName: 'Fig',
      restrictionLevel: 'recommended',
      reason: 'High in calcium and magnesium for bone health',
    },
    {
      condition: 'osteoporosis',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Vitamin C supports bone collagen formation',
    },
    {
      condition: 'osteoporosis',
      fruitName: 'Kiwi',
      restrictionLevel: 'recommended',
      reason: 'High vitamin C and K support bone density',
    },
    {
      condition: 'osteoporosis',
      fruitName: 'Papaya',
      restrictionLevel: 'recommended',
      reason: 'Good source of vitamin K for bone metabolism',
    },
    
    // Asthma
    {
      condition: 'asthma',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'Quercetin may help reduce asthma symptoms',
    },
    {
      condition: 'asthma',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'Antioxidants may reduce airway inflammation',
    },
    {
      condition: 'asthma',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Vitamin C may help reduce exercise-induced asthma',
    },
    {
      condition: 'asthma',
      fruitName: 'Kiwi',
      restrictionLevel: 'recommended',
      reason: 'High vitamin C supports respiratory health',
    },
    
    // Depression/Anxiety
    {
      condition: 'depression',
      fruitName: 'Banana',
      restrictionLevel: 'recommended',
      reason: 'Contains tryptophan and vitamin B6 for mood regulation',
    },
    {
      condition: 'depression',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'Antioxidants support brain health and mood',
    },
    {
      condition: 'depression',
      fruitName: 'Avocado',
      restrictionLevel: 'recommended',
      reason: 'Healthy fats support neurotransmitter production',
    },
    {
      condition: 'depression',
      fruitName: 'Orange',
      restrictionLevel: 'recommended',
      reason: 'Folate and vitamin C support mental health',
    },
    
    // Weight management
    {
      condition: 'obesity',
      fruitName: 'Grapefruit',
      restrictionLevel: 'recommended',
      reason: 'Low calories, may boost metabolism',
    },
    {
      condition: 'obesity',
      fruitName: 'Berries (Mixed)',
      restrictionLevel: 'recommended',
      reason: 'Low in calories, high in fiber for satiety',
    },
    {
      condition: 'obesity',
      fruitName: 'Apple',
      restrictionLevel: 'recommended',
      reason: 'High fiber promotes feeling full with fewer calories',
    },
    {
      condition: 'obesity',
      fruitName: 'Watermelon',
      restrictionLevel: 'recommended',
      reason: 'Very low in calories, high water content',
    },
    {
      condition: 'obesity',
      fruitName: 'Avocado',
      restrictionLevel: 'limit',
      reason: 'High in calories despite health benefits',
    },
    
    // GERD (Acid Reflux)
    {
      condition: 'gerd',
      fruitName: 'Orange',
      restrictionLevel: 'avoid',
      reason: 'High acidity can trigger acid reflux symptoms',
    },
    {
      condition: 'gerd',
      fruitName: 'Lemon',
      restrictionLevel: 'avoid',
      reason: 'Very acidic, likely to worsen GERD symptoms',
    },
    {
      condition: 'gerd',
      fruitName: 'Grapefruit',
      restrictionLevel: 'avoid',
      reason: 'High acid content can trigger reflux',
    },
    {
      condition: 'gerd',
      fruitName: 'Banana',
      restrictionLevel: 'recommended',
      reason: 'Low acid, may help neutralize stomach acid',
    },
    {
      condition: 'gerd',
      fruitName: 'Papaya',
      restrictionLevel: 'recommended',
      reason: 'Low acid and digestive enzymes aid stomach function',
    },
    {
      condition: 'gerd',
      fruitName: 'Melon',
      restrictionLevel: 'recommended',
      reason: 'Low acid content, gentle on stomach',
    },
  ];

  for (const restriction of restrictions) {
    const fruit = await prisma.fruit.findUnique({
      where: { name: restriction.fruitName },
    });

    if (fruit) {
      await prisma.fruitRestriction.upsert({
        where: {
          id: -1, // This will always create new records
        },
        update: {},
        create: {
          condition: restriction.condition,
          fruitId: fruit.id,
          restrictionLevel: restriction.restrictionLevel,
          reason: restriction.reason,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
