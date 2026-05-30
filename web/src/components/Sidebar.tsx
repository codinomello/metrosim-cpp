import React from "react";
import { LINE_COLORS } from "../data/metroData";
import type { RouteInfo, LineKey } from "../types/metro";

interface SidebarProps {
  stationNames:   string[];
  origin:         string;
  dest:           string;
  path:           string[];
  info:           RouteInfo | null;
  calculating:    boolean;
  onOriginChange: (s: string) => void;
  onDestChange:   (s: string) => void;
  onCalcRoute:    () => void;
  onRandomRoute:  () => void;
  onSwap:         () => void;
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="font-display text-[9px] tracking-[0.22em] uppercase"
            style={{ color: "var(--color-text-muted)" }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--color-border-dim)" }} />
    </div>
  );
}

// ─── Station select ───────────────────────────────────────────────────────────
interface StationSelectProps {
  value:     string;
  onChange:  (v: string) => void;
  label:     string;
  badge:     string;
  accentColor: string;
  badgeBg:   string;
  placeholder: string;
  stations:  string[];
}

function StationSelect({ value, onChange, label, badge, accentColor, badgeBg, placeholder, stations }: StationSelectProps) {
  return (
    <div>
      <label className="flex items-center gap-2 mb-1.5">
        <span className="font-display text-[9px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded-sm"
              style={{ background: badgeBg, color: accentColor }}>
          {badge}
        </span>
        <span className="font-display text-[10px] tracking-[0.15em] font-medium"
              style={{ color: accentColor }}>
          {label}
        </span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm font-body text-[13px] outline-none pr-8 transition-all
                     focus:ring-1"
          style={{
            padding: "9px 32px 9px 12px",
            background: "var(--color-surface-card)",
            border: `1px solid ${value ? accentColor + "40" : "var(--color-border-dim)"}`,
            color: value ? "var(--color-text-bright)" : "var(--color-text-muted)",
            boxShadow: value ? `0 0 0 1px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.03)` : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
          <option value="">{placeholder}</option>
          {stations.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {value && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
               style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
        )}
      </div>
    </div>
  );
}

// ─── Main sidebar ──────────────────────────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({
  stationNames, origin, dest, path, info, calculating,
  onOriginChange, onDestChange, onCalcRoute, onRandomRoute, onSwap,
}) => {
  const canCalc = !!(origin && dest && origin !== dest && !calculating);

  const getStopColor = (i: number): string => {
    if (i === 0)              return "var(--color-origin)";
    if (i === path.length -1) return "var(--color-dest)";
    return "var(--color-text-muted)";
  };

  return (
    <aside
      className="sidebar-border-gradient flex flex-col flex-shrink-0 overflow-y-auto z-10"
      style={{
        width: 288,
        background: "linear-gradient(180deg, var(--color-surface-deep) 0%, var(--color-surface-void) 100%)",
        boxShadow: "8px 0 32px rgba(0,0,0,0.6)",
      }}>

      {/* ── ROUTE CONTROLS ── */}
      <div className="px-5 pt-5 pb-4"
           style={{ borderBottom: "1px solid var(--color-border-dim)" }}>
        <SectionLabel>Planejar Viagem</SectionLabel>

        <div className="flex flex-col gap-0">
          {/* Origin */}
          <StationSelect
            value={origin}
            onChange={onOriginChange}
            label="PARTIDA"
            badge="A"
            accentColor="var(--color-origin)"
            badgeBg="rgba(0,229,160,0.12)"
            placeholder="Selecione a origem…"
            stations={stationNames}
          />

          {/* Connector line + swap */}
          <div className="flex items-center gap-3 my-1.5 px-1">
            <div className="flex flex-col items-center gap-0.5 ml-2.5">
              <div className="w-px h-2" style={{ background: "var(--color-border-subtle)" }} />
              <div className="w-px h-2" style={{ background: "var(--color-border-dim)" }} />
            </div>
            <div className="flex-1 h-px opacity-0" />
            <button
              onClick={onSwap}
              className="flex items-center justify-center rounded-sm font-display text-base
                         transition-all hover:scale-110 active:scale-95"
              title="Inverter rota"
              style={{
                width: 28, height: 28,
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-base)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
              ⇅
            </button>
          </div>

          {/* Dest */}
          <StationSelect
            value={dest}
            onChange={onDestChange}
            label="DESTINO"
            badge="B"
            accentColor="var(--color-dest)"
            badgeBg="rgba(255,107,53,0.12)"
            placeholder="Selecione o destino…"
            stations={stationNames}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={onCalcRoute}
            disabled={!canCalc}
            className="relative w-full rounded-sm font-display text-[13px] tracking-[0.1em] uppercase
                       transition-all overflow-hidden"
            style={{
              padding: "11px 16px",
              background: canCalc
                ? "linear-gradient(105deg, var(--color-metro-blue) 0%, #0050c8 100%)"
                : "var(--color-surface-raised)",
              color: canCalc ? "#fff" : "var(--color-text-muted)",
              border: `1px solid ${canCalc ? "rgba(0,80,200,0.5)" : "var(--color-border-dim)"}`,
              cursor: canCalc ? "pointer" : "not-allowed",
              boxShadow: canCalc ? "0 4px 20px rgba(0,59,142,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}>
            {calculating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin-slow" width={12} height={12} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                </svg>
                Calculando…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>▶</span> Calcular Rota
              </span>
            )}
            {/* Shimmer effect when active */}
            {canCalc && (
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)",
                     backgroundSize: "200% 100%",
                     animation: "shimmer 2.5s linear infinite",
                   }} />
            )}
          </button>

          <button
            onClick={onRandomRoute}
            className="w-full rounded-sm font-display text-[11px] tracking-[0.12em] uppercase
                       transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border-dim)",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-subtle)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-base)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-dim)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
            }}>
            ⟳ Rota Aleatória
          </button>
        </div>
      </div>

      {/* ── ROUTE RESULT ── */}
      {info && path.length > 0 && (
        <div className="px-5 py-4 animate-fade-slide-up"
             style={{ borderBottom: "1px solid var(--color-border-dim)" }}>
          <SectionLabel>Resultado</SectionLabel>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { value: info.stops,     label: "Paradas",    color: "#60a5fa", icon: "●" },
              { value: info.transfers, label: "Baldeações", color: "var(--color-metro-gold)", icon: "⇌" },
            ].map(({ value, label, color, icon }) => (
              <div key={label} className="flex flex-col items-center justify-center rounded-sm py-3 gap-0.5 relative overflow-hidden"
                   style={{
                     background: "var(--color-surface-card)",
                     border: "1px solid var(--color-border-dim)",
                   }}>
                {/* background icon */}
                <div className="absolute top-1 right-2 font-display text-3xl opacity-[0.04]"
                     style={{ color }}>
                  {icon}
                </div>
                <span className="font-display text-2xl font-bold leading-none"
                      style={{ color, textShadow: `0 0 20px ${color}66` }}>
                  {value}
                </span>
                <span className="font-display text-[9px] tracking-[0.15em] uppercase"
                      style={{ color: "var(--color-text-muted)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Line badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {info.lines.map((l) => {
              const lc = LINE_COLORS[l];
              return (
                <span key={l} className="font-display text-[9px] tracking-[0.12em] uppercase px-2 py-1 rounded-sm"
                      style={{
                        background: lc?.color + "18",
                        border: `1px solid ${lc?.color}35`,
                        color: lc?.color,
                        textShadow: `0 0 12px ${lc?.color}55`,
                      }}>
                  {lc?.label?.replace("Linha ", "L")}
                </span>
              );
            })}
          </div>

          {/* Stop list */}
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {path.map((s, i) => {
              const isEndpoint = i === 0 || i === path.length - 1;
              return (
                <div key={s} className="flex items-start gap-2.5 group">
                  {/* Timeline */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-1" style={{ width: 14 }}>
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: isEndpoint ? 10 : 6,
                        height: isEndpoint ? 10 : 6,
                        background: getStopColor(i),
                        boxShadow: isEndpoint ? `0 0 8px ${getStopColor(i)}` : "none",
                        marginLeft: isEndpoint ? 0 : 2,
                      }}
                    />
                    {i < path.length - 1 && (
                      <div className="w-px flex-1 mt-0.5 mb-0.5" style={{ minHeight: 12, background: "var(--color-border-dim)" }} />
                    )}
                  </div>
                  {/* Name */}
                  <span className="font-body text-[12px] py-0.5 pb-1 leading-snug"
                        style={{
                          color: isEndpoint ? "var(--color-text-bright)" : "var(--color-text-base)",
                          fontWeight: isEndpoint ? 600 : 400,
                        }}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LINE LEGEND ── */}
      <div className="px-5 py-4 mt-auto">
        <SectionLabel>Linhas</SectionLabel>
        <div className="flex flex-col gap-2">
          {(Object.entries(LINE_COLORS) as [LineKey, typeof LINE_COLORS[LineKey]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3 group">
              {/* Line swatch */}
              <div className="relative flex-shrink-0" style={{ width: 24, height: 14 }}>
                <div className="absolute inset-y-1/2 -translate-y-1/2 rounded-full"
                     style={{
                       left: 0, right: 0, height: 3,
                       background: val.color,
                       boxShadow: `0 0 8px ${val.color}66`,
                     }} />
                {/* terminal dots */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                     style={{ background: val.color }} />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                     style={{ background: val.color }} />
              </div>
              <span className="font-body text-[11px] transition-colors"
                    style={{ color: "var(--color-text-base)" }}>
                {val.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div className="flex items-center justify-between px-5 py-3"
           style={{ borderTop: "1px solid var(--color-border-dim)", marginTop: "auto" }}>
        <span className="font-display text-[9px] tracking-[0.15em] uppercase"
              style={{ color: "var(--color-text-muted)" }}>
          Dijkstra v1.0
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full"
               style={{ background: "var(--color-origin)", opacity: 0.7 }} />
          <span className="font-display text-[9px] tracking-[0.12em]"
                style={{ color: "var(--color-text-muted)" }}>
            {METRO_DATA ? "Dados carregados" : "—"}
          </span>
        </div>
      </div>
    </aside>
  );
};

// Import to use in status bar
import { METRO_DATA } from "../data/metroData";