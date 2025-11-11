import { useState } from "react";
import { Card } from "@/components/ui/card";
import DepartmentSelector, { DEPARTMENTS } from "@/components/DepartmentSelector";
import StatCard from "@/components/StatCard";
import { Trophy, TrendingUp, Award, Star } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockPointsData = {
  bca: { total: 2450, events: 12, rank: 1, trend: 15 },
  "bsc-cm": { total: 2280, events: 11, rank: 2, trend: 12 },
  mds: { total: 2150, events: 10, rank: 3, trend: 8 },
  "ms-ai-cs": { total: 2050, events: 10, rank: 4, trend: -3 },
  bems: { total: 1980, events: 9, rank: 5, trend: 5 },
};

const comparisonData = Object.entries(mockPointsData).map(([id, data]) => ({
  name: DEPARTMENTS.find(d => d.id === id)?.name || id,
  points: data.total,
  events: data.events,
}));

const trendData = [
  { week: "Week 1", bca: 450, "bsc-cm": 420, mds: 400, "ms-ai-cs": 380, bems: 360 },
  { week: "Week 2", bca: 920, "bsc-cm": 880, mds: 850, "ms-ai-cs": 820, bems: 780 },
  { week: "Week 3", bca: 1450, "bsc-cm": 1380, mds: 1320, "ms-ai-cs": 1280, bems: 1240 },
  { week: "Week 4", bca: 1950, "bsc-cm": 1850, mds: 1780, "ms-ai-cs": 1720, bems: 1680 },
  { week: "Current", bca: 2450, "bsc-cm": 2280, mds: 2150, "ms-ai-cs": 2050, bems: 1980 },
];

const categoryData = [
  { name: "Technical", value: 35 },
  { name: "Cultural", value: 25 },
  { name: "Sports", value: 20 },
  { name: "Academic", value: 20 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function PointsCalculation() {
  const [selectedDept, setSelectedDept] = useState("bca");
  const deptData = mockPointsData[selectedDept as keyof typeof mockPointsData];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Points Dashboard</h1>
          <p className="text-muted-foreground">Track department performance and rankings</p>
        </div>

        <DepartmentSelector selected={selectedDept} onChange={setSelectedDept} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Trophy} value={deptData.total} label="Total Points" trend={{ value: deptData.trend, isPositive: deptData.trend > 0 }} />
          <StatCard icon={Award} value={`#${deptData.rank}`} label="Current Rank" />
          <StatCard icon={Star} value={deptData.events} label="Events Participated" />
          <StatCard icon={TrendingUp} value={`${deptData.trend > 0 ? '+' : ''}${deptData.trend}%`} label="Growth Rate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Department Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }} 
                />
                <Legend />
                <Bar dataKey="points" fill="hsl(var(--primary))" name="Total Points" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Points by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Points Progression Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="bca" stroke="hsl(var(--chart-1))" strokeWidth={2} name="BCA" />
              <Line type="monotone" dataKey="bsc-cm" stroke="hsl(var(--chart-2))" strokeWidth={2} name="BSc CM" />
              <Line type="monotone" dataKey="mds" stroke="hsl(var(--chart-3))" strokeWidth={2} name="M.DS" />
              <Line type="monotone" dataKey="ms-ai-cs" stroke="hsl(var(--chart-4))" strokeWidth={2} name="MS AI&CS" />
              <Line type="monotone" dataKey="bems" stroke="hsl(var(--chart-5))" strokeWidth={2} name="B.EMS" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">Department</th>
                  <th className="text-left py-3 px-4 font-semibold">Points</th>
                  <th className="text-left py-3 px-4 font-semibold">Events</th>
                  <th className="text-left py-3 px-4 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mockPointsData)
                  .sort(([, a], [, b]) => a.rank - b.rank)
                  .map(([id, data], index) => {
                    const dept = DEPARTMENTS.find(d => d.id === id);
                    return (
                      <tr 
                        key={id} 
                        className={`border-b border-border ${index < 3 ? "bg-primary/5" : ""}`}
                        data-testid={`row-dept-${id}`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold">#{data.rank}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-semibold">{dept?.name}</div>
                            <div className="text-sm text-muted-foreground">{dept?.fullName}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold">{data.total}</span>
                        </td>
                        <td className="py-3 px-4">{data.events}</td>
                        <td className="py-3 px-4">
                          <span className={data.trend > 0 ? "text-green-600 dark:text-green-400" : data.trend < 0 ? "text-red-600 dark:text-red-400" : ""}>
                            {data.trend > 0 ? "↑" : data.trend < 0 ? "↓" : "→"} {Math.abs(data.trend)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
