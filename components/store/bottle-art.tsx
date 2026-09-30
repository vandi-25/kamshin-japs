import { useId } from "react";

import type { BottleShape } from "@/lib/demo/catalog";
import { cn } from "@/lib/utils";

type Props = {
  tone: string;
  shape: BottleShape;
  name?: string;
  className?: string;
};

/**
 * Placeholder product art (no photography yet): an SVG perfume bottle in the
 * product's colour. Replaced by real product images from Vercel Blob in Phase 7.
 */
export function BottleArt({ tone, shape, name, className }: Props) {
  const id = useId().replace(/:/g, "");
  const glass = `glass-${id}`;
  const liquid = `liquid-${id}`;
  const gold = `gold-${id}`;

  const body =
    shape === "tall"
      ? { x: 70, y: 78, w: 60, h: 150, r: 10 }
      : shape === "round"
        ? { x: 45, y: 92, w: 110, h: 130, r: 55 }
        : { x: 52, y: 90, w: 96, h: 136, r: 14 };
  const cap =
    shape === "tall"
      ? { x: 80, y: 22, w: 40, h: 46, r: 4 }
      : shape === "round"
        ? { x: 76, y: 38, w: 48, h: 40, r: 20 }
        : { x: 74, y: 36, w: 52, h: 42, r: 3 };
  const neckY = cap.y + cap.h;
  const liquidTop = body.y + body.h * 0.22;

  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label={name ? `${name} bottle` : "Perfume bottle"}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={glass} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={liquid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.75" />
          <stop offset="1" stopColor={tone} />
        </linearGradient>
        <linearGradient id={gold} x1="0" x2="1">
          <stop offset="0" stopColor="#b8942a" />
          <stop offset="0.45" stopColor="#f0d77a" />
          <stop offset="1" stopColor="#a8841f" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} />
        </clipPath>
      </defs>

      {/* floor shadow */}
      <ellipse cx="100" cy={body.y + body.h + 8} rx={body.w * 0.55} ry="6" fill="#4b0f1a" opacity="0.12" />

      {/* cap + collar */}
      <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx={cap.r} fill={`url(#${gold})`} />
      <rect x={86} y={neckY} width={28} height={body.y - neckY + 2} fill={`url(#${gold})`} />

      {/* glass body with liquid */}
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} fill="#ffffff" opacity="0.5" />
      <g clipPath={`url(#clip-${id})`}>
        <rect x={body.x} y={liquidTop} width={body.w} height={body.h} fill={`url(#${liquid})`} />
        <rect x={body.x + body.w * 0.12} y={body.y} width={body.w * 0.1} height={body.h} fill="#ffffff" opacity="0.25" />
      </g>
      <rect
        x={body.x}
        y={body.y}
        width={body.w}
        height={body.h}
        rx={body.r}
        fill={`url(#${glass})`}
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />

      {/* label */}
      <rect
        x={100 - Math.min(body.w * 0.34, 34)}
        y={body.y + body.h * 0.5}
        width={Math.min(body.w * 0.68, 68)}
        height="26"
        fill="#fbf8f4"
        opacity="0.92"
      />
      <text
        x="100"
        y={body.y + body.h * 0.5 + 17}
        textAnchor="middle"
        fontFamily="var(--font-cormorant), serif"
        fontSize="10"
        letterSpacing="2.5"
        fill="#4b0f1a"
      >
        KAMSHIN
      </text>
    </svg>
  );
}
