import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, CheckCircle2, XCircle, Clock, Wrench,
  BarChart3, MapPin, Compass, Tag
} from "lucide-react";
import type { ZonePrediction } from "@/pages/AnalysisPage";

const statusIcons = {
  Healthy: <CheckCircle2 className="w-5 h-5 text-success" />,
  Warning: <AlertTriangle className="w-5 h-5 text-thermal" />,
  Critical: <XCircle className="w-5 h-5 text-destructive" />,
};

export function ZonePredictionCard({ prediction }: { prediction: ZonePrediction }) {
  const healthStatus = prediction.healthScore >= 80 ? "Healthy" : prediction.healthScore >= 55 ? "Warning" : "Critical";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Zone-Based Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Localization result */}
        <div className="rounded-md bg-accent/5 border border-accent/20 p-3 space-y-1">
          <p className="text-xs font-semibold text-accent flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Acoustic Localization Result
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">System:</span>
            <span className="font-semibold">{prediction.system}</span>
            <span className="text-muted-foreground">Zone:</span>
            <span className="font-semibold">{prediction.zone}</span>
            <span className="text-muted-foreground">Component:</span>
            <span className="font-semibold">{prediction.component}</span>
            <span className="text-muted-foreground">Direction:</span>
            <span className="font-mono font-semibold">{prediction.directionAngle}°</span>
          </div>
        </div>

        {/* Fault details */}
        <div className="grid grid-cols-2 gap-3">
          <Detail icon={statusIcons[healthStatus]} label="Health" value={`${prediction.healthScore}% — ${healthStatus}`} />
          <Detail icon={<BarChart3 className="w-5 h-5 text-accent" />} label="Confidence" value={`${prediction.confidence}%`} />
          <Detail icon={<AlertTriangle className="w-5 h-5 text-thermal" />} label="Detected Fault" value={prediction.faultType} />
          <Detail icon={<Wrench className="w-5 h-5 text-muted-foreground" />} label="Risk Level" value={prediction.riskLevel} />
        </div>

        <div className="flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-accent" />
          <span className="text-[11px] font-mono text-accent">{prediction.aiLabel}</span>
        </div>

        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-sm font-medium">Recommendation</p>
          <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" /> {prediction.timestamp}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
