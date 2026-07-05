import type { Metadata } from "next";
import LandingView from "./LandingView";

export const metadata: Metadata = {
  title: "ChatSphere AI - Premium Conversational Platform",
  description: "Engage in intelligent, contextual conversations, query data dynamically, and simplify your daily workflows with ChatSphere.",
};

export default function Page() {
  return <LandingView />;
}
