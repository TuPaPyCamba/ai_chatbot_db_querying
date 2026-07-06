import type { Metadata } from "next";
import View from "./View";

export const metadata: Metadata = {
  title: "Chat - ChatSphere AI",
  description: "Converse with ChatSphere AI, explore your chatbot history, and query metadata.",
};

export default function Page() {
  return <View />;
}
