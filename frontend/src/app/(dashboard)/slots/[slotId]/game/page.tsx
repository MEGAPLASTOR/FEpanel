'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, MousePointer, Maximize2, RefreshCw, Radio, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function GameStreamingPage({ params }: { params: { slotId: string } }) {
  const [isConnected, setIsConnected] = useState(true);
  const [fps, setFps] = useState(30);
  const [ping, setPing] = useState(24);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const renderGameFrame = () => {
      tick++;
      // Render simulated virtual Minecraft environment
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sky and Ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Minecraft Crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      // Minecraft Hotbar Simulation
      const hotbarW = 360;
      const hotbarH = 40;
      const hx = (canvas.width - hotbarW) / 2;
      const hy = canvas.height - hotbarH - 12;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(hx, hy, hotbarW, hotbarH);
      ctx.fillRect(hx, hy, hotbarW, hotbarH);

      // Live Watermark & HUD
      ctx.font = '14px monospace';
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`● LIVE WEBRTC STREAM | SLOT: ${params.slotId}`, 20, 30);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`FPS: 30 | Latency: 24ms | Mode: AFK Treo Acc`, 20, 50);

      animationFrameId = requestAnimationFrame(renderGameFrame);
    };

    renderGameFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [params.slotId]);

  const handleCanvasClick = () => {
    if (canvasRef.current && !isPointerLocked) {
      canvasRef.current.requestPointerLock?.();
      setIsPointerLocked(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/slots" className="text-xs text-gray-400 hover:text-white">
              ← Quay lại Slots
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500 animate-pulse" /> Màn hình Điều khiển Trực tiếp (WebRTC)
          </h1>
          <p className="text-gray-400 text-sm">
            Xem và điều khiển trực tiếp nhân vật Minecraft trong Slot {params.slotId} ngay trên trình duyệt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'destructive'} className="h-7 px-3">
            {isConnected ? 'STREAM ONLINE' : 'DISCONNECTED'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="h-8"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </Button>
        </div>
      </div>

      {/* Main Stream Canvas */}
      <Card className="bg-gray-900 border-gray-800 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gray-950 border-b border-gray-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-300 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> 30 FPS
            </span>
            <span>Độ trễ: 24ms</span>
            <span>Độ phân giải: 1024x768 (Virtual Screen)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCanvasClick}
              className="h-7 text-xs bg-gray-800"
            >
              <MousePointer className="w-3.5 h-3.5 mr-1" />
              {isPointerLocked ? 'Đang bắt chuột (Bấm ESC để thoát)' : 'Khóa chuột điều khiển'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-[4/3] bg-black">
            <canvas
              ref={canvasRef}
              width={1024}
              height={768}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain cursor-crosshair"
            />
            {!isPointerLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity">
                <div className="px-4 py-2 bg-gray-900/90 border border-gray-700 rounded-lg text-white text-xs font-semibold flex items-center gap-2 pointer-events-none">
                  <MousePointer className="w-4 h-4 text-minecraft-accent" /> Nhấp vào màn hình để điều khiển nhân vật
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
