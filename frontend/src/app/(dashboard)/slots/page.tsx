'use client';

import { useEffect, useState } from 'react';
import { SlotCard } from '@/components/dashboard/slot-card';
import { slotService, Slot } from '@/services/slot.service';
import { Loading } from '@/components/ui/loading';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for scaffolding
    const mockSlots: Slot[] = [
      { id: '1', name: 'Survival Server', status: 'ONLINE', version: '1.20.1', ramUsage: 2.1 * 1024 * 1024 * 1024, maxRam: 4 * 1024 * 1024 * 1024, cpuUsage: 45.2, players: 5, maxPlayers: 20, uptime: 3600, port: 25565, ip: 'node1.mccloud.com' },
      { id: '2', name: 'Creative World', status: 'OFFLINE', version: '1.19.4', ramUsage: 0, maxRam: 2 * 1024 * 1024 * 1024, cpuUsage: 0, players: 0, maxPlayers: 10, uptime: 0, port: 25566, ip: 'node1.mccloud.com' },
      { id: '3', name: 'Modded RPG', status: 'STARTING', version: '1.16.5', ramUsage: 1.5 * 1024 * 1024 * 1024, maxRam: 8 * 1024 * 1024 * 1024, cpuUsage: 80.5, players: 0, maxPlayers: 50, uptime: 60, port: 25567, ip: 'node1.mccloud.com' },
    ];
    setSlots(mockSlots);
    setLoading(false);
  }, []);

  const handleStart = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'STARTING' } : s));
  };
  const handleStop = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'STOPPING' } : s));
  };
  const handleRestart = (id: string) => {};

  if (loading) return <Loading text="Loading slots..." className="mt-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Slots</h1>
          <p className="text-gray-400">Manage all your Minecraft server slots.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> New Server
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {slots.map(slot => (
          <SlotCard 
            key={slot.id} 
            slot={slot} 
            onStart={handleStart} 
            onStop={handleStop} 
            onRestart={handleRestart} 
          />
        ))}
      </div>
    </div>
  );
}
