import Link from "next/link";

import { ParticleField } from "@/components/effects/particle-field";
import { Button } from "@/components/ui/button";
import { appRoutes, marketingRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <ParticleField />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Content Intelligence Platform
            </p>
            <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Forge smarter stories with{" "}
              <span className="text-primary">AI-powered</span> insight
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {siteConfig.description} Built for creators, journalists and storytellers who need clarity before they publish.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={appRoutes.dashboard}>Open dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={marketingRoutes.features}>Explore features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-mono text-2xl font-semibold">Built for modern creators</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Research, trends, opportunities and content workflows in one intelligent workspace.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Research Center", desc: "Deep-dive into topics with structured research tools." },
              { title: "Trend Radar", desc: "Spot emerging stories before they peak." },
              { title: "Content Studio", desc: "Turn insights into publish-ready briefs." },
            ].map((feature) => (
              <div key={feature.title} className="forge-glow-hover rounded-lg border border-border bg-background p-6">
                <h3 className="font-mono font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
