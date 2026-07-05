import type { Metadata } from "next";
import SignInView from "./SignInView";

export const metadata: Metadata = {
  title: "Sign In - ChatSphere AI",
  description: "Access your secure chatbot dashboard and converse with ChatSphere AI.",
};

export default function Page() {
  return <SignInView />;
}
