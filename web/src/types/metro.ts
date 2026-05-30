// ─── Metro domain types ───────────────────────────────────────────────────────

export type LineKey = "azul" | "verde" | "vermelho" | "amarelo" | "lilas" | "rubi";

export interface LineInfo {
  color: string;
  label: string;
  accent: string;
}

export interface Station {
  id: string;
  x: number;
  y: number;
  lines: LineKey[];
}

export interface Edge {
  from: string;
  to: string;
  line: LineKey;
}

export interface MetroGraph {
  nodes: Station[];
  edges: Edge[];
}

// Shape returned by the backend (or mock)
export interface RouteResponse {
  nodes: Station[];
  edges: Edge[];
  path: string[];
}

// Internal graph representation for Dijkstra
export type AdjacencyList = Record<string, Array<{ to: string; w: number; line: LineKey }>>;

export interface RouteInfo {
  stops: number;
  transfers: number;
  lines: LineKey[];
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}
