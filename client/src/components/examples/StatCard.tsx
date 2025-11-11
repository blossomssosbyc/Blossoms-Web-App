import StatCard from "../StatCard";
import { Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-8 bg-background">
      <StatCard
        icon={Users}
        value="2,500+"
        label="Total Participants"
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
