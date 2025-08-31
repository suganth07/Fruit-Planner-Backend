-- Fruit Restrictions Data for Medical Conditions
-- This will populate the fruit_restrictions table with real medical condition data

-- First, let's insert some fruits if they don't exist
INSERT INTO fruits (name, benefits, glycemic_index, sugar_content, calories, fiber, vitamin_c, potassium, image)
VALUES 
  ('Apple', 'Excellent source of vitamin C, boosts immunity, aids digestion', 38, 19.1, 52, 2.4, 4.6, 107, NULL),
  ('Banana', 'High in potassium, supports heart health, provides quick energy', 51, 17.2, 105, 3.1, 10.3, 422, NULL),
  ('Orange', 'Rich in vitamin C, folate, supports immune system', 45, 15.4, 62, 3.1, 70, 237, NULL),
  ('Grapes', 'Contains antioxidants, supports heart health', 46, 20.2, 69, 0.9, 10.8, 191, NULL),
  ('Mango', 'Rich in vitamin A, supports eye health, aids digestion', 51, 13.7, 60, 1.6, 36.4, 168, NULL),
  ('Strawberry', 'Low in calories, high antioxidants, supports heart health', 40, 7.4, 32, 2.0, 58.8, 153, NULL),
  ('Kiwi', 'High vitamin C, aids digestion, supports immune system', 39, 11.1, 61, 3.0, 92.7, 312, NULL),
  ('Watermelon', 'Low calories, high water content, supports hydration', 72, 9.4, 30, 0.4, 8.1, 112, NULL),
  ('Pineapple', 'Contains bromelain, aids digestion, anti-inflammatory', 59, 13.1, 50, 1.4, 47.8, 109, NULL),
  ('Papaya', 'Rich in digestive enzymes, supports digestion', 59, 7.8, 43, 1.7, 60.9, 182, NULL)
ON CONFLICT (name) DO NOTHING;

-- Now insert fruit restrictions for various medical conditions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'diabetes_type_2',
  f.id,
  CASE 
    WHEN f.name IN ('Watermelon', 'Pineapple') THEN 'limit'
    WHEN f.name IN ('Apple', 'Strawberry', 'Kiwi') THEN 'recommended'
    WHEN f.name IN ('Banana', 'Grapes', 'Mango') THEN 'moderate'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Watermelon' THEN 'High glycemic index may cause blood sugar spikes'
    WHEN f.name = 'Pineapple' THEN 'High sugar content, consume in moderation'
    WHEN f.name = 'Apple' THEN 'Low glycemic index, high fiber helps regulate blood sugar'
    WHEN f.name = 'Strawberry' THEN 'Low in sugar, high in antioxidants, good for diabetics'
    WHEN f.name = 'Kiwi' THEN 'Low glycemic index, high fiber and vitamin C'
    WHEN f.name = 'Banana' THEN 'Moderate glycemic index, eat in small portions'
    WHEN f.name = 'Grapes' THEN 'Contains natural sugars, portion control recommended'
    WHEN f.name = 'Mango' THEN 'Higher in natural sugars, eat in moderation'
    ELSE 'Moderate consumption recommended'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- High Blood Pressure restrictions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'hypertension',
  f.id,
  CASE 
    WHEN f.name IN ('Banana', 'Orange', 'Kiwi', 'Watermelon') THEN 'recommended'
    WHEN f.name IN ('Apple', 'Strawberry', 'Papaya') THEN 'moderate'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Banana' THEN 'High potassium content helps regulate blood pressure'
    WHEN f.name = 'Orange' THEN 'Rich in potassium and vitamin C, supports heart health'
    WHEN f.name = 'Kiwi' THEN 'High potassium and antioxidants support cardiovascular health'
    WHEN f.name = 'Watermelon' THEN 'Contains citrulline which may help lower blood pressure'
    WHEN f.name = 'Apple' THEN 'Contains flavonoids that may support heart health'
    WHEN f.name = 'Strawberry' THEN 'Antioxidants may help reduce inflammation'
    WHEN f.name = 'Papaya' THEN 'Contains antioxidants and potassium'
    ELSE 'Generally safe for hypertension'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Heart Disease restrictions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'heart_disease',
  f.id,
  CASE 
    WHEN f.name IN ('Apple', 'Strawberry', 'Orange', 'Kiwi') THEN 'recommended'
    WHEN f.name IN ('Banana', 'Grapes', 'Papaya') THEN 'moderate'
    WHEN f.name IN ('Watermelon', 'Pineapple', 'Mango') THEN 'limit'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Apple' THEN 'High fiber and antioxidants support heart health'
    WHEN f.name = 'Strawberry' THEN 'Rich in anthocyanins, may reduce heart disease risk'
    WHEN f.name = 'Orange' THEN 'Flavonoids and potassium support cardiovascular health'
    WHEN f.name = 'Kiwi' THEN 'High antioxidants and potassium benefit heart health'
    WHEN f.name = 'Banana' THEN 'Good potassium source but watch portion size'
    WHEN f.name = 'Grapes' THEN 'Contains resveratrol but also high in natural sugars'
    WHEN f.name = 'Papaya' THEN 'Antioxidants beneficial but moderate consumption'
    WHEN f.name = 'Watermelon' THEN 'High glycemic index, consume sparingly'
    WHEN f.name = 'Pineapple' THEN 'High in natural sugars, limit portions'
    WHEN f.name = 'Mango' THEN 'High calorie and sugar content, consume in moderation'
    ELSE 'Moderate consumption recommended'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Digestive Issues restrictions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'digestive_issues',
  f.id,
  CASE 
    WHEN f.name IN ('Apple', 'Papaya', 'Pineapple', 'Kiwi') THEN 'recommended'
    WHEN f.name IN ('Banana', 'Orange', 'Watermelon') THEN 'moderate'
    WHEN f.name IN ('Grapes', 'Mango') THEN 'limit'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Apple' THEN 'High fiber aids digestion, pectin soothes stomach'
    WHEN f.name = 'Papaya' THEN 'Contains digestive enzymes, very beneficial for digestion'
    WHEN f.name = 'Pineapple' THEN 'Bromelain enzyme aids protein digestion'
    WHEN f.name = 'Kiwi' THEN 'Contains actinidin enzyme that aids digestion'
    WHEN f.name = 'Banana' THEN 'Easy to digest, may help with diarrhea when ripe'
    WHEN f.name = 'Orange' THEN 'Fiber beneficial but citrus may irritate some people'
    WHEN f.name = 'Watermelon' THEN 'High water content aids hydration during digestive issues'
    WHEN f.name = 'Grapes' THEN 'May ferment in gut causing gas and bloating'
    WHEN f.name = 'Mango' THEN 'High fiber may be difficult to digest for some'
    ELSE 'Effect varies by individual digestive sensitivity'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Kidney Disease restrictions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'kidney_disease',
  f.id,
  CASE 
    WHEN f.name IN ('Banana', 'Orange', 'Kiwi') THEN 'avoid'
    WHEN f.name IN ('Mango', 'Papaya') THEN 'limit'
    WHEN f.name IN ('Apple', 'Strawberry', 'Grapes', 'Watermelon') THEN 'recommended'
    ELSE 'moderate'
  END,
  CASE 
    WHEN f.name = 'Banana' THEN 'Very high in potassium, dangerous for kidney patients'
    WHEN f.name = 'Orange' THEN 'High potassium content, avoid in advanced kidney disease'
    WHEN f.name = 'Kiwi' THEN 'Extremely high potassium, should be avoided'
    WHEN f.name = 'Mango' THEN 'Moderate potassium, limit portions'
    WHEN f.name = 'Papaya' THEN 'Contains moderate potassium, consume carefully'
    WHEN f.name = 'Apple' THEN 'Lower in potassium, safer choice for kidney patients'
    WHEN f.name = 'Strawberry' THEN 'Low potassium option, good for kidney diet'
    WHEN f.name = 'Grapes' THEN 'Lower potassium content, suitable in moderation'
    WHEN f.name = 'Watermelon' THEN 'Low potassium, high water content is beneficial'
    ELSE 'Consult healthcare provider for individual recommendations'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Weight Management restrictions
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'weight_management',
  f.id,
  CASE 
    WHEN f.name IN ('Apple', 'Strawberry', 'Watermelon', 'Papaya') THEN 'recommended'
    WHEN f.name IN ('Orange', 'Kiwi', 'Pineapple') THEN 'moderate'
    WHEN f.name IN ('Banana', 'Grapes', 'Mango') THEN 'limit'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Apple' THEN 'Low calorie, high fiber promotes satiety'
    WHEN f.name = 'Strawberry' THEN 'Very low in calories and sugar, high in fiber'
    WHEN f.name = 'Watermelon' THEN 'Low calorie, high water content, very filling'
    WHEN f.name = 'Papaya' THEN 'Low calorie, aids digestion and metabolism'
    WHEN f.name = 'Orange' THEN 'Moderate calories, high fiber, good for weight control'
    WHEN f.name = 'Kiwi' THEN 'Moderate calories but high in nutrients'
    WHEN f.name = 'Pineapple' THEN 'Contains enzymes that aid metabolism'
    WHEN f.name = 'Banana' THEN 'Higher in calories and carbs, consume in moderation'
    WHEN f.name = 'Grapes' THEN 'Higher in sugar and calories, easy to overeat'
    WHEN f.name = 'Mango' THEN 'High in calories and sugar, limit portions'
    ELSE 'Portion control important for weight management'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Add more conditions as needed
-- High Cholesterol
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'high_cholesterol',
  f.id,
  CASE 
    WHEN f.name IN ('Apple', 'Strawberry', 'Orange') THEN 'recommended'
    WHEN f.name IN ('Grapes', 'Kiwi', 'Papaya') THEN 'moderate'
    ELSE 'neutral'
  END,
  CASE 
    WHEN f.name = 'Apple' THEN 'Pectin helps lower LDL cholesterol'
    WHEN f.name = 'Strawberry' THEN 'Antioxidants may help reduce cholesterol oxidation'
    WHEN f.name = 'Orange' THEN 'Pectin and flavonoids support heart health'
    WHEN f.name = 'Grapes' THEN 'Resveratrol may help but watch sugar content'
    WHEN f.name = 'Kiwi' THEN 'Fiber content beneficial for cholesterol management'
    WHEN f.name = 'Papaya' THEN 'Antioxidants support overall cardiovascular health'
    ELSE 'Generally beneficial as part of heart-healthy diet'
  END
FROM fruits f
WHERE f.name IN ('Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Strawberry', 'Kiwi', 'Watermelon', 'Pineapple', 'Papaya');

-- Make sure we handle the common condition name variations
INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'diabetes',
  fruit_id,
  restriction_level,
  reason
FROM fruit_restrictions 
WHERE condition = 'diabetes_type_2'
ON CONFLICT DO NOTHING;

INSERT INTO fruit_restrictions (condition, fruit_id, restriction_level, reason)
SELECT 
  'high_blood_pressure',
  fruit_id,
  restriction_level,
  reason
FROM fruit_restrictions 
WHERE condition = 'hypertension'
ON CONFLICT DO NOTHING;
