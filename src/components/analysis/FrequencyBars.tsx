import { useRef, useEffect } from "react";

interface FrequencyBarsProps {
  analyser: AnalyserNode | null;
  onDecibelUpdate?: (db: number) => void;
}

export function FrequencyBars({ analyser, onDecibelUpdate }: FrequencyBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);

      ctx.clearRect(0, 0, width, height);

      // Compute RMS for decibel
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / bufferLength);
      const db = Math.max(0, Math.min(100, (rms / 255) * 100));
      onDecibelUpdate?.(db);

      const barCount = 64;
      const step = Math.floor(bufferLength / barCount);
      const barWidth = width / barCount - 1;

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * step];
        const barHeight = (val / 255) * height;
        const hue = 189 - (val / 255) * 170;
        ctx.fillStyle = `hsl(${hue}, 90%, 50%)`;
        ctx.fillRect(i * (barWidth + 1), height - barHeight, barWidth, barHeight);
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [analyser, onDecibelUpdate]);

  return <canvas ref={canvasRef} className="w-full h-32 md:h-40 rounded-md bg-muted" />;
}
