import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const userMessage = form.get("message") as string;
    const language = form.get("language") as string;

    // Collect uploaded images
    const images = form.getAll("images") as File[];

    // Convert images to base64 for Gemini Vision
    const imageParts = [];
    for (const img of images) {
      const arrayBuffer = await img.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      imageParts.push({
        inlineData: {
          data: base64,
          mimeType: img.type,
        },
      });
    }

    // Construct Gemini prompt with vision capabilities
    const geminiPrompt = `
You are an AI healthcare triage assistant.
Analyze the patient's message and any uploaded medical images to provide accurate triage.

Patient's message: "${userMessage}"
Language preference: ${language}

Instructions:
- Carefully analyze any uploaded images for medical symptoms, injuries, or conditions
- Summarize the case clearly based on both the message and visual information
- Classify urgency: CRITICAL / MODERATE / NOT CRITICAL
- Explain your reasoning for the classification
- Suggest safe, generic care steps (e.g., paracetamol for pain, hydration, wound cleaning)
- Recommend appropriate next steps based on severity

IMPORTANT: Always err on the side of caution. If in doubt, recommend seeking professional medical attention.

Return your response as valid JSON only:
{
  "classification": "CRITICAL | MODERATE | NOT CRITICAL",
  "summary": "Brief description of the case",
  "reasoning": "Explanation for the urgency classification",
  "recommended_care": ["List of safe care suggestions"],
  "next_steps": "Rest at Home | Visit Clinic | Go to ER"
}
`;

    // Generate content with both text and images
    const contentArray = [geminiPrompt, ...imageParts];
    const geminiRes = await gemini.generateContent(contentArray);
    const geminiText = geminiRes.response.text();

    let parsed;
    try {
      // Clean the response to extract JSON if it's wrapped in markdown
      const cleanedText = geminiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn("Failed to parse Gemini response as JSON:", parseError);
      parsed = { 
        raw: geminiText,
        error: "Failed to parse response as JSON"
      };
    }

    return NextResponse.json({
      response: parsed,
      images_processed: images.length,
    });

  } catch (err: any) {
    console.error("Chatbot API Error:", err);
    return NextResponse.json({ 
      error: err.message,
      details: "An error occurred while processing your request"
    }, { status: 500 });
  }
}