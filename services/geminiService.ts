
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialInsight } from "../types.ts";

export const analyzeFinance = async (transactions: Transaction[]): Promise<FinancialInsight | null> => {
  // Use pro-preview for complex financial reasoning
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the following financial transactions (all amounts are in Indian Rupees - INR / ₹) and provide a clean, insightful summary.
    Current Date: ${new Date().toLocaleDateString()}
    Transactions: ${JSON.stringify(transactions)}
    
    Note: 'loans' entries represent liabilities or money borrowed.
    
    Please provide:
    1. A concise summary of the financial health (2-3 sentences), specifically mentioning any debt (loans) if relevant.
    2. 3-4 actionable tips to improve savings and manage any debt.
    3. A projected savings amount for the next month based on current trends (return as a number in INR).
    4. Any red flags or warnings (e.g., spending too much on entertainment or excessive borrowing).
    
    Return ONLY a valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projectedSavings: { type: Type.NUMBER },
            warnings: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ['summary', 'tips', 'projectedSavings', 'warnings'],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(cleanedJson) as FinancialInsight;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
