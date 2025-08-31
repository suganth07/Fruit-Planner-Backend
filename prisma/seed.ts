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
    
    // Kidney stone restrictions
    {
      condition: 'kidney_stone',
      fruitName: 'Grapes',
      restrictionLevel: 'avoid',
      reason: 'High oxalate content may increase kidney stone risk',
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
