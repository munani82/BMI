/**
 * BMI & Nutrition Calculation logic
 */

export enum ActivityLevel {
  SEDENTARY = '1.2',
  LIGHT = '1.375',
  MODERATE = '1.55',
  VERY_ACTIVE = '1.725',
  EXTRA_ACTIVE = '1.9',
}

export const activityLevelLabels: Record<string, string> = {
  '1.2': '활동이 거의 없음 (Sedentary)',
  '1.375': '가벼운 활동 (주 1-3일 운동)',
  '1.55': '보통 활동 (주 3-5일 운동)',
  '1.725': '적극적인 활동 (주 6-7일 운동)',
  '1.9': '매우 적극적인 활동 (선수급, 육체노동)',
};

export interface UserMetrics {
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female';
  activityLevel: ActivityLevel;
}

export interface BodyStats {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
}

export function calculateStats(metrics: UserMetrics): BodyStats {
  const { height, weight, age, gender, activityLevel } = metrics;
  
  // BMI calculation
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let bmiCategory = '';
  if (bmi < 18.5) bmiCategory = '저체중';
  else if (bmi < 23) bmiCategory = '정상';
  else if (bmi < 25) bmiCategory = '과체중';
  else if (bmi < 30) bmiCategory = '비만';
  else bmiCategory = '고도비만';

  // BMR (Mifflin-St Jeor Equation)
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE
  const tdee = bmr * parseFloat(activityLevel);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  };
}
