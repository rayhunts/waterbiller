import { LandingPage } from "@/components/landing-page";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "WaterBiller - Modern Water Billing Management" },
    { name: "description", content: "Modern water billing management system for efficient billing and analytics" },
  ];
}

export default function Home() {
  return <LandingPage />;
}
