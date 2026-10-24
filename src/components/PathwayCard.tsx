import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Pathway } from "@/data/pathways";
import { usePathwaySelection } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PathwayCard({ pathway, selectable = false }: { pathway: Pathway; selectable?: boolean }) {
  const { isSelected, isFavorite, toggleSelected, toggleFavorite } = usePathwaySelection();
  const sel = isSelected(pathway.id);
  const fav = isFavorite(pathway.id);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring",
        sel && selectable && "border-primary",
      )}
    >
      {selectable && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(pathway.id)}
            disabled={!sel}
            aria-pressed={fav}
            aria-label={sel ? (fav ? "Remove from favorites" : "Add to favorites") : "Add to dashboard to favorite"}
            title={sel ? "Favorite" : "Add to your dashboard first"}
            className="grid h-8 w-8 place-items-center rounded-md bg-card/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Star className={cn("h-4 w-4", fav ? "fill-star text-star" : "text-muted-foreground")} />
          </button>
          <label className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-card/90">
            <Checkbox
              checked={sel}
              onCheckedChange={() => toggleSelected(pathway.id)}
              aria-label={`Add ${pathway.title} to dashboard`}
            />
          </label>
        </div>
      )}
      <Link to="/pathways/$id" params={{ id: pathway.id }} className="flex flex-1 flex-col outline-none">
        <div className="aspect-[4/3] overflow-hidden bg-ink">
          <img src={pathway.image} alt="" loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{pathway.title}</h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{pathway.short}</p>
          <p className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {pathway.estimatedTime}
          </p>
        </div>
      </Link>
    </article>
  );
}
