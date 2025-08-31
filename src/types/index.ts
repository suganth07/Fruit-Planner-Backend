// User-related types
export interface User {
  id: number;
  email: string;
  conditions: MedicalCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  conditions?: MedicalCondition[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Medical condition types
export enum MedicalCondition {
  DIABETES = 'diabetes',
  HYPERTENSION = 'hypertension',
  KIDNEY_STONE = 'kidney_stone',
  HEART_DISEASE = 'heart_disease',
  HIGH_CHOLESTEROL = 'high_cholesterol',
  OBESITY = 'obesity',
  GOUT = 'gout',
  ACID_REFLUX = 'acid_reflux',
  LIVER_DISEASE = 'liver_disease',
  GALLBLADDER_DISEASE = 'gallbladder_disease'
}

// Fruit-related types
export interface Fruit {
  id: number;
  name: string;
  benefits: string;
  glycemicIndex: number;
  sugarContent: number;
  calories: number;
  fiber: number;
  vitaminC: number;
  potassium: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FruitRestriction {
  id: number;
  condition: MedicalCondition;
  fruitId: number;
  restrictionLevel: RestrictionLevel;
  reason: string;
}

export enum RestrictionLevel {
  AVOID = 'avoid',
  LIMIT = 'limit',
  MODERATE = 'moderate',
  RECOMMENDED = 'recommended'
}

// Weekly plan types
export interface WeeklyPlan {
  id: number;
  userId: number;
  week: number;
  year: number;
  plan: DailyPlan[];
  explanation: string;
  createdAt: Date;
}

export interface DailyPlan {
  day: number; // 0-6 (Sunday-Saturday)
  fruits: PlanFruit[];
}

export interface PlanFruit {
  fruitId: number;
  fruit: Fruit;
  quantity: number;
  timeOfDay: TimeOfDay;
  notes?: string;
}

export enum TimeOfDay {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Recommendation types
export interface RecommendationRequest {
  conditions: MedicalCondition[];
  preferences?: FruitPreference[];
  excludedFruits?: number[];
}

export interface RecommendationResponse {
  recommendedFruits: Fruit[];
  avoidedFruits: Fruit[];
  explanation: string;
  restrictions: FruitRestriction[];
}

export interface FruitPreference {
  fruitId: number;
  preference: 'love' | 'like' | 'dislike' | 'allergic';
}

// Weekly plan generation types
export interface GeneratePlanRequest {
  userId: number;
  selectedFruits: number[];
  conditions: MedicalCondition[];
  preferences?: {
    mealsPerDay?: number;
    servingsPerMeal?: number;
    variety?: boolean;
  };
}

export interface GeneratePlanResponse {
  plan: WeeklyPlan;
  explanation: string;
  nutritionalSummary: NutritionalSummary;
}

export interface NutritionalSummary {
  totalCalories: number;
  totalSugar: number;
  totalFiber: number;
  averageGlycemicIndex: number;
  vitaminC: number;
  potassium: number;
}

// Gemini API types
export interface GeminiPrompt {
  conditions: MedicalCondition[];
  availableFruits: Fruit[];
  restrictions: FruitRestriction[];
  preferences?: any;
}

export interface GeminiResponse {
  explanation: string;
  plan: {
    [key: string]: string[]; // day1: ['apple'], day2: ['orange']
  };
  nutritionalNotes: string;
  warnings?: string[];
}
