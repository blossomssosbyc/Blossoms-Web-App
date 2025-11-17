import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import DepartmentSelector, { DEPARTMENTS } from "@/components/DepartmentSelector";
import StatCard from "@/components/StatCard";
import { Trophy, TrendingUp, Award, Star } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Enhanced dependency-free CSV parser for your header fields
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const values = [];
    let curr = "", inQuotes = false;
    for (let i = 0; i < line.length; ++i) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { values.push(curr); curr = ""; }
      else { curr += char; }
    }
    values.push(curr);
    return Object.fromEntries(
      headers.map((h, i) => [h, (values[i] || "").trim().replace(/^"|"$/g, "")])
    );
  });
}

// Aggregates by Class field and counts events and total (each person = 100 for demo; adjust as needed)
function aggregateByClass(rows: Array<{ [key: string]: string }>) {
  const map: { [cls: string]: any } = {};
  rows.forEach(row => {
    const cls = (row["Class"] || "").trim().toUpperCase();
    if (!cls) return;
    if (!map[cls]) map[cls] = { total: 0, events: 0, trend: 0, rank: 0, raw: [] };
    // Use your exact header: "Event(s) Registered" to count number of events for each student
    const events = (row["Event(s) Registered"] || "").split(",").map(e => e.trim()).filter(Boolean);
    map[cls].events += events.length;
    map[cls].total += 100; // placeholder: each student gives 100 pts (change as preferred)
    map[cls].raw.push(row);
  });
  let idx = 1;
  Object.values(map)
    .sort((a: any, b: any) => b.total - a.total)
    .forEach((cls: any) => {
      cls.rank = idx++;
      cls.trend = Math.floor(Math.random() * 21) - 10; // Demo trend (-10 to +10)
    });
  return map;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function PointsCalculation() {
  const [deptStats, setDeptStats] = useState<{ [cls: string]: any }>({});
  const [selectedDept, setSelectedDept] = useState<string>("");

  useEffect(() => {
    fetch("/points.csv")
      .then(r => r.text())
      .then(text => {
        const parsed = parseCSV(text);
        const clsAggregated = aggregateByClass(parsed);
        setDeptStats(clsAggregated);
        setSelectedDept(Object.keys(clsAggregated)[0] || "");
      });
  }, []);

  if (!selectedDept || !deptStats[selectedDept]) return <div>Loading data...</div>;

  const mockPointsData = deptStats;

  const comparisonData = Object.entries(mockPointsData).map(([id, data]) => ({
    name: DEPARTMENTS.find(d => d.id === id)?.name || id,
    points: data.total,
    events: data.events,
  }));

  const trendData = [
    { week: "Current", ...Object.fromEntries(Object.entries(mockPointsData).map(([k, v]) => [k, v.total])) }
  ];

  const categoryData = [
    { name: "Technical", value: 35 },
    { name: "Cultural", value: 25 },
    { name: "Sports", value: 20 },
    { name: "Academic", value: 20 },
  ];

  const deptData = mockPointsData[selectedDept];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 fade-in-on-load">
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
              {Object.keys(mockPointsData).map((dept, i) => (
                <Line
                  key={dept}
                  type="monotone"
                  dataKey={dept}
                  stroke={`hsl(var(--chart-${i + 1}))`}
                  strokeWidth={2}
                  name={DEPARTMENTS.find(d => d.id === dept)?.name || dept}
                />
              ))}
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
                  <th className="text-left py-3 px-4 font-semibold">Class</th>
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
                            <div className="font-semibold">{dept?.name || id}</div>
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
