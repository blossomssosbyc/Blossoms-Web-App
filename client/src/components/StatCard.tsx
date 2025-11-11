import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ icon: Icon, value, label, trend }: StatCardProps) {
  return (
    <Card className="p-6 hover-elevate transition-all" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold font-mono">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
