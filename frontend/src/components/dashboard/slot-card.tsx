'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Settings, Terminal, FolderOpen, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { formatBytes } from '@/lib/utils';
import { Slot } from '@/services/slot.service';

interface SlotCardProps {
  slot: Slot;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
}

export function SlotCard({ slot, onStart, onStop, onRestart }: SlotCardProps) {
  const isOnline = slot.status === 'ONLINE';
  const isStarting = slot.status === 'STARTING';
  const isStopping = slot.status === 'STOPPING';
  
  const statusColors = {
    ONLINE: 'success',
    OFFLINE: 'default',
    STARTING: 'warning',
    STOPPING: 'warning',
    ERROR: 'destructive'
  } as const;

  const ramPercent = Math.min(100, Math.round((slot.ramUsage / slot.maxRam) * 100)) || 0;

  return (
    <Card className="hover:border-gray-700 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{slot.name}</CardTitle>
            <div className="text-sm text-gray-400">Minecraft {slot.version}</div>
          </div>
          <Badge variant={statusColors[slot.status]}>{slot.status}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">RAM</span>
            <span className="text-gray-200">{formatBytes(slot.ramUsage)} / {formatBytes(slot.maxRam)}</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-minecraft-green transition-all duration-500"
              style={{ width: `${ramPercent}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">CPU</span>
            <span className="text-gray-200">{slot.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, slot.cpuUsage)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-400 pt-2 border-t border-gray-800">
          IP: <span className="text-gray-200 select-all">{slot.ip}:{slot.port}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-2 border-t border-gray-800 bg-gray-900/50">
        <div className="flex gap-2 w-full mb-2">
          {!isOnline && !isStarting && (
            <Button size="sm" variant="default" className="flex-1 gap-2" onClick={() => onStart(slot.id)}>
              <Play size={14} /> Start
            </Button>
          )}
          {(isOnline || isStarting) && (
            <Button size="sm" variant="destructive" className="flex-1 gap-2" onClick={() => onStop(slot.id)}>
              <Square size={14} /> Stop
            </Button>
          )}
          <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={() => onRestart(slot.id)}>
            <RotateCcw size={14} /> Restart
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 w-full">
          <Link href={`/slots/${slot.id}/game`} className="flex-1">
            <Button size="icon" variant="ghost" className="w-full text-minecraft-accent" title="Game">
              <Gamepad2 size={16} />
            </Button>
          </Link>
          <Link href={`/slots/${slot.id}/console`} className="flex-1">
            <Button size="icon" variant="ghost" className="w-full" title="Console">
              <Terminal size={16} />
            </Button>
          </Link>
          <Link href={`/slots/${slot.id}/files`} className="flex-1">
            <Button size="icon" variant="ghost" className="w-full" title="Files">
              <FolderOpen size={16} />
            </Button>
          </Link>
          <Link href={`/slots/${slot.id}/settings`} className="flex-1">
            <Button size="icon" variant="ghost" className="w-full" title="Settings">
              <Settings size={16} />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
