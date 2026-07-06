import {
  getSessionsEndpoint,
  createSessionEndpoint,
  getMessagesEndpoint,
  postMessageEndpoint,
  deleteSessionEndpoint,
} from "./endpoints";

export async function routeChatRequest(
  method: string,
  request: Request,
  sessionId?: string
): Promise<Response> {
  if (!sessionId) {
    if (method === "GET") {
      return getSessionsEndpoint();
    }
    if (method === "POST") {
      return createSessionEndpoint(request);
    }
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Session-specific actions
  if (method === "GET") {
    return getMessagesEndpoint(sessionId);
  }
  if (method === "POST") {
    return postMessageEndpoint(request, sessionId);
  }
  if (method === "DELETE") {
    return deleteSessionEndpoint(sessionId);
  }

  return new Response("Method Not Allowed", { status: 405 });
}
