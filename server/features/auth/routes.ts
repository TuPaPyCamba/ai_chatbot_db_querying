import { loginEndpoint, signupEndpoint, meEndpoint, logoutEndpoint } from "./endpoints";

export async function routeAuthRequest(action: string, request: Request): Promise<Response> {
  switch (action) {
    case "signin":
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      return loginEndpoint(request);
    
    case "signup":
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      return signupEndpoint(request);
      
    case "me":
      if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405 });
      return meEndpoint(request);
      
    case "logout":
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      return logoutEndpoint();
      
    default:
      return new Response("Not Found", { status: 404 });
  }
}
