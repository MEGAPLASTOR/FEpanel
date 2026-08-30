'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { SlotCard } from '@/components/dashboard/slot-card';
import { slotService, Slot } from '@/services/slot.service';
import { Loading } from '@/components/ui/loading';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      // For now, mockup data since API is not ready
      const mockSlots: Slot[] = [
        { id: '1', name: 'Survival Server', status: 'ONLINE', version: '1.20.1', ramUsage: 2.1 * 1024 * 1024 * 1024, maxRam: 4 * 1024 * 1024 * 1024, cpuUsage: 45.2, players: 5, maxPlayers: 20, uptime: 3600, port: 25565, ip: 'node1.mccloud.com' },
        { id: '2', name: 'Creative World', status: 'OFFLINE', version: '1.19.4', ramUsage: 0, maxRam: 2 * 1024 * 1024 * 1024, cpuUsage: 0, players: 0, maxPlayers: 10, uptime: 0, port: 25566, ip: 'node1.mccloud.com' },
      ];
      setSlots(mockSlots);
      // const data = await slotService.getMySlots();
      // setSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'STARTING' } : s));
    // slotService.startSlot(id).then(fetchSlots);
  };
  const handleStop = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'STOPPING' } : s));
    // slotService.stopSlot(id).then(fetchSlots);
  };
  const handleRestart = (id: string) => {
    // slotService.restartSlot(id).then(fetchSlots);
  };

  const totalSlots = slots.length;
  const onlineSlots = slots.filter(s => s.status === 'ONLINE').length;
  const offlineSlots = slots.filter(s => s.status === 'OFFLINE' || s.status === 'ERROR').length;

  if (loading) return <Loading text="Loading dashboard..." className="mt-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-gray-400">Here's an overview of your Minecraft servers.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> New Server
        </Button>
      </div>

      <StatsOverview totalSlots={totalSlots} onlineSlots={onlineSlots} offlineSlots={offlineSlots} />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Your Servers</h2>
        </div>
        
        {slots.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400 mb-4">You don't have any servers yet.</p>
            <Button>Create your first server</Button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
