import { LucideIcon } from "lucide-react";
import { ParticleCard } from "@/components/MagicBento";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
}: StatCardProps) {
  const cardStyle = {
    backgroundColor: "#060010",
    borderColor: "#392e4e",
    color: "hsl(0, 0%, 100%)",
  } as React.CSSProperties;

  return (
    <ParticleCard
      className="card relative aspect-auto min-h-[200px] w-full p-6 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] card--border-glow"
      style={cardStyle}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm text-white/80">{label}</p>
          <p className="text-3xl font-bold font-mono text-white">{value}</p>
          {trend && (
            <p
              className={`text-sm font-medium ${
                trend.isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
      </div>
    </ParticleCard>
  );
}
