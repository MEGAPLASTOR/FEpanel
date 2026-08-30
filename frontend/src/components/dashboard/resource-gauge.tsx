'use client';

interface ResourceGaugeProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color?: string;
}

export function ResourceGauge({ label, value, max, unit = '', color = 'bg-minecraft-green' }: ResourceGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center mb-2">
        {/* Background Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-800"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={351.858}
            strokeDashoffset={351.858 - (351.858 * percentage) / 100}
            className={`text-minecraft-accent transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-white">{value.toFixed(1)}{unit}</span>
          <span className="text-xs text-gray-400">/ {max}{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
  );
}
