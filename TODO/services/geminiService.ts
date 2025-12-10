import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const breakDownTaskWithAI = async (taskTitle: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key not found. Returning empty suggestion list.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Break down the following study task into 3 to 5 smaller, actionable sub-tasks: "${taskTitle}". Keep them concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const json = JSON.parse(text);
    return json.subtasks || [];
  } catch (error) {
    console.error("Error breaking down task with Gemini:", error);
    return [];
  }
};