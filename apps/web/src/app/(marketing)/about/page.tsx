import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mono text-4xl font-bold">About News Forge AI</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          News Forge AI is an AI-powered content intelligence platform built for creators who need to research faster,
          spot trends earlier and publish with confidence.
        </p>
        <div className="mt-12 space-y-8">
          <section>
            <h2 className="font-mono text-xl font-semibold">Our mission</h2>
            <p className="mt-3 text-muted-foreground">
              Give every creator, journalist and storyteller access to the same caliber of research and insight tools
              that major newsrooms rely on — without the complexity.
            </p>
          </section>
          <section>
            <h2 className="font-mono text-xl font-semibold">Who we serve</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
              <li>YouTubers and video creators</li>
              <li>Journalists and news writers</li>
              <li>Bloggers and newsletter authors</li>
              <li>WhatsApp and social content creators</li>
              <li>TikTok and short-form creators</li>
              <li>Educational and explainer creators</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
