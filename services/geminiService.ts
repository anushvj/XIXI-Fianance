

import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialInsight } from "../types.ts";

export const analyzeFinance = async (transactions: Transaction[]): Promise<FinancialInsight | null> => {
  // Always use a direct named parameter with process.env.API_KEY for initialization.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentTransactions = transactions.slice(0, 50);

  const prompt = `
    Perform a deep granular analysis of these financial movements (INR / ₹). 
    Context: 
    - Date: ${new Date().toLocaleDateString()}
    - Dataset: ${JSON.stringify(recentTransactions)}
    
    Analysis Requirements:
    1. Overall health summary (concise).
    2. Category Analysis: For at least 3 high-volume categories, provide a specific insight.
    3. Recurring Expenses: Identify potential subscriptions or repeating bills.
    4. Metrics: Calculate Debt-to-Income Ratio (Total Loans / Total Income) and Savings Rate (Savings / Income).
    5. Actionable tips and Risk warnings.
    
    Return ONLY a JSON object following the schema.
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
            categoryAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  insight: { type: Type.STRING }
                },
                required: ['category', 'insight']
              }
            },
            recurringExpenses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  frequency: { type: Type.STRING }
                },
                required: ['description', 'amount', 'frequency']
              }
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                debtToIncomeRatio: { type: Type.NUMBER },
                savingsRate: { type: Type.NUMBER }
              },
              required: ['debtToIncomeRatio', 'savingsRate']
            }
          },
          required: ['summary', 'tips', 'projectedSavings', 'warnings', 'categoryAnalysis', 'recurringExpenses', 'metrics'],
        },
      },
    });

    // Access the text property directly on the response object.
    const text = response.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(cleanedJson) as FinancialInsight;
  } catch (error) {
    console.error("Gemini Advisor Failure:", error);
    throw error;
  }
};
