import { useRef, useEffect } from "react";

interface WaveformCanvasProps {
  analyser: AnalyserNode | null;
}

export function WaveformCanvas({ analyser }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);

      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--wf-bg") || "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "hsl(189, 94%, 43%)";
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 md:h-40 rounded-md bg-muted"
      style={{ "--wf-bg": "transparent" } as React.CSSProperties}
    />
  );
}
