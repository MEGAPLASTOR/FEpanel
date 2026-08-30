'use client';

import { useParams } from 'next/navigation';
import { ResourceGauge } from '@/components/dashboard/resource-gauge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw } from 'lucide-react';

export default function SlotDetailPage() {
  const params = useParams();
  const slotId = params.slotId as string;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Server {slotId}</h1>
          <p className="text-gray-400">Manage your server instance.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="default" className="gap-2">
            <Play size={14} /> Start
          </Button>
          <Button size="sm" variant="destructive" className="gap-2">
            <Square size={14} /> Stop
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <RotateCcw size={14} /> Restart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <ResourceGauge label="CPU Usage" value={45} max={100} unit="%" color="bg-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <ResourceGauge label="RAM Usage" value={2.1} max={4} unit="GB" color="bg-minecraft-green" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
            <Badge variant="success" className="text-lg px-4 py-1">ONLINE</Badge>
            <p className="text-xs text-gray-500 mt-4">Uptime: 1h 24m</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Players</h3>
            <div className="text-4xl font-bold text-white">5 <span className="text-xl text-gray-500">/ 20</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
