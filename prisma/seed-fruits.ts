import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fruitsData = [
  {
    name: 'Apple',
    benefits: 'Excellent source of vitamin C, boosts immunity, aids digestion',
    glycemicIndex: 38,
    sugarContent: 19.1,
    calories: 52,
    fiber: 2.4,
    vitaminC: 4.6,
    potassium: 107
  },
  {
    name: 'Banana', 
    benefits: 'High in potassium, supports heart health, provides quick energy',
    glycemicIndex: 51,
    sugarContent: 17.2,
    calories: 105,
    fiber: 3.1,
    vitaminC: 10.3,
    potassium: 422
  },
  {
    name: 'Orange',
    benefits: 'Rich in vitamin C, folate, supports immune system',
    glycemicIndex: 45,
    sugarContent: 15.4,
    calories: 62,
    fiber: 3.1,
    vitaminC: 70,
    potassium: 237
  },
  {
    name: 'Grapes',
    benefits: 'Contains antioxidants, supports heart health',
    glycemicIndex: 46,
    sugarContent: 20.2,
    calories: 69,
    fiber: 0.9,
    vitaminC: 10.8,
    potassium: 191
  },
  {
    name: 'Mango',
    benefits: 'Rich in vitamin A, supports eye health, aids digestion',
    glycemicIndex: 51,
    sugarContent: 13.7,
    calories: 60,
    fiber: 1.6,
    vitaminC: 36.4,
    potassium: 168
  },
  {
    name: 'Strawberry',
    benefits: 'Low in calories, high antioxidants, supports heart health',
    glycemicIndex: 40,
    sugarContent: 7.4,
    calories: 32,
    fiber: 2.0,
    vitaminC: 58.8,
    potassium: 153
  },
  {
    name: 'Kiwi',
    benefits: 'High vitamin C, aids digestion, supports immune system',
    glycemicIndex: 39,
    sugarContent: 11.1,
    calories: 61,
    fiber: 3.0,
    vitaminC: 92.7,
    potassium: 312
  },
  {
    name: 'Watermelon',
    benefits: 'Low calories, high water content, supports hydration',
    glycemicIndex: 72,
    sugarContent: 9.4,
    calories: 30,
    fiber: 0.4,
    vitaminC: 8.1,
    potassium: 112
  },
  {
    name: 'Pineapple',
    benefits: 'Contains bromelain, aids digestion, anti-inflammatory',
    glycemicIndex: 59,
    sugarContent: 13.1,
    calories: 50,
    fiber: 1.4,
    vitaminC: 47.8,
    potassium: 109
  },
  {
    name: 'Papaya',
    benefits: 'Rich in digestive enzymes, supports digestion',
    glycemicIndex: 59,
    sugarContent: 7.8,
    calories: 43,
    fiber: 1.7,
    vitaminC: 60.9,
    potassium: 182
  }
];

const restrictionsData = [
  // Diabetes Type 2
  { condition: 'diabetes_type_2', fruitName: 'Apple', level: 'recommended', reason: 'Low glycemic index, high fiber helps regulate blood sugar' },
  { condition: 'diabetes_type_2', fruitName: 'Strawberry', level: 'recommended', reason: 'Low in sugar, high in antioxidants, good for diabetics' },
  { condition: 'diabetes_type_2', fruitName: 'Kiwi', level: 'recommended', reason: 'Low glycemic index, high fiber and vitamin C' },
  { condition: 'diabetes_type_2', fruitName: 'Banana', level: 'moderate', reason: 'Moderate glycemic index, eat in small portions' },
  { condition: 'diabetes_type_2', fruitName: 'Grapes', level: 'moderate', reason: 'Contains natural sugars, portion control recommended' },
  { condition: 'diabetes_type_2', fruitName: 'Mango', level: 'moderate', reason: 'Higher in natural sugars, eat in moderation' },
  { condition: 'diabetes_type_2', fruitName: 'Watermelon', level: 'limit', reason: 'High glycemic index may cause blood sugar spikes' },
  { condition: 'diabetes_type_2', fruitName: 'Pineapple', level: 'limit', reason: 'High sugar content, consume in moderation' },

  // Hypertension
  { condition: 'hypertension', fruitName: 'Banana', level: 'recommended', reason: 'High potassium content helps regulate blood pressure' },
  { condition: 'hypertension', fruitName: 'Orange', level: 'recommended', reason: 'Rich in potassium and vitamin C, supports heart health' },
  { condition: 'hypertension', fruitName: 'Kiwi', level: 'recommended', reason: 'High potassium and antioxidants support cardiovascular health' },
  { condition: 'hypertension', fruitName: 'Watermelon', level: 'recommended', reason: 'Contains citrulline which may help lower blood pressure' },

  // Heart Disease
  { condition: 'heart_disease', fruitName: 'Apple', level: 'recommended', reason: 'High fiber and antioxidants support heart health' },
  { condition: 'heart_disease', fruitName: 'Strawberry', level: 'recommended', reason: 'Rich in anthocyanins, may reduce heart disease risk' },
  { condition: 'heart_disease', fruitName: 'Orange', level: 'recommended', reason: 'Flavonoids and potassium support cardiovascular health' },

  // Digestive Issues
  { condition: 'digestive_issues', fruitName: 'Apple', level: 'recommended', reason: 'High fiber aids digestion, pectin soothes stomach' },
  { condition: 'digestive_issues', fruitName: 'Papaya', level: 'recommended', reason: 'Contains digestive enzymes, very beneficial for digestion' },
  { condition: 'digestive_issues', fruitName: 'Pineapple', level: 'recommended', reason: 'Bromelain enzyme aids protein digestion' },
  { condition: 'digestive_issues', fruitName: 'Kiwi', level: 'recommended', reason: 'Contains actinidin enzyme that aids digestion' },

  // Kidney Disease
  { condition: 'kidney_disease', fruitName: 'Banana', level: 'avoid', reason: 'Very high in potassium, dangerous for kidney patients' },
  { condition: 'kidney_disease', fruitName: 'Orange', level: 'avoid', reason: 'High potassium content, avoid in advanced kidney disease' },
  { condition: 'kidney_disease', fruitName: 'Kiwi', level: 'avoid', reason: 'Extremely high potassium, should be avoided' },
  { condition: 'kidney_disease', fruitName: 'Apple', level: 'recommended', reason: 'Lower in potassium, safer choice for kidney patients' },
  { condition: 'kidney_disease', fruitName: 'Strawberry', level: 'recommended', reason: 'Low potassium option, good for kidney diet' },
  { condition: 'kidney_disease', fruitName: 'Watermelon', level: 'recommended', reason: 'Low potassium, high water content is beneficial' },

  // Weight Management
  { condition: 'weight_management', fruitName: 'Apple', level: 'recommended', reason: 'Low calorie, high fiber promotes satiety' },
  { condition: 'weight_management', fruitName: 'Strawberry', level: 'recommended', reason: 'Very low in calories and sugar, high in fiber' },
  { condition: 'weight_management', fruitName: 'Watermelon', level: 'recommended', reason: 'Low calorie, high water content, very filling' },
  { condition: 'weight_management', fruitName: 'Papaya', level: 'recommended', reason: 'Low calorie, aids digestion and metabolism' },
  { condition: 'weight_management', fruitName: 'Banana', level: 'limit', reason: 'Higher in calories and carbs, consume in moderation' },
  { condition: 'weight_management', fruitName: 'Grapes', level: 'limit', reason: 'Higher in sugar and calories, easy to overeat' },
  { condition: 'weight_management', fruitName: 'Mango', level: 'limit', reason: 'High in calories and sugar, limit portions' },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // First, create fruits
  console.log('📦 Creating fruits...');
  for (const fruit of fruitsData) {
    await prisma.fruit.upsert({
      where: { name: fruit.name },
      update: {},
      create: fruit
    });
  }

  // Then create restrictions
  console.log('🚫 Creating fruit restrictions...');
  for (const restriction of restrictionsData) {
    const fruit = await prisma.fruit.findUnique({
      where: { name: restriction.fruitName }
    });

    if (fruit) {
      await prisma.fruitRestriction.upsert({
        where: {
          // Create a unique constraint based on condition and fruitId
          id: -1 // This will not match, so it will create
        },
        update: {},
        create: {
          condition: restriction.condition,
          fruitId: fruit.id,
          restrictionLevel: restriction.level,
          reason: restriction.reason
        }
      });
    }
  }

  // Add common condition aliases
  console.log('🔄 Adding condition aliases...');
  const aliases = [
    { from: 'diabetes_type_2', to: 'diabetes' },
    { from: 'hypertension', to: 'high_blood_pressure' },
  ];

  for (const alias of aliases) {
    const originalRestrictions = await prisma.fruitRestriction.findMany({
      where: { condition: alias.from }
    });

    for (const restriction of originalRestrictions) {
      await prisma.fruitRestriction.upsert({
        where: { id: -1 }, // Will not match, so create
        update: {},
        create: {
          condition: alias.to,
          fruitId: restriction.fruitId,
          restrictionLevel: restriction.restrictionLevel,
          reason: restriction.reason
        }
      });
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
