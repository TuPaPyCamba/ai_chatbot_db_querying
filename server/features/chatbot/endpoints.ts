import { NextResponse } from "next/server";
import { chatWithData } from "../../services/ai/groq";

export async function chatEndpoint(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    const responseText = await chatWithData(body.messages);
    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
