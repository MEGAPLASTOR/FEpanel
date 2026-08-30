'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Server, Play, Square, RotateCw, Terminal, Eye, FolderTree, Cpu, HardDrive, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

interface SlotItem {
  id: string;
  name: string;
  version: string;
  username: string;
  serverIp?: string;
  serverPort?: number;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  allocatedRamMB?: number;
  cpuPercent?: number;
  autoReconnect?: boolean;
}

export default function SlotsPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [maxSlots, setMaxSlots] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.20.4');
  const [mcUsername, setMcUsername] = useState('');
  const [serverIp, setServerIp] = useState('mc.hypixel.net');
  const [serverPort, setServerPort] = useState('25565');
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlotsAndQuota = async () => {
    setLoading(true);
    try {
      if (user?.uid) {
        const userRes = await apiClient.get<any>(`/users/${user.uid}`);
        setMaxSlots(userRes.data?.maxSlots ?? 5);
      }
      const slotsRes = await apiClient.get<SlotItem[]>('/slots');
      setSlots(slotsRes.data || []);
    } catch (e) {
      // Mock preview slots
      setSlots([
        {
          id: 'slot_1',
          name: 'Treo Hypixel 24/7',
          version: '1.20.4',
          username: 'ProGamer_VN',
          serverIp: 'mc.hypixel.net',
          serverPort: 25565,
          status: 'running',
          allocatedRamMB: 2048,
          cpuPercent: 12.4,
          autoReconnect: true,
        },
        {
          id: 'slot_2',
          name: 'AFK Farm Lúa Mì',
          version: '1.16.5',
          username: 'Farmer_01',
          serverIp: 'play.heromc.net',
          serverPort: 25565,
          status: 'stopped',
          allocatedRamMB: 2048,
          cpuPercent: 0,
          autoReconnect: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsAndQuota();
  }, [user]);

  const handleStart = async (id: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'starting' } : s)));
    try {
      await apiClient.post(`/slots/${id}/start`);
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'running' } : s)));
    } catch (e) {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'stopped' } : s)));
    }
  };

  const handleStop = async (id: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'stopping' } : s)));
    try {
      await apiClient.post(`/slots/${id}/stop`);
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'stopped' } : s)));
    } catch (e) {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'running' } : s)));
    }
  };

  const handleRestart = async (id: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'starting' } : s)));
    try {
      await apiClient.post(`/slots/${id}/restart`);
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'running' } : s)));
    } catch (e) {}
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mcUsername) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<SlotItem>('/slots', {
        name,
        version,
        username: mcUsername,
        serverIp,
        serverPort: parseInt(serverPort, 10),
        autoReconnect,
        ownerId: user?.uid || 'anonymous',
      });
      setSlots((prev) => [...prev, res.data]);
      setIsCreateOpen(false);
      setName('');
      setMcUsername('');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo Slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuotaFull = slots.length >= maxSlots;

  return (
    <div className="space-y-6">
      {/* Header & Quota */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-galaxy-text mb-1 tracking-wide flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-galaxy-primary animate-pulse" /> Danh sách Minecraft Slots
          </h1>
          <p className="text-galaxy-text-sub text-sm">
            Mỗi Slot là một tài khoản Minecraft được chạy cô lập 24/7 trên máy chủ VPS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-galaxy-card border border-galaxy-border rounded-xl text-xs font-medium text-galaxy-text-sub flex items-center gap-2.5 shadow-sm">
            <Server className="w-4 h-4 text-galaxy-primary" />
            <span>
              Hạn mức Admin cấp: <strong className="text-galaxy-highlight font-extrabold text-sm">{slots.length}</strong> / {maxSlots} Slots
            </span>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={isQuotaFull}
            className="shadow-galaxy-glow text-xs px-4"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {isQuotaFull ? 'Hết hạn mức Slot' : 'Tạo Slot Mới'}
          </Button>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot) => {
          const isRunning = slot.status === 'running';
          const isStarting = slot.status === 'starting';
          const isStopping = slot.status === 'stopping';

          return (
            <Card key={slot.id} className="bg-galaxy-card/95 border-galaxy-border flex flex-col justify-between overflow-hidden relative shadow-lg hover:border-galaxy-primary/50 transition-all duration-200">
              <div
                className={`h-1.5 w-full ${
                  isRunning
                    ? 'bg-galaxy-success shadow-[0_0_10px_#00E6A8]'
                    : isStarting || isStopping
                    ? 'bg-galaxy-warning animate-pulse'
                    : 'bg-galaxy-error/70'
                }`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-galaxy-text font-bold tracking-tight">{slot.name}</CardTitle>
                    <CardDescription className="text-xs text-galaxy-text-sub font-mono mt-1">
                      Acc: <strong className="text-galaxy-accent font-bold">{slot.username}</strong> • v{slot.version}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      isRunning ? 'success' : isStarting || isStopping ? 'warning' : 'destructive'
                    }
                  >
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-galaxy-success animate-ping' : 'bg-current'}`} />
                      {slot.status.toUpperCase()}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs bg-galaxy-bg-sub/80 p-3 rounded-xl border border-galaxy-border">
                  <div className="flex items-center text-galaxy-text-sub">
                    <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> CPU: <strong className="text-galaxy-text ml-1">{slot.cpuPercent ?? 0}%</strong>
                  </div>
                  <div className="flex items-center text-galaxy-text-sub">
                    <HardDrive className="w-3.5 h-3.5 mr-1.5 text-galaxy-accent" /> RAM: <strong className="text-galaxy-text ml-1">{slot.allocatedRamMB || 2048}MB</strong>
                  </div>
                  <div className="col-span-2 text-galaxy-text-sub truncate font-mono text-[11px] mt-1 pt-1 border-t border-galaxy-border/50">
                    Server: <span className="text-galaxy-highlight font-semibold">{slot.serverIp || 'localhost'}:{slot.serverPort || 25565}</span>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStop(slot.id)}
                      disabled={isStopping}
                      className="flex-1"
                    >
                      <Square className="w-3.5 h-3.5 mr-1.5" /> Dừng Game
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStart(slot.id)}
                      disabled={isStarting}
                      className="flex-1 bg-galaxy-success hover:bg-galaxy-success/90 text-galaxy-bg font-bold shadow-[0_0_15px_-3px_#00E6A8]"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Bắt đầu Treo
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestart(slot.id)}
                    disabled={!isRunning || isStarting || isStopping}
                    title="Khởi động lại"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Direct Views */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-galaxy-border">
                  <Link href={`/slots/${slot.id}/game`}>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 text-galaxy-accent hover:text-galaxy-accent hover:border-galaxy-accent/50">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Màn hình
                    </Button>
                  </Link>
                  <Link href={`/slots/${slot.id}/console`}>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8">
                      <Terminal className="w-3.5 h-3.5 mr-1" /> Console
                    </Button>
                  </Link>
                  <Link href={`/slots/${slot.id}/files`}>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8">
                      <FolderTree className="w-3.5 h-3.5 mr-1" /> Files
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Create Slot */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-galaxy-card border border-galaxy-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-galaxy-text flex items-center gap-2">
              <Server className="w-5 h-5 text-galaxy-primary" /> Khởi tạo Slot Treo Acc Minecraft
            </h2>
            <p className="text-xs text-galaxy-text-sub">
              Hệ thống sẽ tạo 1 môi trường game cô lập trên VPS và tự động kết nối vào server.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-galaxy-text-sub">Tên Slot nhận diện</label>
                <Input
                  placeholder="VD: Treo Server Hypixel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-galaxy-text-sub">Phiên bản Minecraft</label>
                  <Input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.20.4"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-galaxy-text-sub">Tên Nhân vật (Acc MC)</label>
                  <Input
                    placeholder="VD: ThoDepTrai_AFK"
                    value={mcUsername}
                    onChange={(e) => setMcUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-galaxy-text-sub">IP Server Game đích</label>
                  <Input
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    placeholder="mc.hypixel.net"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-galaxy-text-sub">Port</label>
                  <Input
                    value={serverPort}
                    onChange={(e) => setServerPort(e.target.value)}
                    placeholder="25565"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoReconnect"
                  checked={autoReconnect}
                  onChange={(e) => setAutoReconnect(e.target.checked)}
                  className="rounded bg-galaxy-bg border-galaxy-border text-galaxy-primary focus:ring-0"
                />
                <label htmlFor="autoReconnect" className="text-xs text-galaxy-text cursor-pointer">
                  Tự động kết nối lại khi bị kick / server bảo trì (Auto-Reconnect)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-galaxy-border">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Khởi tạo Slot ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
