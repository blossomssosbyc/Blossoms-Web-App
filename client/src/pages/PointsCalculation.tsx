import React, { useState, useEffect } from "react";
import { Trophy, TrendingUp, Award, Star, Users } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Enhanced CSV parser
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values: string[] = [];
    let curr = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(curr);
        curr = "";
      } else {
        curr += char;
      }
    }
    values.push(curr);

    const obj: { [key: string]: string } = {};
    headers.forEach((h, i) => {
      const value = values[i] !== undefined ? values[i] : "";
      obj[h] = value.trim().replace(/^"|"$/g, "");
    });

    return obj;
  });
}

// Extract class from full class name (e.g., "2 BCA A" -> "BCA")
function extractDepartment(classStr: string): string {
  const match = classStr.match(/\b(BCA|EMS|MDS|BSC|ECO|BA|MSC|AI)\b/i);
  return match ? match[0].toUpperCase() : "OTHER";
}

// Points per event (customize as needed)
const EVENT_POINTS: { [key: string]: number } = {
  "Photography": 10,
  "Pot Art": 10,
  "Greeting Card Making": 10,
  "Painting": 10,
  "Pencil Sketching": 10,
  "Reel Making": 15,
  "Collage Making": 15,
  "Mehandi Design": 10,
  "Digital Poster Making": 10,
  "Rangoli Design": 15,
  "Debate": 20,
  "Quiz": 20,
  "Extempore": 20,
  "Pot Pourri": 15,
};

// Categorize events
const EVENT_CATEGORIES: { [key: string]: string } = {
  "Photography": "Creative Arts",
  "Pot Art": "Creative Arts",
  "Greeting Card Making": "Creative Arts",
  "Painting": "Creative Arts",
  "Pencil Sketching": "Creative Arts",
  "Reel Making": "Digital Media",
  "Digital Poster Making": "Digital Media",
  "Collage Making": "Creative Arts",
  "Mehandi Design": "Creative Arts",
  "Rangoli Design": "Creative Arts",
  "Debate": "Literary",
  "Quiz": "Academic",
  "Extempore": "Literary",
  "Pot Pourri": "Cultural",
};

// Aggregate by department
function aggregateByDepartment(rows: Array<{ [key: string]: string }>) {
  const map: { [dept: string]: any } = {};

  rows.forEach(row => {
    const classStr = (row["Class"] || "").trim();
    if (!classStr) return;

    const dept = extractDepartment(classStr);
    if (!map[dept]) {
      map[dept] = { 
        total: 0, 
        events: 0, 
        participants: 0,
        eventDetails: {},
        categoryPoints: {},
        trend: 0, 
        rank: 0 
      };
    }

    const eventsStr = row["Event(s) Registered"] || "";
    const events = eventsStr.split(",").map(e => e.trim()).filter(Boolean);

    events.forEach(event => {
      const points = EVENT_POINTS[event] || 10;
      map[dept].total += points;
      map[dept].events += 1;

      // Track event details
      if (!map[dept].eventDetails[event]) {
        map[dept].eventDetails[event] = 0;
      }
      map[dept].eventDetails[event] += 1;

      // Track category points
      const category = EVENT_CATEGORIES[event] || "Other";
      if (!map[dept].categoryPoints[category]) {
        map[dept].categoryPoints[category] = 0;
      }
      map[dept].categoryPoints[category] += points;
    });

    map[dept].participants += 1;
  });

  // Calculate ranks
  let idx = 1;
  Object.values(map)
    .sort((a: any, b: any) => b.total - a.total)
    .forEach((dept: any) => {
      dept.rank = idx++;
      dept.trend = Math.floor(Math.random() * 21) - 10; // Mock trend
    });

  return map;
}

const DEPARTMENTS = [
  { id: "BCA", name: "BCA", fullName: "Bachelor of Computer Applications" },
  { id: "EMS", name: "EMS", fullName: "Economics, Mathematics & Statistics" },
  { id: "MDS", name: "MDS", fullName: "Master of Data Science" },
  { id: "BSC", name: "BSC", fullName: "Bachelor of Science" },
  { id: "BA", name: "BA", fullName: "Bachelor of Arts" },
  { id: "MSC", name: "MSC", fullName: "Master of Science" },
];

// Neon ocean theme colors matching the CSS
const COLORS = [
  "hsl(179, 98%, 50%)",  // --chart-1: Neon cyan
  "hsl(215, 100%, 55%)", // --chart-2: Deep neon blue
  "hsl(200, 95%, 60%)",  // --chart-3: Sky blue
  "hsl(260, 85%, 60%)",  // --chart-4: Purple
  "hsl(190, 90%, 45%)",  // --chart-5: Teal
  "hsl(320, 90%, 55%)",  // Neon pink/magenta
];

// Card Component with neon theme
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-lg border border-card-border shadow-lg ${className}`}>
      {children}
    </div>
  );
}

// Department Selector Component with neon theme
function DepartmentSelector({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {DEPARTMENTS.map(dept => (
        <button
          key={dept.id}
          onClick={() => onChange(dept.id)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            selected === dept.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 border-2 border-primary"
              : "bg-card text-card-foreground border-2 border-border hover:border-accent hover:bg-accent/10 hover:shadow-accent/30 hover:shadow-md"
          }`}
        >
          {dept.name}
        </button>
      ))}
    </div>
  );
}

// Stat Card Component with neon glow
function StatCard({ icon: Icon, value, label, trend }: any) {
  return (
    <Card className="p-6 hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={`text-sm flex items-center gap-1 font-semibold ${trend.isPositive ? "text-secondary" : "text-destructive"}`}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </p>
          )}
        </div>
        <div className="p-3 bg-accent/20 rounded-lg border border-accent/30">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
    </Card>
  );
}

export default function PointsCalculation() {
  const [deptStats, setDeptStats] = useState<{ [dept: string]: any }>({});
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/points.csv")
      .then(r => {
        if (!r.ok) throw new Error("Failed to load CSV file");
        return r.text();
      })
      .then(text => {
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          throw new Error("No data found in CSV");
        }
        const deptAggregated = aggregateByDepartment(parsed);
        setDeptStats(deptAggregated);
        setSelectedDept(Object.keys(deptAggregated)[0] || "");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading CSV:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-lg shadow-xl border border-destructive/50">
          <p className="text-destructive font-semibold mb-2 text-xl">Error Loading Data</p>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-4">Make sure points.csv is in the public folder</p>
        </div>
      </div>
    );
  }

  if (!selectedDept || !deptStats[selectedDept]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const deptData = deptStats[selectedDept];

  const comparisonData = Object.entries(deptStats).map(([id, data]) => ({
    name: DEPARTMENTS.find(d => d.id === id)?.name || id,
    points: data.total,
    events: data.events,
    participants: data.participants,
  }));

  const categoryData = Object.entries(deptData.categoryPoints).map(([name, value]) => ({
    name,
    value,
  }));

  const topEvents = Object.entries(deptData.eventDetails)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 fade-in-on-load">
        <div className="border-l-4 border-accent pl-6">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Points Dashboard</h1>
          <p className="text-muted-foreground">Track department performance and rankings across events</p>
        </div>

        <DepartmentSelector selected={selectedDept} onChange={setSelectedDept} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Trophy} 
            value={deptData.total} 
            label="Total Points" 
            trend={{ value: deptData.trend, isPositive: deptData.trend > 0 }} 
          />
          <StatCard 
            icon={Award} 
            value={`#${deptData.rank}`} 
            label="Current Rank" 
          />
          <StatCard 
            icon={Star} 
            value={deptData.events} 
            label="Event Registrations" 
          />
          <StatCard 
            icon={Users} 
            value={deptData.participants} 
            label="Participants" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 card-hover-transition">
            <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              Department Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 0 20px hsl(var(--accent) / 0.3)"
                  }}
                />
                <Legend />
                <Bar dataKey="points" fill="hsl(var(--primary))" name="Total Points" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 card-hover-transition">
            <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Points by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 0 20px hsl(var(--accent) / 0.3)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6 card-hover-transition">
          <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-accent rounded-full"></span>
            Top Events - {selectedDept}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topEvents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px hsl(var(--accent) / 0.3)"
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--secondary))" name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 card-hover-transition">
          <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Leaderboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Points</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Events</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Participants</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(deptStats)
                  .sort(([, a], [, b]) => a.rank - b.rank)
                  .map(([id, data], index) => {
                    const dept = DEPARTMENTS.find(d => d.id === id);
                    return (
                      <tr
                        key={id}
                        className={`border-b border-border transition-all duration-200 hover:bg-accent/10 ${
                          index < 3 ? "bg-primary/10" : ""
                        } ${selectedDept === id ? "bg-accent/20 border-l-4 border-l-accent" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-foreground text-lg">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${data.rank}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-semibold text-foreground">{dept?.name || id}</div>
                            <div className="text-sm text-muted-foreground">{dept?.fullName}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-accent text-lg">{data.total}</span>
                        </td>
                        <td className="py-3 px-4 text-foreground">{data.events}</td>
                        <td className="py-3 px-4 text-foreground">{data.participants}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${data.trend > 0 ? "text-secondary" : data.trend < 0 ? "text-destructive" : "text-muted-foreground"}`}>
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