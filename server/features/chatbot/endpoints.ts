import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "../../utils/local_functions/cryptoHelper";
import {
  getSessions,
  getSession,
  createSession,
  addMessageToSession,
  deleteSession,
} from "../../services/database/chats";
import { chatWithData } from "../../services/ai/groq";

async function getAuthUserEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_session")?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  return payload ? payload.email : null;
}

export async function getSessionsEndpoint(): Promise<Response> {
  const email = await getAuthUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await getSessions(email);
  return NextResponse.json({ sessions });
}

export async function createSessionEndpoint(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    // Direct chat validation (if messages array is provided)
    if (body.messages && Array.isArray(body.messages)) {
      const responseText = await chatWithData(body.messages);
      return NextResponse.json({ response: responseText });
    }

    // Standard session creation
    const email = await getAuthUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await createSession(email, body.title || "New Conversation");
    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}

export async function getMessagesEndpoint(sessionId: string): Promise<Response> {
  const email = await getAuthUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSession(email, sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ messages: session.messages });
}

export async function postMessageEndpoint(request: Request, sessionId: string): Promise<Response> {
  const email = await getAuthUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const session = await getSession(email, sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 1. Add User Message to Database
    const userMsg = await addMessageToSession(email, sessionId, "user", content);

    // 2. Fetch full history for this session from database and map to ChatMessage format
    const history = session.messages.map((m) => ({
      role: m.role as any,
      content: m.content,
    }));

    // 3. Call AI Service (NVIDIA NIM with tool calling loop)
    const aiContent = await chatWithData(history);

    // 4. Add AI Response Message to Database
    const assistantMsg = await addMessageToSession(email, sessionId, "assistant", aiContent);

    return NextResponse.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      sessionTitle: session.title, // Send back title in case it got updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process message" }, { status: 500 });
  }
}

export async function deleteSessionEndpoint(sessionId: string): Promise<Response> {
  const email = await getAuthUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteSession(email, sessionId);
  return NextResponse.json({ success: true });
}
