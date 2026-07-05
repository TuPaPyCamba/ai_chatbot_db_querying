import { NextRequest } from "next/server";
import { routeAuthRequest } from "@/server/features/auth/routes";

type RouteParams = {
  action: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { action } = await context.params;
  return routeAuthRequest(action, request);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { action } = await context.params;
  return routeAuthRequest(action, request);
}
