import React, { useMemo } from "react";
import { METRO_DATA, LINE_COLORS } from "../data/metroData";
import type { Transform, Station, LineKey } from "../types/metro";

interface MetroGraphProps {
  transform:   Transform;
  path:        string[];
  animPct:     number;
  origin:      string;
  dest:        string;
  hovered:     string | null;
  onHover:     (id: string | null) => void;
  onClickNode: (id: string) => void;
}

interface PathEdge { a: Station; b: Station; idx: number; }

export const MetroGraph: React.FC<MetroGraphProps> = ({
  transform, path, animPct, origin, dest, hovered, onHover, onClickNode,
}) => {
  const nodeMap = useMemo(
    () => Object.fromEntries(METRO_DATA.nodes.map((n) => [n.id, n])),
    []
  );

  const pathSet = useMemo(() => new Set(path), [path]);

  const pathEdges = useMemo<PathEdge[]>(() => {
    const out: PathEdge[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const a = nodeMap[path[i]];
      const b = nodeMap[path[i + 1]];
      if (a && b) out.push({ a, b, idx: i });
    }
    return out;
  }, [path, nodeMap]);

  const totalPathLen = useMemo(
    () => pathEdges.reduce((s, { a, b }) => s + Math.hypot(a.x - b.x, a.y - b.y), 0),
    [pathEdges]
  );

  const { x, y, scale } = transform;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", position: "absolute", inset: 0 }}>
      <defs>
        {/* Route glow */}
        <filter id="glow-route" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Station glow */}
        <filter id="glow-node" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Soft node glow */}
        <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Line glow */}
        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g transform={`translate(${x},${y}) scale(${scale})`}>

        {/* ── Base edges – glow layer ── */}
        {METRO_DATA.edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const inPath = path.length > 1 && path.some((s, idx) =>
            idx > 0 &&
            ((path[idx - 1] === e.from && s === e.to) ||
             (path[idx - 1] === e.to   && s === e.from))
          );
          if (inPath) return null; // route will draw over
          const lc = LINE_COLORS[e.line as LineKey];
          return (
            <line key={`glow-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={lc?.color} strokeWidth={5} strokeLinecap="round"
              opacity={0.12} filter="url(#glow-line)"
            />
          );
        })}

        {/* ── Base edges – solid ── */}
        {METRO_DATA.edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const inPath = path.length > 1 && path.some((s, idx) =>
            idx > 0 &&
            ((path[idx - 1] === e.from && s === e.to) ||
             (path[idx - 1] === e.to   && s === e.from))
          );
          const lc = LINE_COLORS[e.line as LineKey];
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={lc?.color}
              strokeWidth={inPath ? 1.5 : 3.5}
              opacity={inPath ? 0.15 : 0.75}
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Animated route ── */}
        {pathEdges.map(({ a, b, idx }) => {
          const segLen    = Math.hypot(a.x - b.x, a.y - b.y);
          const lenBefore = pathEdges.slice(0, idx).reduce((s, { a: pa, b: pb }) => s + Math.hypot(pa.x - pb.x, pa.y - pb.y), 0);
          const segStart  = lenBefore / totalPathLen;
          const segEnd    = (lenBefore + segLen) / totalPathLen;
          const local     = Math.max(0, Math.min(1, (animPct - segStart) / (segEnd - segStart)));

          if (local <= 0) return null;

          const cx = a.x + (b.x - a.x) * local;
          const cy = a.y + (b.y - a.y) * local;

          return (
            <g key={`route-${idx}`}>
              {/* Outer glow */}
              <line x1={a.x} y1={a.y} x2={cx} y2={cy}
                stroke="var(--color-route)" strokeWidth={14} strokeLinecap="round"
                opacity={0.08} filter="url(#glow-route)" />

              {/* Mid glow */}
              <line x1={a.x} y1={a.y} x2={cx} y2={cy}
                stroke="var(--color-route)" strokeWidth={7} strokeLinecap="round"
                opacity={0.25} />

              {/* Main route line */}
              <line x1={a.x} y1={a.y} x2={cx} y2={cy}
                stroke="var(--color-route)" strokeWidth={3.5} strokeLinecap="round"
                opacity={0.95} />

              {/* White dashed core */}
              <line x1={a.x} y1={a.y} x2={cx} y2={cy}
                stroke="rgba(255,255,255,0.5)" strokeWidth={1}
                strokeLinecap="round" strokeDasharray="7 5"
                style={{ animation: "routeMarch 0.45s linear infinite" }}
              />
            </g>
          );
        })}

        {/* ── Station nodes ── */}
        {METRO_DATA.nodes.map((node) => {
          const isOrigin   = node.id === origin;
          const isDest     = node.id === dest;
          const inPath     = pathSet.has(node.id);
          const isHovered  = hovered === node.id;
          const isTransfer = node.lines.length > 1;
          const isSpecial  = isOrigin || isDest;
          const highlighted = isSpecial || isHovered;

          const lc = LINE_COLORS[node.lines[0] as LineKey];
          const baseColor = lc?.color ?? "#6b7280";
          const dotColor  = isOrigin ? "var(--color-origin)"
                          : isDest   ? "var(--color-dest)"
                          : inPath   ? "var(--color-route)"
                          : baseColor;

          const r = isSpecial ? 8 : isTransfer ? 6.5 : 4.5;

          return (
            <g
              key={node.id}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClickNode(node.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse ring for origin/dest */}
              {isSpecial && (
                <>
                  <circle cx={node.x} cy={node.y} r={r + 10}
                    fill="none" stroke={dotColor} strokeWidth={1}
                    opacity={0.08}
                  />
                  <circle cx={node.x} cy={node.y} r={r + 5}
                    fill="none" stroke={dotColor} strokeWidth={1}
                    opacity={0.15}
                  />
                </>
              )}

              {/* Hover aura */}
              {isHovered && !isSpecial && (
                <circle cx={node.x} cy={node.y} r={r + 8}
                  fill={dotColor} fillOpacity={0.06}
                  stroke={dotColor} strokeOpacity={0.15} strokeWidth={1}
                />
              )}

              {/* Transfer ring */}
              {isTransfer && (
                <circle cx={node.x} cy={node.y} r={r + 3.5}
                  fill="var(--color-surface-deep)"
                  stroke={dotColor} strokeWidth={1.5}
                  opacity={isSpecial ? 0.5 : 0.35}
                />
              )}

              {/* Main dot */}
              <circle
                cx={node.x} cy={node.y} r={isHovered && !isSpecial ? r + 1.5 : r}
                fill={dotColor}
                stroke="var(--color-surface-void)"
                strokeWidth={isTransfer ? 1.5 : 1}
                filter={highlighted || inPath ? "url(#glow-soft)" : undefined}
                opacity={highlighted || inPath ? 1 : 0.85}
                style={{ transition: "r 0.15s ease" }}
              />

              {/* A/B label inside dot */}
              {isSpecial && (
                <text x={node.x} y={node.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={6} fill="var(--color-surface-void)"
                  fontFamily="var(--font-display)" fontWeight={700}>
                  {isOrigin ? "A" : "B"}
                </text>
              )}

              {/* Station label */}
              {(isHovered || isSpecial || (inPath && path.length < 12) || isTransfer) && (
                <g>
                  {/* Label background */}
                  <rect
                    x={node.x + r + 5}
                    y={node.y - 9}
                    width={node.id.length * 5.8 + 12}
                    height={17}
                    rx={2}
                    fill="rgba(6,8,15,0.9)"
                    stroke={dotColor}
                    strokeWidth={highlighted ? 0.8 : 0.4}
                    strokeOpacity={highlighted ? 0.7 : 0.3}
                  />
                  {/* Label text */}
                  <text
                    x={node.x + r + 11}
                    y={node.y + 1}
                    dominantBaseline="middle"
                    fontSize={9}
                    fill={highlighted ? "var(--color-text-bright)" : "var(--color-text-base)"}
                    fontFamily="var(--font-body)"
                    fontWeight={isSpecial ? 600 : 400}
                    letterSpacing="0.02"
                  >
                    {node.id}
                  </text>
                </g>
              )}
            </g>
          );
        })}

      </g>
    </svg>
  );
};