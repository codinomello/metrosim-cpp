import { useState, useEffect, useRef } from "react";

interface UseRouteAnimationReturn {
  animPct: number; // 0 → 1
}

/**
 * Drives the "route draw" animation whenever `path` changes.
 * animPct goes from 0 to 1 over `duration` ms.
 */
export function useRouteAnimation(
  path: string[],
  duration = 1200
): UseRouteAnimationReturn {
  const [animPct, setAnimPct] = useState<number>(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (path.length < 2) { setAnimPct(1); return; }

    setAnimPct(0);
    let startTs: number | null = null;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const pct = Math.min((ts - startTs) / duration, 1);
      setAnimPct(pct);
      if (pct < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [path, duration]);

  return { animPct };
}
