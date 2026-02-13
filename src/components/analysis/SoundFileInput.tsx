import { useRef, useState, useCallback } from "react";
import { Upload, FileAudio, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MIMII_SPECS } from "@/data/plantHierarchy";

interface SoundFileInputProps {
  onAudioDecoded: (audioBuffer: AudioBuffer, fileName: string, fileMetadata: AudioFileMetadata) => void;
  disabled?: boolean;
}

export interface AudioFileMetadata {
  fileName: string;
  fileSize: number;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  estimatedSNR: number;
  rmsEnergy: number;
  spectralCentroid: number;
  mimiiCompatible: boolean;
}

function estimateRMS(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  return Math.sqrt(sum / data.length);
}

function estimateSpectralCentroid(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  const fftSize = MIMII_SPECS.fftSize;
  // Simple DFT-based centroid estimation on first frame
  const frame = data.slice(0, fftSize);
  let weightedSum = 0;
  let magnitudeSum = 0;
  for (let k = 0; k < fftSize / 2; k++) {
    let real = 0, imag = 0;
    for (let n = 0; n < fftSize; n++) {
      const angle = (2 * Math.PI * k * n) / fftSize;
      real += (frame[n] || 0) * Math.cos(angle);
      imag -= (frame[n] || 0) * Math.sin(angle);
    }
    const magnitude = Math.sqrt(real * real + imag * imag);
    const freq = (k * buffer.sampleRate) / fftSize;
    weightedSum += freq * magnitude;
    magnitudeSum += magnitude;
  }
  return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
}

function estimateSNR(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  const frameSize = 1024;
  const frameEnergies: number[] = [];
  for (let i = 0; i < data.length - frameSize; i += frameSize) {
    let energy = 0;
    for (let j = 0; j < frameSize; j++) {
      energy += data[i + j] * data[i + j];
    }
    frameEnergies.push(energy / frameSize);
  }
  if (frameEnergies.length < 2) return 0;
  frameEnergies.sort((a, b) => a - b);
  const noiseFloor = frameEnergies[Math.floor(frameEnergies.length * 0.1)] || 0.0001;
  const signalPeak = frameEnergies[Math.floor(frameEnergies.length * 0.9)] || 0.001;
  return 10 * Math.log10(signalPeak / noiseFloor);
}

function getFormatFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const formats: Record<string, string> = {
    wav: "WAV (PCM)",
    mp3: "MP3 (Compressed)",
    ogg: "OGG Vorbis",
    flac: "FLAC (Lossless)",
    m4a: "M4A (AAC)",
  };
  return formats[ext] || ext.toUpperCase();
}

export function SoundFileInput({ onAudioDecoded, disabled }: SoundFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<AudioFileMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MIMII_SPECS.maxFileSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${MIMII_SPECS.maxFileSizeMB}MB allowed.`);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedFile(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext({ sampleRate: MIMII_SPECS.sampleRate });
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const rms = estimateRMS(audioBuffer);
      const centroid = estimateSpectralCentroid(audioBuffer);
      const snr = estimateSNR(audioBuffer);
      const mimiiCompatible =
        audioBuffer.sampleRate === MIMII_SPECS.sampleRate &&
        file.name.toLowerCase().endsWith(".wav");

      const metadata: AudioFileMetadata = {
        fileName: file.name,
        fileSize: file.size,
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        format: getFormatFromName(file.name),
        estimatedSNR: Math.round(snr * 10) / 10,
        rmsEnergy: Math.round(rms * 10000) / 10000,
        spectralCentroid: Math.round(centroid),
        mimiiCompatible,
      };

      setSelectedFile(metadata);
      onAudioDecoded(audioBuffer, file.name, metadata);
      audioCtx.close();
    } catch {
      setError("Could not decode audio file. Please use WAV, MP3, OGG, FLAC, or M4A format.");
    } finally {
      setLoading(false);
    }
  }, [onAudioDecoded]);

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileAudio className="w-4 h-4 text-accent" />
          Sound File Input
          <Badge variant="outline" className="text-[10px] font-mono ml-auto">MIMII Compatible</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* MIMII Specs */}
        <div className="rounded-md bg-accent/5 border border-accent/20 p-2.5 space-y-1">
          <p className="text-[10px] font-semibold text-accent flex items-center gap-1">
            <Info className="w-3 h-3" /> MIMII Dataset Reference
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
            <span className="text-muted-foreground">Format:</span>
            <span className="font-mono">{MIMII_SPECS.format} ({MIMII_SPECS.encoding})</span>
            <span className="text-muted-foreground">Sample Rate:</span>
            <span className="font-mono">{MIMII_SPECS.sampleRate} Hz</span>
            <span className="text-muted-foreground">Channels:</span>
            <span className="font-mono">{MIMII_SPECS.channels}-ch array</span>
            <span className="text-muted-foreground">SNR Levels:</span>
            <span className="font-mono">{MIMII_SPECS.snrLevels.join(", ")} dB</span>
            <span className="text-muted-foreground">FFT Frame:</span>
            <span className="font-mono">{MIMII_SPECS.fftSize} pts / {MIMII_SPECS.frameDurationMs} ms</span>
            <span className="text-muted-foreground">Segment:</span>
            <span className="font-mono">~{MIMII_SPECS.segmentDuration}s per clip</span>
          </div>
        </div>

        {/* Upload area */}
        <input
          ref={fileInputRef}
          type="file"
          accept={MIMII_SPECS.supportedInputFormats.join(",")}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || loading}
        />

        {!selectedFile ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || loading}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-colors disabled:opacity-50"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              {loading ? "Decoding audio…" : "Upload Sound File"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              WAV (recommended) · MP3 · OGG · FLAC · M4A — Max {MIMII_SPECS.maxFileSizeMB}MB
            </p>
          </button>
        ) : (
          <div className="rounded-md border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold truncate max-w-[200px]">{selectedFile.fileName}</span>
                {selectedFile.mimiiCompatible && (
                  <Badge className="bg-success/10 text-success text-[10px] px-1.5 py-0">MIMII ✓</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <MetricBox label="Duration" value={`${selectedFile.duration.toFixed(1)}s`} />
              <MetricBox label="Sample Rate" value={`${selectedFile.sampleRate} Hz`} />
              <MetricBox label="Channels" value={`${selectedFile.channels}`} />
              <MetricBox label="Format" value={selectedFile.format} />
              <MetricBox label="Est. SNR" value={`${selectedFile.estimatedSNR} dB`} highlight={selectedFile.estimatedSNR < 0} />
              <MetricBox label="RMS Energy" value={`${selectedFile.rmsEnergy}`} />
              <MetricBox label="Spectral Centroid" value={`${selectedFile.spectralCentroid} Hz`} />
              <MetricBox label="File Size" value={`${(selectedFile.fileSize / 1024).toFixed(1)} KB`} />
              <MetricBox
                label="MIMII Match"
                value={selectedFile.mimiiCompatible ? "Compatible" : "Non-standard"}
                highlight={!selectedFile.mimiiCompatible}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded px-2 py-1 ${highlight ? "bg-thermal/10" : "bg-muted/50"}`}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`font-mono font-semibold text-[11px] ${highlight ? "text-thermal" : ""}`}>{value}</p>
    </div>
  );
}
