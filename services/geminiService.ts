
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBuildResults = async (logs: string[], configName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze these Android build logs for device 'sanders' (Motorola G5S Plus) 
        and the build named '${configName}'.
        
        Logs Summary:
        ${logs.slice(-50).join('\n')}
        
        Generate a professional, futuristic technical summary including:
        1. Success Probability Score (0-100)
        2. Detected potential optimizations
        3. A "Cyber-Manifesto" quote about the firmware.
        
        Format in short Markdown.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "Analysis offline. Neural link severed.";
  }
};
