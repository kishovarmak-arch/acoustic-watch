import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DirectionIndicatorProps {
  angle: number;
  zone: string;
  system: string;
}

export function DirectionIndicator({ angle, zone, system }: DirectionIndicatorProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">DOA — Sound Direction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4">
        <div className="relative w-36 h-36">
          {/* Compass ring */}
          <svg viewBox="0 0 140 140" className="w-full h-full">
            <circle cx="70" cy="70" r="62" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
            {/* Tick marks every 30° */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = i * 30;
              const rad = (a - 90) * (Math.PI / 180);
              const x1 = 70 + 55 * Math.cos(rad);
              const y1 = 70 + 55 * Math.sin(rad);
              const x2 = 70 + 62 * Math.cos(rad);
              const y2 = 70 + 62 * Math.sin(rad);
              return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />;
            })}
            {/* Direction labels */}
            {[
              { label: "N", angle: 0 },
              { label: "E", angle: 90 },
              { label: "S", angle: 180 },
              { label: "W", angle: 270 },
            ].map((d) => {
              const rad = (d.angle - 90) * (Math.PI / 180);
              const x = 70 + 48 * Math.cos(rad);
              const y = 70 + 48 * Math.sin(rad);
              return (
                <text key={d.label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fill="hsl(var(--muted-foreground))" fontSize="10" fontWeight="600">
                  {d.label}
                </text>
              );
            })}
          </svg>

          {/* Animated arrow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="relative h-full w-full">
              <div
                className="absolute left-1/2 top-[12px] -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: "16px solid hsl(var(--thermal))",
                }}
              />
              <div className="absolute left-1/2 top-[28px] -translate-x-1/2 w-[2px] bg-thermal" style={{ height: "40px" }} />
            </div>
          </motion.div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-thermal border-2 border-card" />
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-lg font-bold font-mono">{angle}°</p>
          <p className="text-xs text-muted-foreground">{zone} · {system}</p>
        </div>
      </CardContent>
    </Card>
  );
}
