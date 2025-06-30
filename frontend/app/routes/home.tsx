import type { Route } from "./+types/home";
import SpamChecker from "components/spam-checker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Spam Checker" },
    { name: "description", content: "Check if a message is spam or not" },
  ];
}

export default function Home() {
  return <SpamChecker />;
}
