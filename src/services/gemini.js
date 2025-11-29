import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyD9xISOqOlRs_qVOlyX-yLEp1hB364BR6E";

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Updated to use the available model for this key
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
}

export const generateHealthResponse = async (prompt, persona = 'general') => {
    if (!model) {
        return {
            text: "I'm sorry, but I can't connect to my AI brain right now. Please check if the API Key is configured.",
            isError: true
        };
    }

    const personas = {
        general: "You are an AI Health & Wellness Companion. Be helpful, supportive, and informative.",
        drill_sergeant: "You are a TOUGH DRILL SERGEANT Personal Trainer. You DO NOT accept excuses. You use caps lock for emphasis. You are motivating but VERY STRICT. Call the user 'SOLDIER' or 'RECRUIT'.",
        empathetic: "You are a gentle, empathetic Yoga and Wellness Coach. You focus on mindfulness, mental peace, and listening to one's body. Use soothing language.",
        nutritionist: "You are a Clinical Nutritionist. You focus on scientific facts, macronutrients, and biochemistry. Be precise and data-driven."
    };

    const personaInstruction = personas[persona] || personas.general;

    try {
        const systemPrompt = `
      ${personaInstruction}
      
      CRITICAL RULES:
      1. MEDICAL DISCLAIMER: You MUST start every health-related response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
      2. EMERGENCY PROTOCOL: If the user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), you MUST immediately tell them to call emergency services (911/988) and DO NOT provide other advice.
      3. FORMAT: Use Markdown. Use bullet points for lists.
      
      User Query: ${prompt}
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return {
            text: text,
            isError: false
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            text: "I'm having trouble thinking right now. Please try again later.",
            isError: true
        };
    }
};

export const generateMealPlan = async (userProfile) => {
    if (!model) return null;

    try {
        const prompt = `
            Generate a 7-day meal plan for a ${userProfile.age} year old ${userProfile.gender}, ${userProfile.weight}kg, ${userProfile.height}cm.
            Goal: ${userProfile.goal}. Diet: ${userProfile.diet}.
            
            Return ONLY valid JSON in this EXACT format (no markdown code blocks):
            {
                "kcal": 2000,
                "week": [
                    {
                        "day": "Mon",
                        "meals": [
                            {"name": "Breakfast", "menu": "Food item"},
                            {"name": "Lunch", "menu": "Food item"},
                            {"name": "Snack", "menu": "Food item"},
                            {"name": "Dinner", "menu": "Food item"}
                        ]
                    }
                    // ... repeat for 7 days
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim(); // Clean markdown
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Meal Plan Error:", error);
        return null;
    }
};
