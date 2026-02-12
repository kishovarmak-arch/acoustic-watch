import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthGaugeProps {
  status: "Healthy" | "Warning" | "Critical";
  confidence: number;
}

const config = {
  Healthy: { color: "hsl(var(--success))", bg: "bg-success/10", text: "text-success", label: "Healthy" },
  Warning: { color: "hsl(var(--thermal))", bg: "bg-thermal/10", text: "text-thermal", label: "Warning" },
  Critical: { color: "hsl(var(--destructive))", bg: "bg-destructive/10", text: "text-destructive", label: "Critical" },
};

export function HealthGauge({ status, confidence }: HealthGaugeProps) {
  const c = config[status];
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Machine Health</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <motion.circle
              cx="80" cy="80" r="70" fill="none"
              stroke={c.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${c.text}`}>{confidence}%</span>
            <span className="text-xs text-muted-foreground">Confidence</span>
          </div>
        </div>
        <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}>
          {status === "Healthy" ? "🟢" : status === "Warning" ? "🟡" : "🔴"} {c.label}
        </div>
      </CardContent>
    </Card>
  );
}
