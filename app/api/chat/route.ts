import { NextRequest, NextResponse } from "next/server";
import { chatConDatos } from "@/server/services/ai/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    // Pass history to chatConDatos function in Groq
    const reply = await chatConDatos(messages);

    // Return the final response in JSON format: { role: 'assistant', content: '...' }
    return NextResponse.json({
      role: "assistant",
      content: reply,
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
