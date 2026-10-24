import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { PathwayCard } from "@/components/PathwayCard";
import { pathways } from "@/data/pathways";

export const Route = createFileRoute("/pathways/")({
  head: () => ({
    meta: [
      { title: "Pathways — C4Y CyberAcademy" },
      { name: "description", content: "Choose cybersecurity pathways to add to your learning dashboard." },
      { property: "og:title", content: "Pathways — C4Y CyberAcademy" },
      { property: "og:description", content: "Choose cybersecurity pathways to add to your dashboard." },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pathways</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Tick a pathway to add it to your dashboard. Once added, you can star it as a favorite.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map((p) => <PathwayCard key={p.id} pathway={p} selectable />)}
        </div>
      </main>
    </>
  );
}
