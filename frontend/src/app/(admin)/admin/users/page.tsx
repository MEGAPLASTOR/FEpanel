'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Shield, Server, Edit3, Check, RefreshCw, ChevronDown, ChevronUp, Play, Square, Activity, Cpu, HardDrive } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface SlotDetail {
  id: string;
  name: string;
  version: string;
  username: string;
  serverIp?: string;
  serverPort?: number;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  allocatedRamMB?: number;
  cpuPercent?: number;
  ownerId: string;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'suspended' | 'banned';
  maxSlots?: number;
  slots?: SlotDetail[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [allSlots, setAllSlots] = useState<SlotDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editSlots, setEditSlots] = useState<number>(5);
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  const fetchUsersAndSlots = async () => {
    setLoading(true);
    try {
      const [usersRes, slotsRes] = await Promise.all([
        apiClient.get<UserData[]>('/users'),
        apiClient.get<SlotDetail[]>('/slots'),
      ]);
      const uData = usersRes.data || [];
      const sData = slotsRes.data || [];
      setAllSlots(sData);

      // Attach slots to each user
      const usersWithSlots = uData.map((u) => ({
        ...u,
        slots: sData.filter((s) => s.ownerId === u.uid),
      }));

      setUsers(usersWithSlots);
    } catch (e) {
      // Mock data for preview
      setUsers([
        {
          uid: 'admin_master',
          email: 'megaplastor@minecraft.panel',
          displayName: 'MEGAPLASTOR (Admin)',
          role: 'ADMIN',
          status: 'active',
          maxSlots: 99,
          slots: [
            {
              id: 'slot_admin_1',
              name: 'Server Admin Master',
              version: '1.20.4',
              username: 'MEGAPLASTOR_AFK',
              serverIp: 'mc.hypixel.net',
              serverPort: 25565,
              status: 'running',
              allocatedRamMB: 4096,
              cpuPercent: 14.5,
              ownerId: 'admin_master',
            },
          ],
        },
        {
          uid: 'user_khach_1',
          email: 'khachhang1@gmail.com',
          displayName: 'Player One',
          role: 'USER',
          status: 'active',
          maxSlots: 3,
          slots: [
            {
              id: 'slot_user1_1',
              name: 'Treo Acc Farm Gỗ',
              version: '1.16.5',
              username: 'GamerVN_01',
              serverIp: 'play.heromc.net',
              serverPort: 25565,
              status: 'running',
              allocatedRamMB: 2048,
              cpuPercent: 8.2,
              ownerId: 'user_khach_1',
            },
            {
              id: 'slot_user1_2',
              name: 'AFK Đào Khoáng Sản',
              version: '1.20.1',
              username: 'MinerVN',
              serverIp: 'skyblock.net',
              serverPort: 25565,
              status: 'stopped',
              allocatedRamMB: 2048,
              cpuPercent: 0,
              ownerId: 'user_khach_1',
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndSlots();
  }, []);

  const handleStartEdit = (user: UserData) => {
    setEditingUid(user.uid);
    setEditSlots(user.maxSlots ?? 5);
  };

  const handleSaveQuota = async (uid: string) => {
    setSavingUid(uid);
    try {
      await apiClient.patch(`/users/${uid}`, {
        maxSlots: Number(editSlots),
      });
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, maxSlots: Number(editSlots) } : u))
      );
      setEditingUid(null);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật hạn mức Slot');
    } finally {
      setSavingUid(null);
    }
  };

  const toggleExpand = (uid: string) => {
    setExpandedUid(expandedUid === uid ? null : uid);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-galaxy-text mb-1 tracking-wide flex items-center gap-2">
            <Users className="w-8 h-8 text-galaxy-primary animate-pulse" /> Danh sách Khách hàng & Slots Cấp quyền
          </h1>
          <p className="text-galaxy-text-sub text-sm">
            Xem tất cả tài khoản, chi tiết các Slot Minecraft mà họ đang chạy, và điều chỉnh hạn mức Slot trực tiếp.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsersAndSlots} disabled={loading} className="border-galaxy-border">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới dữ liệu
        </Button>
      </div>

      {/* Users Cards / List */}
      <div className="space-y-4">
        {users.map((user) => {
          const userSlots = user.slots || [];
          const isExpanded = expandedUid === user.uid;
          const runningSlotsCount = userSlots.filter((s) => s.status === 'running').length;

          return (
            <Card key={user.uid} className="bg-galaxy-card/90 border-galaxy-border overflow-hidden transition-all duration-200 hover:border-galaxy-primary/40">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-galaxy-secondary to-galaxy-card-hover border border-galaxy-secondary/40 flex items-center justify-center text-lg font-bold text-galaxy-highlight shadow-galaxy-purple">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-galaxy-text">{user.displayName || 'Unnamed User'}</h3>
                      <Badge variant={user.role === 'ADMIN' ? 'warning' : 'outline'}>
                        {user.role === 'ADMIN' ? (
                          <span className="flex items-center gap-1 text-galaxy-warning font-bold">
                            <Shield className="w-3 h-3" /> ADMIN MASTER
                          </span>
                        ) : (
                          'Khách hàng'
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-galaxy-text-sub mt-0.5">{user.email}</p>
                  </div>
                </div>

                {/* Slot Summary & Quota Edit */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Active slots badge */}
                  <div className="text-xs bg-galaxy-bg-sub/80 px-3.5 py-2 rounded-xl border border-galaxy-border flex items-center gap-2">
                    <Activity className="w-4 h-4 text-galaxy-success" />
                    <span>
                      Đang chạy: <strong className="text-galaxy-success font-bold">{runningSlotsCount}</strong> / {userSlots.length} Slots đã tạo
                    </span>
                  </div>

                  {/* Quota modifier */}
                  <div className="flex items-center gap-2">
                    {editingUid === user.uid ? (
                      <div className="flex items-center gap-2 bg-galaxy-bg-sub p-1 rounded-xl border border-galaxy-primary/50">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editSlots}
                          onChange={(e) => setEditSlots(parseInt(e.target.value, 10) || 0)}
                          className="h-8 w-20 text-center font-bold text-galaxy-text bg-galaxy-bg"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveQuota(user.uid)}
                          loading={savingUid === user.uid}
                          className="h-8 px-3"
                        >
                          <Check className="w-4 h-4 mr-1" /> Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUid(null)}
                          className="h-8 px-2"
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-galaxy-bg-sub px-3.5 py-1.5 rounded-xl border border-galaxy-border">
                        <Server className="w-4 h-4 text-galaxy-primary" />
                        <span className="text-xs text-galaxy-text-sub">Hạn mức cấp:</span>
                        <span className="font-extrabold text-galaxy-highlight text-sm">{user.maxSlots ?? 5} Slots</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(user)}
                          className="h-6 w-6 p-0 ml-1 text-galaxy-text-sub hover:text-galaxy-primary"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expand slots details button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExpand(user.uid)}
                    className="border-galaxy-border/80 text-xs"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1 text-galaxy-primary" /> Ẩn danh sách ({userSlots.length})
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1 text-galaxy-primary" /> Xem {userSlots.length} Slots
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded List of User's Minecraft Slots */}
              {isExpanded && (
                <div className="border-t border-galaxy-border bg-galaxy-bg/70 p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-galaxy-text-sub flex items-center gap-2">
                    <Server className="w-4 h-4 text-galaxy-primary" /> Các Slot Minecraft của {user.displayName}
                  </h4>

                  {userSlots.length === 0 ? (
                    <div className="text-xs text-galaxy-text-sub italic py-2">
                      Người dùng này chưa tạo Slot nào.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {userSlots.map((slot) => {
                        const isRunning = slot.status === 'running';
                        return (
                          <div
                            key={slot.id}
                            className="p-3.5 rounded-xl bg-galaxy-card border border-galaxy-border/80 flex flex-col justify-between space-y-2 hover:border-galaxy-border transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-sm font-bold text-galaxy-text">{slot.name}</div>
                                <div className="text-xs text-galaxy-text-sub font-mono">
                                  Acc: <strong className="text-galaxy-accent">{slot.username}</strong> • v{slot.version}
                                </div>
                              </div>
                              <Badge variant={isRunning ? 'success' : 'destructive'}>
                                {slot.status.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-galaxy-bg-sub p-2 rounded-lg border border-galaxy-border/50 text-galaxy-text-sub">
                              <div className="flex items-center">
                                <Cpu className="w-3 h-3 mr-1 text-blue-400" /> CPU: {slot.cpuPercent ?? 0}%
                              </div>
                              <div className="flex items-center">
                                <HardDrive className="w-3 h-3 mr-1 text-emerald-400" /> RAM: {slot.allocatedRamMB || 2048}MB
                              </div>
                              <div className="col-span-2 truncate">
                                Server: <span className="text-galaxy-text">{slot.serverIp || 'localhost'}:{slot.serverPort || 25565}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
