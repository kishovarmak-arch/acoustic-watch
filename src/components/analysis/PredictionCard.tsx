import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, XCircle, Clock, Wrench, BarChart3 } from "lucide-react";

interface PredictionCardProps {
  prediction: {
    machine: string;
    health_status: "Healthy" | "Warning" | "Critical";
    confidence: number;
    detected_fault: string;
    recommendation: string;
    risk_level: string;
    timestamp: string;
  };
}

const statusIcons = {
  Healthy: <CheckCircle2 className="w-5 h-5 text-success" />,
  Warning: <AlertTriangle className="w-5 h-5 text-thermal" />,
  Critical: <XCircle className="w-5 h-5 text-destructive" />,
};

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Prediction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Detail icon={statusIcons[prediction.health_status]} label="Status" value={prediction.health_status} />
          <Detail icon={<BarChart3 className="w-5 h-5 text-accent" />} label="Confidence" value={`${prediction.confidence}%`} />
          <Detail icon={<AlertTriangle className="w-5 h-5 text-thermal" />} label="Detected Fault" value={prediction.detected_fault} />
          <Detail icon={<Wrench className="w-5 h-5 text-muted-foreground" />} label="Risk Level" value={prediction.risk_level} />
        </div>
        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-sm font-medium">Recommendation</p>
          <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {prediction.timestamp}
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
