import { GoogleGenAI } from "@google/genai";
import { DepartmentData } from "../types";

export const generateDashboardInsights = async (departmentData: DepartmentData, query?: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key is missing. AI features disabled.");
    return "AI Analyst is currently offline. Please configure the API Key to enable insights.";
  }

  try {
    // Initialize client lazily to avoid top-level crashes during module loading
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash-preview";
    
    const prompt = `
      You are a senior Business Intelligence Analyst for a large import/export company dealing in chemicals and textiles.
      Analyze the following JSON data for the ${departmentData.name} department.
      
      Data:
      ${JSON.stringify(departmentData.kpis)}
      ${JSON.stringify(departmentData.mainChartData)}
  
      User Query: ${query || "Provide a concise executive summary of the current performance, highlighting any critical risks or positive trends."}
  
      Keep the response professional, concise, and actionable. Format as a short paragraph or bullet points.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please try again later.";
  }
};