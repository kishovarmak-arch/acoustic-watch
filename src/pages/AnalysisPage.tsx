import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic, MicOff, Play, Square, Download, AlertTriangle,
  Activity, CheckCircle2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { WaveformCanvas } from "@/components/analysis/WaveformCanvas";
import { FrequencyBars } from "@/components/analysis/FrequencyBars";
import { HealthGauge } from "@/components/analysis/HealthGauge";
import { PredictionCard } from "@/components/analysis/PredictionCard";
import { HistoryChart } from "@/components/analysis/HistoryChart";
import { FaultBarChart } from "@/components/analysis/FaultBarChart";

const machineNames: Record<string, string> = {
  "steam-turbine": "Steam Turbine",
  "boiler-feed-pump": "Boiler Feed Pump",
  "cooling-tower-fan": "Cooling Tower Fan",
  "generator": "Generator",
  "condenser-pump": "Condenser Pump",
  "coal-pulverizer": "Coal Pulverizer",
  "induced-draft-fan": "Induced Draft Fan",
  "gearbox-assembly": "Gearbox Assembly",
};

type Status = "awaiting" | "listening" | "analyzing" | "complete";

interface PredictionResult {
  machine: string;
  health_status: "Healthy" | "Warning" | "Critical";
  confidence: number;
  detected_fault: string;
  recommendation: string;
  risk_level: string;
  timestamp: string;
}

const mockPredictions: PredictionResult[] = [
  { machine: "", health_status: "Warning", confidence: 87, detected_fault: "Bearing Wear", recommendation: "Schedule maintenance within 7 days", risk_level: "Medium", timestamp: "" },
  { machine: "", health_status: "Critical", confidence: 94, detected_fault: "Shaft Misalignment", recommendation: "Immediate shutdown recommended", risk_level: "High", timestamp: "" },
  { machine: "", health_status: "Healthy", confidence: 96, detected_fault: "None Detected", recommendation: "Continue normal operation", risk_level: "Low", timestamp: "" },
];

export default function AnalysisPage() {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get("machine") || "steam-turbine";
  const machineName = machineNames[machineId] || "Unknown Machine";

  const [status, setStatus] = useState<Status>("awaiting");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [decibelLevel, setDecibelLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { toast } = useToast();

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setStatus("listening");
      setPrediction(null);
      setAnalyzeProgress(0);

      // Auto-analyze after 12 seconds
      recordingTimerRef.current = setTimeout(() => {
        runAnalysis();
      }, 12000);
    } catch {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use acoustic monitoring.",
        variant: "destructive",
      });
    }
  };

  const runAnalysis = () => {
    stopListening();
    setStatus("analyzing");
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        const result = { ...mockPredictions[Math.floor(Math.random() * mockPredictions.length)] };
        result.machine = machineName;
        result.timestamp = new Date().toLocaleString();
        setPrediction(result);
        setStatus("complete");

        if (result.health_status === "Critical") {
          toast({
            title: "⚠️ Critical Health Alert",
            description: `${result.detected_fault} detected on ${machineName}. Immediate action required.`,
            variant: "destructive",
          });
        }
      }
      setAnalyzeProgress(Math.min(prog, 100));
    }, 300);
  };

  const handleStop = () => {
    stopListening();
    if (status === "listening") {
      runAnalysis();
    }
  };

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const statusConfig: Record<Status, { label: string; color: string; icon: React.ReactNode }> = {
    awaiting: { label: "Awaiting Analysis", color: "bg-muted text-muted-foreground", icon: <Clock className="w-3 h-3" /> },
    listening: { label: "Listening...", color: "bg-thermal/10 text-thermal", icon: <Mic className="w-3 h-3" /> },
    analyzing: { label: "Analyzing...", color: "bg-accent/10 text-accent", icon: <Activity className="w-3 h-3" /> },
    complete: { label: "Complete", color: "bg-success/10 text-success", icon: <CheckCircle2 className="w-3 h-3" /> },
  };

  const sc = statusConfig[status];

  return (
    <div className="container py-6 md:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{machineName}</h1>
          <p className="text-muted-foreground text-sm">Real-time acoustic analysis dashboard</p>
        </div>
        <Badge className={`${sc.color} gap-1.5 text-sm px-3 py-1`}>
          {sc.icon} {sc.label}
        </Badge>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-5 flex flex-wrap items-center gap-4">
          {status === "awaiting" || status === "complete" ? (
            <Button onClick={startListening} className="bg-thermal hover:bg-thermal/90 text-thermal-foreground gap-2">
              <Play className="w-4 h-4" /> Start Listening
            </Button>
          ) : status === "listening" ? (
            <Button onClick={handleStop} variant="destructive" className="gap-2">
              <Square className="w-4 h-4" /> Stop & Analyze
            </Button>
          ) : null}

          {status === "listening" && (
            <div className="flex items-center gap-3">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive" />
              </div>
              <span className="text-sm font-medium text-destructive">Recording</span>
            </div>
          )}

          {status === "analyzing" && (
            <div className="flex-1 min-w-[200px] space-y-1">
              <p className="text-sm text-muted-foreground">Analyzing acoustic frequency patterns…</p>
              <Progress value={analyzeProgress} className="h-2" />
            </div>
          )}

          {prediction && (
            <Button variant="outline" className="ml-auto gap-2" onClick={() => toast({ title: "Report exported (mock)" })}>
              <Download className="w-4 h-4" /> Export Report
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Audio Visualization */}
      {(status === "listening") && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waveform</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <WaveformCanvas analyser={analyserRef.current} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Frequency Spectrum</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <FrequencyBars analyser={analyserRef.current} onDecibelUpdate={setDecibelLevel} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Decibel Meter */}
      {status === "listening" && (
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground w-24">dB Level</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(decibelLevel, 100)}%`,
                  background: decibelLevel > 80 ? "hsl(var(--destructive))" : decibelLevel > 50 ? "hsl(var(--thermal))" : "hsl(var(--success))",
                }}
                animate={{ width: `${Math.min(decibelLevel, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-sm font-mono w-12 text-right">{Math.round(decibelLevel)} dB</span>
          </CardContent>
        </Card>
      )}

      {/* Results Dashboard */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <HealthGauge status={prediction.health_status} confidence={prediction.confidence} />
            <div className="md:col-span-2">
              <PredictionCard prediction={prediction} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <HistoryChart />
            <FaultBarChart />
          </div>
        </motion.div>
      )}

      {status === "awaiting" && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <MicOff className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-2">No Active Recording</p>
            <p className="text-sm">Click "Start Listening" to begin acoustic analysis of the {machineName}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
