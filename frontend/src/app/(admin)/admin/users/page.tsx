'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Shield, Server, Edit3, Check, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'suspended' | 'banned';
  maxSlots?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editSlots, setEditSlots] = useState<number>(1);
  const [savingUid, setSavingUid] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<UserData[]>('/users');
      setUsers(res.data || []);
    } catch (e) {
      // Mock default users if offline
      setUsers([
        {
          uid: 'user_1',
          email: 'admin@minecraft.panel',
          displayName: 'Admin Master',
          role: 'ADMIN',
          status: 'active',
          maxSlots: 99,
        },
        {
          uid: 'user_2',
          email: 'khachhang1@gmail.com',
          displayName: 'Player One',
          role: 'USER',
          status: 'active',
          maxSlots: 2,
        },
        {
          uid: 'user_3',
          email: 'treomc247@gmail.com',
          displayName: 'AFK Master',
          role: 'USER',
          status: 'active',
          maxSlots: 5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStartEdit = (user: UserData) => {
    setEditingUid(user.uid);
    setEditSlots(user.maxSlots ?? 1);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Quản lý Khách hàng & Cấp Slot</h1>
          <p className="text-gray-400">
            Xem danh sách tài khoản và phân quyền cấp số lượng Slot Minecraft cho từng khách hàng.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-minecraft-accent" /> Danh sách Người dùng
          </CardTitle>
          <CardDescription className="text-gray-400">
            Chỉnh sửa trực tiếp số lượng Slot được phép tạo cho từng tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 text-gray-400 font-medium">
                <tr>
                  <th className="py-3 px-4">Tài khoản</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Hạn mức Slot (Cấp quyền)</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-minecraft-accent">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {user.displayName || 'Unnamed'}
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-xs">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.role === 'ADMIN' ? 'warning' : 'outline'}>
                        {user.role === 'ADMIN' ? (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          'Khách hàng'
                        )}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {editingUid === user.uid ? (
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={editSlots}
                            onChange={(e) => setEditSlots(parseInt(e.target.value, 10) || 0)}
                            className="h-8 text-center font-bold text-white bg-gray-950"
                          />
                          <span className="text-xs text-gray-400">Slots</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-minecraft-accent" />
                          <span className="font-bold text-white text-base">
                            {user.maxSlots ?? 1}
                          </span>
                          <span className="text-xs text-gray-400">Slots</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingUid === user.uid ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveQuota(user.uid)}
                            loading={savingUid === user.uid}
                            className="bg-minecraft-primary hover:bg-minecraft-accent text-white h-8"
                          >
                            <Check className="w-4 h-4 mr-1" /> Lưu
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUid(null)}
                            className="h-8"
                          >
                            Hủy
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(user)}
                          className="h-8 text-xs hover:text-minecraft-accent hover:border-minecraft-accent"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" /> Cấp Slot
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
