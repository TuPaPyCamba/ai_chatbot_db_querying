import { NextRequest } from "next/server";
import { routeChatRequest } from "@/server/features/chatbot/routes";

type RouteParams = {
  sessionId: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { sessionId } = await context.params;
  return routeChatRequest("GET", request, sessionId);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { sessionId } = await context.params;
  return routeChatRequest("POST", request, sessionId);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { sessionId } = await context.params;
  return routeChatRequest("DELETE", request, sessionId);
}
