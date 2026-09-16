"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const COMPARE_KEY = "ges.compare";
const FAV_KEY = "ges.favorites";
const MAX_COMPARE = 4;

type CatalogStateValue = {
  compareIds: string[];
  favoriteIds: string[];
  toggleCompare: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearCompare: () => void;
  inCompare: (id: string) => boolean;
  inFavorites: (id: string) => boolean;
};

const CatalogStateContext = createContext<CatalogStateValue | null>(null);

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function CatalogStateProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompareIds(readList(COMPARE_KEY));
    setFavoriteIds(readList(FAV_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds, ready]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const value = useMemo<CatalogStateValue>(
    () => ({
      compareIds,
      favoriteIds,
      toggleCompare,
      toggleFavorite,
      clearCompare,
      inCompare: (id) => compareIds.includes(id),
      inFavorites: (id) => favoriteIds.includes(id),
    }),
    [compareIds, favoriteIds, toggleCompare, toggleFavorite, clearCompare],
  );

  return <CatalogStateContext.Provider value={value}>{children}</CatalogStateContext.Provider>;
}

export function useCatalogState() {
  const ctx = useContext(CatalogStateContext);
  if (!ctx) throw new Error("useCatalogState must be used within CatalogStateProvider");
  return ctx;
}
