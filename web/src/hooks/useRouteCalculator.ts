import { useState, useMemo, useCallback } from "react";
import { METRO_DATA } from "../data/metroData";
import { buildAdjacencyList, dijkstra } from "../utils/dijkstra";
import type { RouteInfo, LineKey } from "../types/metro";

interface UseRouteCalculatorReturn {
  origin: string;
  dest: string;
  path: string[];
  info: RouteInfo | null;
  calculating: boolean;
  setOrigin: (s: string) => void;
  setDest: (s: string) => void;
  calcRoute: () => void;
  randomRoute: () => void;
  swapStations: () => void;
  clearRoute: () => void;
}

export function useRouteCalculator(): UseRouteCalculatorReturn {
  const [origin,      setOriginState] = useState<string>("");
  const [dest,        setDestState]   = useState<string>("");
  const [path,        setPath]        = useState<string[]>([]);
  const [info,        setInfo]        = useState<RouteInfo | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  // Build graph once (memoised — never changes for static data)
  const graph = useMemo(
    () => buildAdjacencyList(METRO_DATA.nodes, METRO_DATA.edges),
    []
  );

  const buildRouteInfo = useCallback(
    (routePath: string[]): RouteInfo => {
      const lines = new Set<LineKey>();
      routePath.forEach((s, i) => {
        if (i === 0) return;
        const edge = METRO_DATA.edges.find(
          (e) =>
            (e.from === routePath[i - 1] && e.to === s) ||
            (e.to   === routePath[i - 1] && e.from === s)
        );
        if (edge) lines.add(edge.line as LineKey);
      });
      return {
        stops:     routePath.length - 1,
        transfers: Math.max(0, lines.size - 1),
        lines:     [...lines],
      };
    },
    []
  );

  const setOrigin = useCallback((s: string) => {
    setOriginState(s);
    setPath([]);
    setInfo(null);
  }, []);

  const setDest = useCallback((s: string) => {
    setDestState(s);
    setPath([]);
    setInfo(null);
  }, []);

  const calcRoute = useCallback(() => {
    if (!origin || !dest || origin === dest) return;
    setCalculating(true);

    // Tiny timeout so the UI can repaint the "calculating" state first
    setTimeout(() => {
      const result = dijkstra(graph, origin, dest);
      setPath(result);
      setInfo(result.length > 0 ? buildRouteInfo(result) : null);
      setCalculating(false);
    }, 400);
  }, [origin, dest, graph, buildRouteInfo]);

  const randomRoute = useCallback(() => {
    const nodes = METRO_DATA.nodes;
    let a: string, b: string;
    do { a = nodes[Math.floor(Math.random() * nodes.length)].id; } while (!a);
    do { b = nodes[Math.floor(Math.random() * nodes.length)].id; } while (b === a);

    setOriginState(a);
    setDestState(b);

    setTimeout(() => {
      const result = dijkstra(graph, a, b);
      setPath(result);
      setInfo(result.length > 0 ? buildRouteInfo(result) : null);
    }, 100);
  }, [graph, buildRouteInfo]);

  const swapStations = useCallback(() => {
    setOriginState(dest);
    setDestState(origin);
    setPath([]);
    setInfo(null);
  }, [origin, dest]);

  const clearRoute = useCallback(() => {
    setOriginState("");
    setDestState("");
    setPath([]);
    setInfo(null);
  }, []);

  return {
    origin, dest, path, info, calculating,
    setOrigin, setDest, calcRoute, randomRoute, swapStations, clearRoute,
  };
}
