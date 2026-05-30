import { useState, useMemo } from "react";
import { Sidebar }               from "./components/Sidebar";
import { MetroGraph }             from "./components/MetroGraph";
import { useRouteCalculator }     from "./hooks/useRouteCalculator";
import { useMapTransform }        from "./hooks/useMapTransform";
import { useRouteAnimation }      from "./hooks/useRouteAnimation";
import { METRO_DATA, LINE_COLORS } from "./data/metroData";

const LINE_DOTS = [
  { color: LINE_COLORS.azul.color, label: "Azul"     },
  { color: LINE_COLORS.verde.color, label: "Verde"    },
  { color: LINE_COLORS.vermelho.color, label: "Vermelha" },
  { color: LINE_COLORS.amarelo.color, label: "Amarela"  },
  { color: LINE_COLORS.lilas.color, label: "Lilás"    },
];

export default function App() {
  const route           = useRouteCalculator();
  const map             = useMapTransform();
  const { animPct }     = useRouteAnimation(route.path);
  const [hovered, setHovered] = useState<string | null>(null);

  const stationNames = useMemo(
    () => METRO_DATA.nodes.map((n) => n.id).sort(),
    []
  );

  const handleNodeClick = (id: string) => {
    if (!route.origin || (route.origin && route.dest)) {
      route.setOrigin(id);
      route.setDest("");
    } else if (!route.dest && id !== route.origin) {
      route.setDest(id);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden select-none"
         style={{ background: "var(--color-surface-void)", fontFamily: "var(--font-body)" }}>

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header className="relative flex-shrink-0 flex items-center justify-between px-6 z-20"
              style={{
                height: 64,
                background: "linear-gradient(105deg, var(--color-metro-blue-dark) 0%, #002070 50%, #001848 100%)",
                borderBottom: "2px solid var(--color-metro-gold)",
                boxShadow: "0 1px 0 rgba(255,199,3,0.1), 0 8px 32px rgba(0,20,80,0.8)",
              }}>

        {/* Scanline effect on header */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]"
             style={{
               backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
             }} />

        {/* Logo + title */}
        <div className="flex items-center gap-4 relative z-10">
          {/* M badge */}
          <div className="relative flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-lg"
               style={{
                 width: 42, height: 42,
                 background: "linear-gradient(135deg, var(--color-metro-gold) 0%, #e6a800 100%)",
                 color: "var(--color-metro-blue-dark)",
                 boxShadow: "0 0 0 1px rgba(255,199,3,0.3), 0 4px 16px rgba(255,199,3,0.35)",
                 letterSpacing: "-0.02em",
               }}>
            M
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-display text-xl tracking-[0.12em] leading-none"
                  style={{ color: "var(--color-text-bright)", fontWeight: 500 }}>
              METRÔ <span style={{ color: "var(--color-metro-gold)", fontWeight: 700 }}>SP</span>
            </span>
            <span className="font-body text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: "#4a7ab5" }}>
              Simulador de Rotas
            </span>
          </div>
        </div>

        {/* Line dots + station count */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Vertical divider */}
          <div className="hidden sm:flex items-center gap-2">
            {LINE_DOTS.map(({ color, label }) => (
              <div key={color} className="group relative flex items-center justify-center"
                   title={label}>
                <div className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                     style={{ background: color, boxShadow: `0 0 8px ${color}99` }} />
              </div>
            ))}
          </div>

          <div className="w-px h-5 opacity-20" style={{ background: "var(--color-border-subtle)" }} />

          <div className="font-display text-[11px] tracking-[0.1em]"
               style={{ color: "var(--color-text-muted)" }}>
            <span style={{ color: "var(--color-text-base)" }}>{METRO_DATA.nodes.length}</span> estações
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
               style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full"
                 style={{ background: "var(--color-origin)", boxShadow: "0 0 6px var(--color-origin)", animation: "pulse-ring 2s ease-in-out infinite" }} />
            <span className="font-display text-[10px] tracking-widest"
                  style={{ color: "var(--color-origin)" }}>LIVE</span>
          </div>
        </div>
      </header>

      {/* ═══ BODY ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        <Sidebar
          stationNames={stationNames}
          origin={route.origin}
          dest={route.dest}
          path={route.path}
          info={route.info}
          calculating={route.calculating}
          onOriginChange={route.setOrigin}
          onDestChange={route.setDest}
          onCalcRoute={route.calcRoute}
          onRandomRoute={route.randomRoute}
          onSwap={route.swapStations}
        />

        {/* ─── MAP CANVAS ─────────────────────────────────────────────────── */}
        <main
          className="relative flex-1 overflow-hidden"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 45% 40%, #0b1a35 0%, var(--color-surface-void) 65%)",
            cursor: map.dragging ? "grabbing" : "grab",
          }}
          onWheel={map.onWheel}
          onMouseDown={map.onMouseDown}
          onMouseMove={map.onMouseMove}
          onMouseUp={map.onMouseUp}
          onMouseLeave={map.onMouseUp}
          onTouchStart={map.onTouchStart}
          onTouchMove={map.onTouchMove}
          onTouchEnd={map.onTouchEnd}
        >
          {/* Dot-grid background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.07 }}>
            <defs>
              <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="#4a7ab5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Vignette edges */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(6,8,15,0.7) 100%)",
               }} />

          {/* Metro graph SVG */}
          <MetroGraph
            transform={map.transform}
            path={route.path}
            animPct={animPct}
            origin={route.origin}
            dest={route.dest}
            hovered={hovered}
            onHover={setHovered}
            onClickNode={handleNodeClick}
          />

          {/* ── Zoom controls ── */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-1 z-20">
            {([
              { label: "+", action: map.zoomIn,  title: "Zoom in"  },
              { label: "⌖", action: map.reset,   title: "Resetar"  },
              { label: "−", action: map.zoomOut, title: "Zoom out" },
            ] as const).map(({ label, action, title }) => (
              <button
                key={label}
                onClick={action}
                title={title}
                className="font-display flex items-center justify-center rounded-sm transition-all hover:scale-110 active:scale-95"
                style={{
                  width: 36, height: 36, fontSize: 16,
                  background: "rgba(14,20,32,0.92)",
                  border: "1px solid var(--color-border-subtle)",
                  color: "var(--color-text-base)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Hint text ── */}
          <div className="absolute top-4 right-5 font-display text-[10px] tracking-[0.1em] z-10 select-none"
               style={{ color: "var(--color-text-muted)" }}>
            scroll · drag
          </div>

          {/* ── Empty state ── */}
          {route.path.length === 0 && !route.origin && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-slide-up
                            flex items-center gap-2 px-5 py-2.5 rounded-sm font-body text-[13px]"
                 style={{
                   background: "rgba(14,20,32,0.88)",
                   border: "1px solid var(--color-border-dim)",
                   color: "var(--color-text-muted)",
                   backdropFilter: "blur(16px)",
                   whiteSpace: "nowrap",
                   boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                 }}>
              <span style={{ color: "var(--color-metro-gold)", opacity: 0.7 }}>🚇</span>
              Selecione origem e destino no painel ou no mapa
            </div>
          )}

          {/* ── No route ── */}
          {route.path.length === 0 && route.origin && route.dest && !route.calculating && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 animate-fade-slide-up
                            flex items-center gap-2 px-4 py-2 rounded-sm font-body text-[12px]"
                 style={{
                   background: "rgba(30,10,10,0.92)",
                   border: "1px solid rgba(238,28,37,0.3)",
                   color: "#ff8080",
                   backdropFilter: "blur(12px)",
                 }}>
              ⚠ Nenhuma rota encontrada entre essas estações
            </div>
          )}
        </main>
      </div>
    </div>
  );
}