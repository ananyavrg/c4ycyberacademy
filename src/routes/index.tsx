import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/SiteNav";
import { PathwayCard } from "@/components/PathwayCard";
import { pathways } from "@/data/pathways";
import hero from "@/assets/hero-circuit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C4Y CyberAcademy — Where curiosity meets cybersecurity" },
      { name: "description", content: "Learn cybersecurity through guided pathways in network security, ethical hacking, cryptography and forensics." },
      { property: "og:title", content: "C4Y CyberAcademy" },
      { property: "og:description", content: "Where curiosity meets cybersecurity." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <img src={hero} alt="" width={1920} height={800} className="absolute inset-0 h-full w-full object-cover object-right opacity-90" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-36">
            <p className="eyebrow text-signal">// cybersecurity learning platform</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">C4Y CyberAcademy</h1>
            <p className="mt-4 max-w-xl text-lg text-ink-foreground/75 sm:text-xl">Where curiosity meets cybersecurity.</p>
          </div>
        </section>
        <div className="mx-auto flex max-w-6xl justify-center px-4 py-10 sm:px-6">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/pathways">
              Get Started Today <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <p className="eyebrow">Pathways</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Explore Our Pathways</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((p) => <PathwayCard key={p.id} pathway={p} />)}
          </div>
        </section>
      </main>
    </>
  );
}
