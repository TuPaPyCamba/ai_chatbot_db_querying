import type { Metadata } from "next";
import SignUpView from "./SignUpView";

export const metadata: Metadata = {
  title: "Sign Up - ChatSphere AI",
  description: "Create your secure ChatSphere account to chat with advanced AI.",
};

export default function Page() {
  return <SignUpView />;
}
