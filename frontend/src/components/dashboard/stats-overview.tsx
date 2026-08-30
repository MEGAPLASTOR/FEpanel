'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Server, Users, PowerOff } from 'lucide-react';

interface StatsOverviewProps {
  totalSlots: number;
  onlineSlots: number;
  offlineSlots: number;
}

export function StatsOverview({ totalSlots, onlineSlots, offlineSlots }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 bg-gray-800 rounded-lg text-gray-300">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Slots</p>
            <h3 className="text-2xl font-bold text-white">{totalSlots}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 bg-minecraft-dark/30 rounded-lg text-minecraft-accent">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Online Slots</p>
            <h3 className="text-2xl font-bold text-white">{onlineSlots}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 bg-gray-800 rounded-lg text-gray-400">
            <PowerOff size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Offline Slots</p>
            <h3 className="text-2xl font-bold text-white">{offlineSlots}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
