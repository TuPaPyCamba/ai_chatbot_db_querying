import { chatEndpoint } from "./endpoints";

export async function routeChatRequest(
  method: string,
  request: Request
): Promise<Response> {
  if (method === "POST") {
    return chatEndpoint(request);
  }

  return new Response("Method Not Allowed", { status: 405 });
}
