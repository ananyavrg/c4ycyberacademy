import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, Flame, Gauge, Layers, NotebookPen, Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SiteNav } from "@/components/SiteNav";
import { MetricCard, ProgressBar } from "@/components/ProgressBar";
import { getLesson, getPathway, pathways } from "@/data/pathways";
import { sampleActivity, sampleStats, sampleUser } from "@/data/sample";
import { pathwayPercent, useCompleted, useNotes, usePathwaySelection, useTasks, useVisited } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "journal" | "lessons";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab; lesson?: string } => ({
    tab: ["dashboard", "journal", "lessons"].includes(s.tab as string) ? (s.tab as Tab) : undefined,
    lesson: typeof s.lesson === "string" ? s.lesson : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your Dashboard — C4Y CyberAcademy" },
      { name: "description", content: "Track progress, journal notes and lessons across your cybersecurity pathways." },
      { property: "og:title", content: "Your Dashboard — C4Y CyberAcademy" },
      { property: "og:description", content: "Track your cybersecurity learning progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tab = "dashboard", lesson } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Hi, {sampleUser.firstName}! Excited to learn with you today!
        </h1>
        <Tabs value={tab} onValueChange={(v) => navigate({ search: { tab: v as Tab } })} className="mt-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6"><Overview /></TabsContent>
          <TabsContent value="journal" className="mt-6"><Journal initial={lesson} /></TabsContent>
          <TabsContent value="lessons" className="mt-6"><LessonsTab /></TabsContent>
        </Tabs>
      </main>
    </>
  );
}

function useActive() {
  const { selected } = usePathwaySelection();
  return pathways.filter((p) => selected.includes(p.id));
}

function Overview() {
  const active = useActive();
  const [completed] = useCompleted();
  const all = active.flatMap((p) => p.lessons.map((l) => l.id));
  const overall = pathwayPercent(all, completed);
  const phase = overall < 34 ? "Beginner" : overall < 67 ? "Intermediate" : "Advanced";
  const h = Math.floor(sampleStats.minutesInvested / 60);
  const m = sampleStats.minutesInvested % 60;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Overall Progress" value={`${overall}%`} hint={`${active.length} active pathway${active.length === 1 ? "" : "s"}`} icon={<Gauge className="h-4 w-4" />} />
        <MetricCard label="Current Streak" value={`${sampleStats.streakDays} days`} hint="Keep it going!" icon={<Flame className="h-4 w-4" />} />
        <MetricCard label="Current Phase" value={phase} icon={<Layers className="h-4 w-4" />} />
        <MetricCard label="Time Invested" value={`${h}h ${m}m`} hint="All time" icon={<Clock className="h-4 w-4" />} />
      </div>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Learning activity</h2>
        <p className="text-sm text-muted-foreground">Minutes per day, this week</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleActivity} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="minutes" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Your Pathway Progress</h2>
        {active.length === 0 ? (
          <EmptyPathways />
        ) : (
          <div className="mt-4 space-y-6">
            {active.map((p) => (
              <div key={p.id}>
                <Link to="/pathways/$id" params={{ id: p.id }} className="text-sm font-medium hover:text-primary">{p.title}</Link>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {p.lessons.map((l) => (
                    <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_1fr] items-center gap-3 text-xs">
                      <span className="truncate text-muted-foreground">{l.title}</span>
                      <ProgressBar value={completed.includes(l.id) ? 100 : 0} label={l.title} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <WeeklyChecklist />
    </div>
  );
}

function EmptyPathways() {
  return (
    <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
      <p className="text-muted-foreground">You haven't added any pathways yet.</p>
      <Button asChild className="mt-4"><Link to="/pathways">Explore pathways</Link></Button>
    </div>
  );
}

function WeeklyChecklist() {
  const [tasks, setTasks] = useTasks();
  const [text, setText] = useState("");
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTasks((ts) => [...ts, { id: crypto.randomUUID(), text: t, done: false, custom: true }]);
    setText("");
  };
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="font-semibold">This Week</h2>
      <ul className="mt-4 space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className={cn("flex items-center gap-3 rounded-lg border p-3", t.done && "bg-muted")}>
            <Checkbox
              id={`task-${t.id}`}
              checked={t.done}
              onCheckedChange={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
            />
            <label htmlFor={`task-${t.id}`} className={cn("min-w-0 flex-1 cursor-pointer text-sm", t.done && "text-muted-foreground line-through")}>
              {t.text}
            </label>
            {t.custom && (
              <button
                onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))}
                className="rounded p-1 text-muted-foreground hover:bg-background hover:text-destructive"
                aria-label={`Remove task ${t.text}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" aria-label="New task" />
        <Button type="submit" variant="secondary"><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </form>
    </section>
  );
}

function Journal({ initial }: { initial?: string }) {
  const [visited, setVisited] = useVisited();
  const [notes, setNotes] = useNotes();
  const [current, setCurrent] = useState<string | undefined>(initial);

  useEffect(() => {
    if (initial && getLesson(initial)) {
      setVisited((v) => (v.includes(initial) ? v : [initial, ...v]));
      setCurrent(initial);
    }
  }, [initial, setVisited]);

  const active = current ?? visited[0];
  const info = active ? getLesson(active) : undefined;

  if (visited.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-10 text-center">
        <NotebookPen className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 font-semibold">Your journal is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Open a pathway and click the notebook icon beside any lesson to start a journal entry for it.
        </p>
        <Button asChild className="mt-5"><Link to="/pathways">Browse pathways</Link></Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <nav aria-label="Visited lessons" className="rounded-xl border bg-card p-2">
        <ul className="space-y-1">
          {visited.map((id) => {
            const x = getLesson(id);
            if (!x) return null;
            return (
              <li key={id}>
                <button
                  onClick={() => setCurrent(id)}
                  aria-current={id === active}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted",
                    id === active && "bg-accent text-accent-foreground",
                  )}
                >
                  <span className="block truncate font-medium">{x.lesson.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{x.pathway.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {info && (
        <section className="rounded-xl border bg-card p-5">
          <p className="eyebrow">{info.pathway.title}</p>
          <h2 className="mt-1 text-lg font-semibold">{info.lesson.title}</h2>
          <Textarea
            key={active}
            value={notes[active!] ?? ""}
            onChange={(e) => setNotes((n) => ({ ...n, [active!]: e.target.value }))}
            placeholder="Write your notes for this lesson…"
            aria-label={`Notes for ${info.lesson.title}`}
            className="mt-4 min-h-72 font-mono text-sm"
          />
          <p className="mt-2 text-xs text-muted-foreground">Saved automatically</p>
        </section>
      )}
    </div>
  );
}

function LessonsTab() {
  const active = useActive();
  const [completed] = useCompleted();
  if (active.length === 0) return <EmptyPathways />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {active.map((p) => {
        const pct = pathwayPercent(p.lessons.map((l) => l.id), completed);
        return (
          <Link
            key={p.id}
            to="/pathways/$id"
            params={{ id: p.id }}
            hash="lessons"
            className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className="aspect-[16/9] overflow-hidden bg-ink">
              <img src={getPathway(p.id)!.image} alt="" loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="font-semibold">{p.title}</h3>
              <ProgressBar value={pct} label={`${p.title} progress`} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
