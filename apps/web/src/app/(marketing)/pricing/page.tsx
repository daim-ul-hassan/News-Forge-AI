import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Pricing",
};

const tiers = [
  {
    name: "Starter",
    price: "—",
    description: "For individual creators getting started.",
    features: ["Dashboard access", "Basic research tools", "Limited AI assistant"],
  },
  {
    name: "Pro",
    price: "—",
    description: "For professionals who publish daily.",
    features: ["Full trend radar", "Content studio", "Priority AI assistant", "Creator profile"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "—",
    description: "For newsrooms and content teams.",
    features: ["Team workspaces", "Shared research", "Usage analytics", "Admin controls"],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-mono text-4xl font-bold">Pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Plans and billing integration coming soon. Pricing details will be available when subscription endpoints are live.
        </p>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={tier.highlighted ? "border-primary forge-glow" : undefined}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xl font-bold">{tier.price}</p>
              <p className="mt-1 text-xs text-muted-foreground">TODO: connect to /api/v1/subscription</p>
              <ul className="mt-6 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.highlighted ? "default" : "outline"} asChild>
                <Link href={appRoutes.dashboard}>Get started</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
