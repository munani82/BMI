import { GoogleGenAI } from "@google/genai";
import { UserMetrics, BodyStats } from "../lib/calculations";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMealPlan(metrics: UserMetrics, stats: BodyStats) {
  const prompt = `
    사용자 정보:
    - 성별: ${metrics.gender === 'male' ? '남성' : '여성'}
    - 나이: ${metrics.age}세
    - 키: ${metrics.height}cm
    - 몸무게: ${metrics.weight}kg
    - 활동량: ${metrics.activityLevel} (활동 지수)
    - BMI: ${stats.bmi} (${stats.bmiCategory})
    - 기초대사량(BMR): ${stats.bmr} kcal
    - 하루 총 에너지 소비량(TDEE): ${stats.tdee} kcal

    위 정보를 바탕으로 하루 식단을 짜줘.
    하루 목표 섭취 열량은 ${stats.tdee} kcal 내외로 구성해줘.
    
    포함할 내용:
    1. 식단 구성 원칙 (영양성분 비율 등)
    2. 아침, 점심, 저녁, 간식 구성
    3. 각 식사별 대략적인 칼로리와 주요 영양소
    4. 간단한 조언이나 주의사항

    형태는 MarkDown 형식으로 제목과 리스트를 사용하여 보기 좋게 작성해줘.
    한국어로 작성해줘.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "식단을 생성하는 데 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}
