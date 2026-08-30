'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Server, Plus, RefreshCw, Trash2, Cpu, HardDrive, ShieldCheck, Activity } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface NodeItem {
  id: string;
  name: string;
  ip: string;
  port: number;
  secretKey: string;
  os?: string;
  status: 'ONLINE' | 'OFFLINE';
  maxSlots?: number;
  metrics?: {
    cpuPercent?: number;
    memoryUsedMB?: number;
    memoryTotalMB?: number;
    activeSlotsCount?: number;
  };
}

export default function AdminNodesPage() {
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('4001');
  const [secretKey, setSecretKey] = useState('');
  const [os, setOs] = useState('Windows 10');
  const [maxSlots, setMaxSlots] = useState('20');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<NodeItem[]>('/nodes');
      setNodes(res.data || []);
    } catch (e) {
      // Mock data if backend is offline
      setNodes([
        {
          id: 'vps-win10-01',
          name: 'VPS Node 1 (Windows 10 Pro)',
          ip: '103.145.22.40',
          port: 4001,
          secretKey: 'agent_secret_123',
          os: 'Windows 10',
          status: 'ONLINE',
          maxSlots: 15,
          metrics: {
            cpuPercent: 18.5,
            memoryUsedMB: 6144,
            memoryTotalMB: 16384,
            activeSlotsCount: 4,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handlePing = async (id: string) => {
    setPingingId(id);
    try {
      const res = await apiClient.post<any>(`/nodes/${id}/ping`);
      const metrics = res.data;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, status: metrics.status, metrics: { ...n.metrics, ...metrics } }
            : n
        )
      );
    } catch (err) {
      console.error('Ping error:', err);
    } finally {
      setPingingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa VPS Node này khỏi danh sách?')) return;
    try {
      await apiClient.delete(`/nodes/${id}`);
      setNodes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert('Không thể xóa Node');
    }
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip || !port || !secretKey) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<NodeItem>('/nodes', {
        name,
        ip,
        port: parseInt(port, 10),
        secretKey,
        os,
        maxSlots: parseInt(maxSlots, 10),
      });
      setNodes((prev) => [...prev, res.data]);
      setIsAddModalOpen(false);
      setName('');
      setIp('');
      setSecretKey('');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thêm Node mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Quản lý VPS Nodes</h1>
          <p className="text-gray-400">
            Kết nối máy chủ VPS Windows 10 để tự động tạo và điều khiển các Slot Minecraft.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchNodes} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-minecraft-primary hover:bg-minecraft-accent">
            <Plus className="w-4 h-4 mr-2" />
            Thêm VPS Node
          </Button>
        </div>
      </div>

      {/* Nodes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nodes.map((node) => {
          const isOnline = node.status === 'ONLINE';
          const memUsedGB = ((node.metrics?.memoryUsedMB || 0) / 1024).toFixed(1);
          const memTotalGB = ((node.metrics?.memoryTotalMB || 16384) / 1024).toFixed(0);
          const memPercent = Math.round(
            ((node.metrics?.memoryUsedMB || 0) / (node.metrics?.memoryTotalMB || 16384)) * 100
          );

          return (
            <Card key={node.id} className="bg-gray-900 border-gray-800 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-800 text-minecraft-accent">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{node.name}</CardTitle>
                      <CardDescription className="text-gray-400 font-mono text-xs">
                        {node.ip}:{node.port} • Hệ điều hành: {node.os || 'Windows 10'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={isOnline ? 'success' : 'destructive'}>
                    {node.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-950/60 rounded-lg border border-gray-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-400">
                      <Cpu className="w-3.5 h-3.5 mr-1 text-blue-400" /> CPU
                    </div>
                    <div className="text-sm font-bold text-white">
                      {node.metrics?.cpuPercent ?? 0}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-400">
                      <HardDrive className="w-3.5 h-3.5 mr-1 text-emerald-400" /> RAM
                    </div>
                    <div className="text-sm font-bold text-white">
                      {memUsedGB} / {memTotalGB} GB ({memPercent}%)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-400">
                      <Activity className="w-3.5 h-3.5 mr-1 text-purple-400" /> Slots Đang Chạy
                    </div>
                    <div className="text-sm font-bold text-white">
                      {node.metrics?.activeSlotsCount ?? 0} / {node.maxSlots || 20}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div className="text-xs text-gray-500 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    Key: ••••••••••••
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePing(node.id)}
                      disabled={pingingId === node.id}
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 mr-1 ${
                          pingingId === node.id ? 'animate-spin' : ''
                        }`}
                      />
                      Kiểm tra Ping
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(node.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Add Node */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-minecraft-accent" /> Thêm VPS Node Mới (Windows 10)
            </h2>
            <p className="text-sm text-gray-400">
              Nhập địa chỉ IP và mã bảo mật của Agent đang chạy trên máy chủ VPS Windows 10 của bạn.
            </p>

            <form onSubmit={handleAddNode} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Tên Node nhận diện</label>
                <Input
                  placeholder="VD: VPS-Win10-01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Địa chỉ IP công khai của VPS</label>
                  <Input
                    placeholder="VD: 103.145.22.40"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Port Agent</label>
                  <Input
                    placeholder="4001"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Mã bí mật Agent (AGENT_SECRET_KEY)</label>
                <Input
                  type="password"
                  placeholder="Nhập mã bí mật cấu hình trên VPS"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Hệ điều hành</label>
                  <Input
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    placeholder="Windows 10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Số Slot tối đa chứa được</label>
                  <Input
                    type="number"
                    value={maxSlots}
                    onChange={(e) => setMaxSlots(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="bg-minecraft-primary hover:bg-minecraft-accent text-white"
                >
                  Thêm & Kết nối ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
