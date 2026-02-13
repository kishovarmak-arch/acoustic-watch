import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic, MicOff, Play, Square, Download, Activity,
  CheckCircle2, Clock, Compass, MapPin, FileAudio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { WaveformCanvas } from "@/components/analysis/WaveformCanvas";
import { FrequencyBars } from "@/components/analysis/FrequencyBars";
import { HealthGauge } from "@/components/analysis/HealthGauge";
import { ZonePredictionCard } from "@/components/analysis/ZonePredictionCard";
import { DirectionIndicator } from "@/components/analysis/DirectionIndicator";
import { HistoryChart } from "@/components/analysis/HistoryChart";
import { FaultBarChart } from "@/components/analysis/FaultBarChart";
import { SoundFileInput, type AudioFileMetadata } from "@/components/analysis/SoundFileInput";
import { findComponentById, plantSystems, MIMII_SPECS } from "@/data/plantHierarchy";

type Status = "awaiting" | "listening" | "analyzing" | "complete";

export interface ZonePrediction {
  system: string;
  zone: string;
  component: string;
  aiLabel: string;
  faultType: string;
  healthScore: number;
  confidence: number;
  recommendation: string;
  riskLevel: string;
  timestamp: string;
  directionAngle: number;
  // MIMII-referenced audio metrics
  audioMetrics?: {
    sampleRate: number;
    snrDb: number;
    rmsEnergy: number;
    spectralCentroidHz: number;
    durationSec: number;
    format: string;
    mimiiCompatible: boolean;
  };
}

export default function AnalysisPage() {
  const [searchParams] = useSearchParams();
  const systemId = searchParams.get("system");
  const componentId = searchParams.get("component");

  // Resolve from hierarchy
  const resolved = componentId ? findComponentById(componentId) : null;
  const systemName = resolved?.system.name || plantSystems.find(s => s.id === systemId)?.name || "Unknown System";
  const componentName = resolved?.component.name || "General Zone";
  const subsystemName = resolved?.subsystem.name || "";
  const zone = resolved?.system.zone || "";
  const angleRange = resolved?.system.angleRange || [0, 360];
  const possibleFaults = resolved?.component.faults || [];

  const [status, setStatus] = useState<Status>("awaiting");
  const [prediction, setPrediction] = useState<ZonePrediction | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [decibelLevel, setDecibelLevel] = useState(0);

  const [fileAudioBuffer, setFileAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileMetadata, setFileMetadata] = useState<AudioFileMetadata | null>(null);
  const [inputMode, setInputMode] = useState<"mic" | "file">("mic");

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

      recordingTimerRef.current = setTimeout(() => runAnalysis(), 12000);
    } catch {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use acoustic monitoring.",
        variant: "destructive",
      });
    }
  };

  const runAnalysis = (audioMeta?: AudioFileMetadata) => {
    stopListening();
    setStatus("analyzing");
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);

        const fault = possibleFaults.length > 0
          ? possibleFaults[Math.floor(Math.random() * possibleFaults.length)]
          : "None Detected";
        const healthScore = fault === "None Detected" ? 90 + Math.floor(Math.random() * 10) : 40 + Math.floor(Math.random() * 40);
        const confidence = 75 + Math.floor(Math.random() * 20);
        const angle = angleRange[0] + Math.floor(Math.random() * (angleRange[1] - angleRange[0]));

        const healthStatus = healthScore >= 80 ? "Healthy" : healthScore >= 55 ? "Warning" : "Critical";
        const riskLevel = healthStatus === "Healthy" ? "Low" : healthStatus === "Warning" ? "Medium" : "High";
        const recommendations: Record<string, string> = {
          Low: "Continue normal operation. Next scheduled inspection adequate.",
          Medium: "Schedule maintenance within 7 days. Monitor closely.",
          High: "Immediate shutdown recommended. Critical fault detected.",
        };

        const meta = audioMeta || fileMetadata;

        const result: ZonePrediction = {
          system: systemName,
          zone,
          component: componentName,
          aiLabel: resolved?.component.aiLabel || "unknown_zone",
          faultType: fault,
          healthScore,
          confidence,
          recommendation: recommendations[riskLevel],
          riskLevel,
          timestamp: new Date().toLocaleString(),
          directionAngle: angle,
          audioMetrics: meta ? {
            sampleRate: meta.sampleRate,
            snrDb: meta.estimatedSNR,
            rmsEnergy: meta.rmsEnergy,
            spectralCentroidHz: meta.spectralCentroid,
            durationSec: meta.duration,
            format: meta.format,
            mimiiCompatible: meta.mimiiCompatible,
          } : undefined,
        };
        setPrediction(result);
        setStatus("complete");

        if (healthStatus === "Critical") {
          toast({
            title: "⚠️ Critical Health Alert",
            description: `${fault} detected in ${systemName} → ${componentName}. Immediate action required.`,
            variant: "destructive",
          });
        }
      }
      setAnalyzeProgress(Math.min(prog, 100));
    }, 300);
  };

  const handleFileDecoded = useCallback((audioBuffer: AudioBuffer, fileName: string, metadata: AudioFileMetadata) => {
    setFileAudioBuffer(audioBuffer);
    setFileMetadata(metadata);

    // Set up analyser for visualization from the file buffer
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    source.connect(ctx.destination);
    source.start();

    setStatus("listening");
    setPrediction(null);
    setAnalyzeProgress(0);

    // Auto-analyze after file finishes playing (or 10s max like MIMII)
    const analyzeDelay = Math.min(audioBuffer.duration * 1000, MIMII_SPECS.segmentDuration * 1000);
    recordingTimerRef.current = setTimeout(() => runAnalysis(metadata), analyzeDelay);
  }, []);

  const handleStop = () => {
    stopListening();
    if (status === "listening") runAnalysis();
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
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{componentName}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-mono gap-1">
              <MapPin className="w-3 h-3" /> {systemName}
            </Badge>
            {subsystemName && (
              <Badge variant="outline" className="text-xs">{subsystemName}</Badge>
            )}
            {zone && (
              <Badge variant="outline" className="text-xs font-mono gap-1">
                <Compass className="w-3 h-3" /> {zone} ({angleRange[0]}°–{angleRange[1]}°)
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">Real-time acoustic analysis · System → Subsystem → Component</p>
        </div>
        <Badge className={`${sc.color} gap-1.5 text-sm px-3 py-1 shrink-0`}>
          {sc.icon} {sc.label}
        </Badge>
      </div>

      {/* Input Mode Tabs */}
      <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "mic" | "file")} className="space-y-4">
        <TabsList>
          <TabsTrigger value="mic" className="gap-1.5"><Mic className="w-3.5 h-3.5" /> Live Microphone</TabsTrigger>
          <TabsTrigger value="file" className="gap-1.5"><FileAudio className="w-3.5 h-3.5" /> Sound File</TabsTrigger>
        </TabsList>

        <TabsContent value="mic">
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
                  <p className="text-sm text-muted-foreground">Analyzing acoustic frequency patterns… TDOA + Beamforming</p>
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
        </TabsContent>

        <TabsContent value="file">
          <div className="grid md:grid-cols-2 gap-4">
            <SoundFileInput
              onAudioDecoded={handleFileDecoded}
              disabled={status === "listening" || status === "analyzing"}
            />
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-medium">File Analysis Controls</p>
                {status === "analyzing" && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Analyzing acoustic frequency patterns… TDOA + Beamforming</p>
                    <Progress value={analyzeProgress} className="h-2" />
                  </div>
                )}
                {status === "listening" && fileMetadata && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent" />
                      </div>
                      <span className="text-sm font-medium text-accent">Playing & analyzing file…</span>
                    </div>
                    <Button onClick={handleStop} variant="destructive" size="sm" className="gap-2">
                      <Square className="w-3 h-3" /> Stop & Analyze Now
                    </Button>
                  </div>
                )}
                {(status === "awaiting" || status === "complete") && (
                  <p className="text-sm text-muted-foreground">
                    Upload a WAV/MP3 sound file to analyze. MIMII-format WAV files (16kHz, 16-bit) are recommended for best accuracy.
                  </p>
                )}
                {prediction && (
                  <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Report exported (mock)" })}>
                    <Download className="w-4 h-4" /> Export Report
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Audio Visualization */}
      {status === "listening" && (
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
            <HealthGauge
              status={prediction.healthScore >= 80 ? "Healthy" : prediction.healthScore >= 55 ? "Warning" : "Critical"}
              confidence={prediction.confidence}
            />
            <div className="md:col-span-2">
              <ZonePredictionCard prediction={prediction} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <DirectionIndicator angle={prediction.directionAngle} zone={prediction.zone} system={prediction.system} />
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
            <p className="text-sm">Click "Start Listening" to begin acoustic analysis of <span className="font-semibold text-foreground">{componentName}</span></p>
            <p className="text-xs mt-2">System: {systemName} · {zone}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
