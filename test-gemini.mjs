import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD9xISOqOlRs_qVOlyX-yLEp1hB364BR6E";

async function test() {
    console.log("Testing Gemini API with key:", API_KEY.slice(0, 10) + "...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `
      You are an AI Health & Wellness Companion. 
      Your goal is to provide helpful, supportive, and informative advice on health, wellness, nutrition, and fitness.
      
      CRITICAL RULES:
      1. MEDICAL DISCLAIMER: You MUST start every health-related response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
      2. EMERGENCY PROTOCOL: If the user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), you MUST immediately tell them to call emergency services (911/988) and DO NOT provide other advice.
      3. TONE: Be empathetic, professional, and encouraging.
      4. FORMAT: Use Markdown. Use bullet points for lists (like recommended foods or medications).
      
      User Query: hi how are u
    `;

        console.log("Sending request with System Prompt...");
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("SUCCESS! Response:", text);
    } catch (error) {
        console.error("FAILURE! Error details:");
        console.error(error);
    }
}

test();
