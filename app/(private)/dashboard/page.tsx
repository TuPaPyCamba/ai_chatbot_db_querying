import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/server/utils/local_functions/cryptoHelper";
import View from "./View";

export const metadata: Metadata = {
  title: "Chat - ChatSphere AI",
  description: "Converse with ChatSphere AI, explore your chatbot history, and query metadata.",
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_session")?.value;

  if (!token) {
    redirect("/signin");
  }

  const user = verifySessionToken(token);
  if (!user) {
    redirect("/signin");
  }

  return <View user={user} />;
}
