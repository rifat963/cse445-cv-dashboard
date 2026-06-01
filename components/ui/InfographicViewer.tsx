"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Maximize2,
  RotateCcw,
} from "lucide-react";

interface InfographicImage {
  src: string;
  alt: string;
}

interface Props {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  images?: InfographicImage[];
  initialIndex?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function InfographicViewer({
  src,
  alt,
  fallback,
  images,
  initialIndex = 0,
}: Props) {
  const gallery = images?.length ? images : [{ src, alt }];
  const [currentIndex, setCurrentIndex] = useState(() =>
    clamp(initialIndex, 0, gallery.length - 1)
  );
  const [imageOk, setImageOk] = useState(true);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const dragOrigin = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const zoomBy = (delta: number) =>
    setScale((currentScale) => clamp(currentScale + delta, 0.25, 10));

  const hasGalleryNavigation = gallery.length > 1;
  const currentImage = gallery[currentIndex] ?? gallery[0];

  const openLightbox = () => {
    setCurrentIndex(clamp(initialIndex, 0, gallery.length - 1));
    reset();
    setOpen(true);
  };

  const goToImage = useCallback(
    (direction: -1 | 1) => {
      setCurrentIndex(
        (index) => (index + direction + gallery.length) % gallery.length
      );
      setDragging(false);
      reset();
    },
    [gallery.length, reset]
  );

  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        reset();
      } else if (event.key === "ArrowLeft" && hasGalleryNavigation) {
        event.preventDefault();
        goToImage(-1);
      } else if (event.key === "ArrowRight" && hasGalleryNavigation) {
        event.preventDefault();
        goToImage(1);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goToImage, hasGalleryNavigation, open, reset]);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    setScale((currentScale) =>
      clamp(currentScale * (event.deltaY < 0 ? 1.1 : 0.9), 0.25, 10)
    );
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element || !open) return;

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [open, handleWheel]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element || !open) return;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        lastTouchPos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
        lastTouchDist.current = null;
      } else if (event.touches.length === 2) {
        lastTouchDist.current = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        );
        lastTouchPos.current = null;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length === 1 && lastTouchPos.current) {
        const dx = event.touches[0].clientX - lastTouchPos.current.x;
        const dy = event.touches[0].clientY - lastTouchPos.current.y;
        setPos((currentPos) => ({
          x: currentPos.x + dx,
          y: currentPos.y + dy,
        }));
        lastTouchPos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      } else if (event.touches.length === 2 && lastTouchDist.current != null) {
        const distance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        );
        setScale((currentScale) =>
          clamp(currentScale * (distance / lastTouchDist.current!), 0.25, 10)
        );
        lastTouchDist.current = distance;
      }
    };

    element.addEventListener("touchstart", onTouchStart, { passive: false });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  if (!imageOk) return <>{fallback ?? null}</>;

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        className="relative group w-full cursor-zoom-in rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-co1"
      >
        <img
          src={src}
          alt={alt}
          className="w-full object-contain"
          onError={() => setImageOk(false)}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="flex items-center gap-2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            <Maximize2 size={16} />
            Click to enlarge
          </span>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col select-none">
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0 border-b border-white/10">
            <div className="min-w-0">
              <p className="text-white/60 text-sm truncate max-w-[55vw]">
                {currentImage.alt}
              </p>
              {hasGalleryNavigation && (
                <p className="text-white/35 text-xs tabular-nums">
                  {currentIndex + 1} / {gallery.length}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-xs tabular-nums mr-1">
                {Math.round(scale * 100)}%
              </span>
              {hasGalleryNavigation && (
                <>
                  <ToolBtn
                    onClick={() => goToImage(-1)}
                    label="Previous infographic"
                  >
                    <ChevronLeft size={15} />
                  </ToolBtn>
                  <ToolBtn
                    onClick={() => goToImage(1)}
                    label="Next infographic"
                  >
                    <ChevronRight size={15} />
                  </ToolBtn>
                </>
              )}
              <ToolBtn onClick={() => zoomBy(0.25)} label="Zoom in">
                <ZoomIn size={15} />
              </ToolBtn>
              <ToolBtn onClick={() => zoomBy(-0.25)} label="Zoom out">
                <ZoomOut size={15} />
              </ToolBtn>
              <ToolBtn onClick={reset} label="Reset zoom">
                <RotateCcw size={15} />
              </ToolBtn>
              <ToolBtn
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                label="Close"
              >
                <X size={15} />
              </ToolBtn>
            </div>
          </div>

          <div
            ref={viewportRef}
            className="relative flex-1 overflow-hidden flex items-center justify-center"
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            onMouseDown={(event) => {
              setDragging(true);
              dragOrigin.current = {
                x: event.clientX - pos.x,
                y: event.clientY - pos.y,
              };
            }}
            onMouseMove={(event) => {
              if (!dragging) return;
              setPos({
                x: event.clientX - dragOrigin.current.x,
                y: event.clientY - dragOrigin.current.y,
              });
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
          >
            {hasGalleryNavigation && (
              <>
                <GalleryNavButton
                  direction="previous"
                  onClick={() => goToImage(-1)}
                />
                <GalleryNavButton
                  direction="next"
                  onClick={() => goToImage(1)}
                />
              </>
            )}
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              draggable={false}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transition: dragging ? "none" : "transform 0.12s ease",
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </div>

          <p className="text-center text-white/25 text-xs py-2 shrink-0">
            Scroll to zoom - Drag to pan - Esc to close
          </p>
        </div>
      )}
    </>
  );
}

function GalleryNavButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      aria-label={isPrevious ? "Previous infographic" : "Next infographic"}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 ${
        isPrevious ? "left-4" : "right-4"
      }`}
    >
      {isPrevious ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  );
}

function ToolBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
    >
      {children}
    </button>
  );
}
