import type { Station, Edge, AdjacencyList, LineKey } from "../types/metro";

/** Build an undirected weighted adjacency list from nodes + edges. */
export function buildAdjacencyList(
  nodes: Station[],
  edges: Edge[]
): AdjacencyList {
  const graph: AdjacencyList = {};

  nodes.forEach((n) => {
    graph[n.id] = [];
  });

  edges.forEach((e) => {
    const a = nodes.find((n) => n.id === e.from);
    const b = nodes.find((n) => n.id === e.to);
    if (!a || !b) return;

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const w  = Math.sqrt(dx * dx + dy * dy);

    graph[e.from]?.push({ to: e.to,   w, line: e.line as LineKey });
    graph[e.to]?.push(  { to: e.from, w, line: e.line as LineKey });
  });

  return graph;
}

/** Classic Dijkstra — returns ordered station-id path or [] if unreachable. */
export function dijkstra(
  graph: AdjacencyList,
  start: string,
  end: string
): string[] {
  const dist: Record<string, number>      = {};
  const prev: Record<string, string|null> = {};
  const unvisited = new Set<string>(Object.keys(graph));

  for (const node of unvisited) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest tentative distance
    let u: string | null = null;
    for (const node of unvisited) {
      if (u === null || dist[node] < dist[u]) u = node;
    }

    if (u === null || dist[u] === Infinity || u === end) break;

    unvisited.delete(u);

    for (const { to, w } of graph[u] ?? []) {
      if (!unvisited.has(to)) continue;
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let cur: string | null = end;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  return path[0] === start ? path : [];
}
