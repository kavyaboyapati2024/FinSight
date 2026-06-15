import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeFinance } from "./financeAnalyzer.js";

const hasGeminiKey = () => {
  return !!process.env.GEMINI_API_KEY;
};

export const generateAIInsights = async ({ transactions, budget }) => {
  const analysis = analyzeFinance({ transactions, budget });

  if (!hasGeminiKey()) {
    return {
      provider: "heuristic",
      insights: analysis.recommendations || []
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});


    const prompt = `
Analyze this financial summary and provide exactly 4 actionable insights.

Income: ₹${Math.round(analysis.totalIncome)}
Expenses: ₹${Math.round(analysis.totalExpense)}
Savings: ₹${Math.round(analysis.savings)}
Budget Remaining: ₹${Math.round(analysis.budgetRemaining)}
Predicted Expense: ₹${Math.round(analysis.predictedExpense)}

Top Categories:
${analysis.categoryBreakdown
  .slice(0, 3)
  .map(c => `${c.category}: ₹${Math.round(c.amount)}`)
  .join("\n")}

Return each insight on a separate line.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const insights = text
      .split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    return {
      provider: "gemini",
      insights
    };
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return {
      provider: "heuristic",
      insights: analysis.recommendations || []
    };
  }
};

export const predictExpense = async ({ transactions, budget }) => {
  const analysis = analyzeFinance({ transactions, budget });

  return {
    predictedExpense: analysis.predictedExpense,
    confidence: analysis.confidence,
    budgetRisk:
      analysis.monthlyBudget > 0
        ? analysis.predictedExpense >
          analysis.monthlyBudget
        : false,
    recommendations: analysis.recommendations
  };
};