import { useState, useRef, useCallback } from "react";
import type { Transform } from "../types/metro";

interface UseMapTransformReturn {
  transform: Transform;
  dragging: boolean;
  onWheel:      (e: React.WheelEvent) => void;
  onMouseDown:  (e: React.MouseEvent) => void;
  onMouseMove:  (e: React.MouseEvent) => void;
  onMouseUp:    ()                    => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove:  (e: React.TouchEvent) => void;
  onTouchEnd:   ()                    => void;
  zoomIn:  () => void;
  zoomOut: () => void;
  reset:   () => void;
}

const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0, scale: 0.72 };
const MIN_SCALE = 0.3;
const MAX_SCALE = 2.8;

export function useMapTransform(): UseMapTransformReturn {
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const [dragging,  setDragging]  = useState<boolean>(false);

  const dragStart  = useRef<{ x: number; y: number } | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    setTransform((t) => ({ ...t, scale: clampScale(t.scale * factor) }));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    };
  }, [transform]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setTransform((t) => ({
      ...t,
      x: e.clientX - dragStart.current!.x,
      y: e.clientY - dragStart.current!.y,
    }));
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStart.current = {
      x: e.touches[0].clientX - transform.x,
      y: e.touches[0].clientY - transform.y,
    };
  }, [transform]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !touchStart.current) return;
    setTransform((t) => ({
      ...t,
      x: e.touches[0].clientX - touchStart.current!.x,
      y: e.touches[0].clientY - touchStart.current!.y,
    }));
  }, []);

  const onTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);

  const zoomIn  = () => setTransform((t) => ({ ...t, scale: clampScale(t.scale * 1.2) }));
  const zoomOut = () => setTransform((t) => ({ ...t, scale: clampScale(t.scale * 0.85) }));
  const reset   = () => setTransform(DEFAULT_TRANSFORM);

  return {
    transform, dragging,
    onWheel, onMouseDown, onMouseMove, onMouseUp,
    onTouchStart, onTouchMove, onTouchEnd,
    zoomIn, zoomOut, reset,
  };
}
