import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CatalogStateProvider, useCatalogState } from "@/lib/catalog-state";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CatalogStateProvider>{children}</CatalogStateProvider>
);

beforeEach(() => {
  localStorage.clear();
});

describe("Сравнение", () => {
  it("добавление и удаление позиции", () => {
    const { result } = renderHook(() => useCatalogState(), { wrapper });
    act(() => result.current.toggleCompare("GES-00001"));
    expect(result.current.inCompare("GES-00001")).toBe(true);
    act(() => result.current.toggleCompare("GES-00001"));
    expect(result.current.inCompare("GES-00001")).toBe(false);
  });

  it("не больше 4 позиций в сравнении", () => {
    const { result } = renderHook(() => useCatalogState(), { wrapper });
    act(() => {
      ["a", "b", "c", "d", "e"].forEach((id) => result.current.toggleCompare(id));
    });
    expect(result.current.compareIds.length).toBe(4);
  });

  it("очистка сравнения", () => {
    const { result } = renderHook(() => useCatalogState(), { wrapper });
    act(() => {
      result.current.toggleCompare("a");
      result.current.toggleCompare("b");
    });
    act(() => result.current.clearCompare());
    expect(result.current.compareIds.length).toBe(0);
  });

  it("сохранение в localStorage", () => {
    const { result } = renderHook(() => useCatalogState(), { wrapper });
    act(() => result.current.toggleCompare("GES-00010"));
    expect(localStorage.getItem("ges.compare")).toContain("GES-00010");
  });
});

describe("Избранное", () => {
  it("добавление и удаление", () => {
    const { result } = renderHook(() => useCatalogState(), { wrapper });
    act(() => result.current.toggleFavorite("GES-00006"));
    expect(result.current.inFavorites("GES-00006")).toBe(true);
    act(() => result.current.toggleFavorite("GES-00006"));
    expect(result.current.inFavorites("GES-00006")).toBe(false);
  });

  it("состояние переживает перемонтирование (localStorage)", () => {
    const first = renderHook(() => useCatalogState(), { wrapper });
    act(() => first.result.current.toggleFavorite("GES-00011"));
    expect(localStorage.getItem("ges.favorites")).toContain("GES-00011");
    // Новый провайдер читает сохранённое состояние из localStorage при монтировании.
    const second = renderHook(() => useCatalogState(), { wrapper });
    expect(second.result.current.inFavorites("GES-00011")).toBe(true);
  });
});
