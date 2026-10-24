import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock, NotebookPen, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteNav } from "@/components/SiteNav";
import { ProgressBar } from "@/components/ProgressBar";
import { getPathway } from "@/data/pathways";
import { pathwayPercent, useCompleted, usePathwaySelection } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pathways/$id")({
  loader: ({ params }) => {
    const p = getPathway(params.id);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getPathway(loaderData.id) : undefined;
    const title = p ? `${p.title} — C4Y CyberAcademy` : "Pathway not found";
    return {
      meta: [
        { title },
        { name: "description", content: p?.short ?? "Pathway" },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.short ?? "Pathway" },
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { id } = Route.useLoaderData();
  const p = getPathway(id)!;
  const { isSelected, isFavorite, toggleSelected, toggleFavorite } = usePathwaySelection();
  const [completed, setCompleted] = useCompleted();
  const sel = isSelected(id);
  const fav = isFavorite(id);
  const pct = pathwayPercent(p.lessons.map((l) => l.id), completed);

  return (
    <>
      <SiteNav />
      <main>
        <section className="relative bg-ink text-ink-foreground">
          <img src={p.image} alt="" width={1024} height={768} className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <Link to="/pathways" className="eyebrow text-signal hover:underline">← All pathways</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{p.title}</h1>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 font-mono text-sm">
              <Clock className="h-4 w-4 text-signal" /> Estimated time: {p.estimatedTime}
            </p>
          </div>
        </section>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-semibold">What you'll study</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
            <h2 id="lessons" className="mt-10 text-xl font-semibold">Lessons</h2>
            <ol className="mt-4 divide-y rounded-xl border bg-card">
              {p.lessons.map((l, i) => {
                const done = completed.includes(l.id);
                return (
                  <li key={l.id} className="flex items-center gap-4 p-4">
                    <Checkbox
                      checked={done}
                      onCheckedChange={() =>
                        setCompleted((c) => (c.includes(l.id) ? c.filter((x) => x !== l.id) : [...c, l.id]))
                      }
                      aria-label={`Mark ${l.title} complete`}
                    />
                    <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("min-w-0 flex-1", done && "text-muted-foreground line-through")}>{l.title}</span>
                    <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{l.minutes} min</span>
                    <Link
                      to="/dashboard"
                      search={{ tab: "journal", lesson: l.id }}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                      aria-label={`Open notes for ${l.title}`}
                    >
                      <NotebookPen className="h-4 w-4" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside className="h-fit space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">Your progress</p>
            <ProgressBar value={pct} label={`${p.title} progress`} />
            {sel ? (
              <Button variant="secondary" className="w-full" onClick={() => toggleSelected(id)}>
                <Check className="mr-1 h-4 w-4 text-primary" /> Added to dashboard
              </Button>
            ) : (
              <Button className="w-full" onClick={() => toggleSelected(id)}>
                <Plus className="mr-1 h-4 w-4" /> Add to dashboard
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              disabled={!sel}
              aria-pressed={fav}
              onClick={() => toggleFavorite(id)}
              title={sel ? undefined : "Add to your dashboard first"}
            >
              <Star className={cn("mr-1 h-4 w-4", fav && "fill-star text-star")} />
              {fav ? "Favorited" : "Favorite"}
            </Button>
            {!sel && <p className="text-xs text-muted-foreground">Add this pathway to your dashboard to favorite it.</p>}
          </aside>
        </div>
      </main>
    </>
  );
}
