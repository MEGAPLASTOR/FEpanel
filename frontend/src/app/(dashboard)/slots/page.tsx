'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Server, Play, Square, RotateCw, Terminal, Eye, FolderTree, Cpu, HardDrive } from 'lucide-react';
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
  const [maxSlots, setMaxSlots] = useState<number>(3);
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
        setMaxSlots(userRes.data?.maxSlots ?? 3);
      }
      const slotsRes = await apiClient.get<SlotItem[]>('/slots');
      setSlots(slotsRes.data || []);
    } catch (e) {
      // Mock data if backend is offline
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
          <h1 className="text-3xl font-bold text-white mb-1">Quản lý Slot Minecraft</h1>
          <p className="text-gray-400">
            Mỗi Slot tương ứng với 1 tài khoản Minecraft được chạy cô lập 24/7 trên VPS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-minecraft-accent" />
            <span>
              Hạn mức: <strong className="text-white">{slots.length}</strong> / {maxSlots} Slots
            </span>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={isQuotaFull}
            className="bg-minecraft-primary hover:bg-minecraft-accent text-white"
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
            <Card key={slot.id} className="bg-gray-900 border-gray-800 flex flex-col justify-between overflow-hidden">
              <div
                className={`h-1 w-full ${
                  isRunning
                    ? 'bg-green-500'
                    : isStarting || isStopping
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white font-bold">{slot.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-400 font-mono mt-0.5">
                      Acc: <span className="text-emerald-400 font-semibold">{slot.username}</span> • v{slot.version}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      isRunning ? 'success' : isStarting || isStopping ? 'warning' : 'destructive'
                    }
                  >
                    {slot.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                  <div className="flex items-center text-gray-400">
                    <Cpu className="w-3.5 h-3.5 mr-1 text-blue-400" /> CPU: {slot.cpuPercent ?? 0}%
                  </div>
                  <div className="flex items-center text-gray-400">
                    <HardDrive className="w-3.5 h-3.5 mr-1 text-emerald-400" /> RAM: {slot.allocatedRamMB || 2048} MB
                  </div>
                  <div className="col-span-2 text-gray-400 truncate">
                    Server: <span className="text-white">{slot.serverIp || 'localhost'}:{slot.serverPort || 25565}</span>
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
                      <Square className="w-3.5 h-3.5 mr-1" /> Tắt
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStart(slot.id)}
                      disabled={isStarting}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                    >
                      <Play className="w-3.5 h-3.5 mr-1" /> Bật
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestart(slot.id)}
                    disabled={!isRunning || isStarting || isStopping}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Direct Views */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                  <Link href={`/slots/${slot.id}/game`}>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8 text-emerald-400 hover:text-emerald-300">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Xem Live
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-minecraft-accent" /> Tạo Slot Treo Acc Minecraft Mới
            </h2>
            <p className="text-sm text-gray-400">
              Cấu hình tài khoản và server đích. Hệ thống sẽ tự động khởi tạo trên VPS của bạn.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Tên Slot</label>
                <Input
                  placeholder="VD: Treo Server Hypixel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Phiên bản Minecraft</label>
                  <Input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.20.4"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Tên Nhân vật (Acc MC)</label>
                  <Input
                    placeholder="VD: PlayerOne"
                    value={mcUsername}
                    onChange={(e) => setMcUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">IP Server Game đích</label>
                  <Input
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    placeholder="mc.hypixel.net"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Port</label>
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
                  className="rounded bg-gray-950 border-gray-800 text-minecraft-primary focus:ring-0"
                />
                <label htmlFor="autoReconnect" className="text-xs text-gray-300 cursor-pointer">
                  Tự động kết nối lại khi bị kick / server bảo trì (Auto-Reconnect)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="bg-minecraft-primary hover:bg-minecraft-accent text-white"
                >
                  Khởi tạo Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
