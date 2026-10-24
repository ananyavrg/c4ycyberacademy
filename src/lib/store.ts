// Browser-storage prototype store. Swap these hooks for API calls later.
import { useCallback, useEffect, useState } from "react";
import { defaultCompleted, defaultTasks } from "@/data/sample";

const EVT = "c4y-store";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read(key, fallback));
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(read(key, fallback));
    };
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
      localStorage.setItem(key, JSON.stringify(next));
      setValue(next);
      window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set] as const;
}

export type Task = { id: string; text: string; done: boolean; custom: boolean };

export function usePathwaySelection() {
  const [selected, setSelected] = usePersisted<string[]>("c4y.selected", []);
  const [favorites, setFavorites] = usePersisted<string[]>("c4y.favorites", []);
  const isSelected = (id: string) => selected.includes(id);
  const isFavorite = (id: string) => favorites.includes(id);
  const toggleSelected = (id: string) => {
    if (selected.includes(id)) {
      setSelected((s) => s.filter((x) => x !== id));
      setFavorites((f) => f.filter((x) => x !== id)); // can't favorite unselected
    } else setSelected((s) => [...s, id]);
  };
  const toggleFavorite = (id: string) => {
    if (!selected.includes(id)) return;
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };
  return { selected, isSelected, isFavorite, toggleSelected, toggleFavorite };
}

export const useCompleted = () => usePersisted<string[]>("c4y.completed", defaultCompleted);
export const useTasks = () => usePersisted<Task[]>("c4y.tasks", defaultTasks);
export const useVisited = () => usePersisted<string[]>("c4y.visited", []);
export const useNotes = () => usePersisted<Record<string, string>>("c4y.notes", {});

export function pathwayPercent(lessonIds: string[], completed: string[]) {
  if (!lessonIds.length) return 0;
  return Math.round((lessonIds.filter((l) => completed.includes(l)).length / lessonIds.length) * 100);
}
