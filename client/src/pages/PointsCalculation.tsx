import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Trophy,
  TrendingUp,
  Award,
  Star,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import AIQuery from "@/components/AIQuery";

gsap.registerPlugin(ScrollTrigger);

// Enhanced CSV parser
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values: string[] = [];
      let curr = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
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

// Interface for parsed CSV data
interface ParticipantData {
  [key: string]: string;
}

// Get unique values for filters
function getUniqueValues(data: ParticipantData[], key: string): string[] {
  return Array.from(
    new Set(data.map((row) => row[key]).filter((v) => v && v.trim()))
  ).sort();
}

// Calculate overall school statistics
function calculateOverallStats(data: ParticipantData[]) {
  const totalParticipants = data.length;
  const uniqueEmails = new Set(
    data.map((r) => r["Christ Email"]).filter(Boolean)
  );
  const uniquePhones = new Set(data.map((r) => r["Phone No."]).filter(Boolean));

  let totalRegistrations = 0;
  let totalPoints = 0;
  const eventCounts: { [key: string]: number } = {};
  const departmentCounts: { [key: string]: number } = {};

  data.forEach((row) => {
    const events = (row["Event(s) Registered"] || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    events.forEach((event) => {
      totalRegistrations += 1;
      totalPoints += EVENT_POINTS[event] || 10;
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });

    const dept = extractDepartment(row["Class"] || "");
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  return {
    totalParticipants,
    totalRegistrations,
    totalPoints,
    uniqueParticipants: uniqueEmails.size,
    eventCounts,
    departmentCounts,
    avgPointsPerParticipant: (totalPoints / totalParticipants).toFixed(1),
    avgEventsPerParticipant: (totalRegistrations / totalParticipants).toFixed(
      1
    ),
  };
}

// Extract class from full class name (e.g., "2 BCA A" -> "BCA")
function extractDepartment(classStr: string): string {
  const match = classStr.match(/\b(BCA|EMS|MDS|BSC|ECO|BA|MSC|AI)\b/i);
  return match ? match[0].toUpperCase() : "OTHER";
}

// Points per event (customize as needed)
const EVENT_POINTS: { [key: string]: number } = {
  Photography: 10,
  "Pot Art": 10,
  "Greeting Card Making": 10,
  Painting: 10,
  "Pencil Sketching": 10,
  "Reel Making": 15,
  "Collage Making": 15,
  "Mehandi Design": 10,
  "Digital Poster Making": 10,
  "Rangoli Design": 15,
  Debate: 20,
  Quiz: 20,
  Extempore: 20,
  "Pot Pourri": 15,
};

// Categorize events
const EVENT_CATEGORIES: { [key: string]: string } = {
  Photography: "Creative Arts",
  "Pot Art": "Creative Arts",
  "Greeting Card Making": "Creative Arts",
  Painting: "Creative Arts",
  "Pencil Sketching": "Creative Arts",
  "Reel Making": "Digital Media",
  "Digital Poster Making": "Digital Media",
  "Collage Making": "Creative Arts",
  "Mehandi Design": "Creative Arts",
  "Rangoli Design": "Creative Arts",
  Debate: "Literary",
  Quiz: "Academic",
  Extempore: "Literary",
  "Pot Pourri": "Cultural",
};

// Aggregate by department
function aggregateByDepartment(rows: Array<{ [key: string]: string }>) {
  const map: { [dept: string]: any } = {};

  rows.forEach((row) => {
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
        rank: 0,
      };
    }

    const eventsStr = row["Event(s) Registered"] || "";
    const events = eventsStr
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    events.forEach((event) => {
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
  "hsl(179, 98%, 50%)", // --chart-1: Neon cyan
  "hsl(215, 100%, 55%)", // --chart-2: Deep neon blue
  "hsl(200, 95%, 60%)", // --chart-3: Sky blue
  "hsl(260, 85%, 60%)", // --chart-4: Purple
  "hsl(190, 90%, 45%)", // --chart-5: Teal
  "hsl(320, 90%, 55%)", // Neon pink/magenta
];

// Card Component with neon theme
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-solid border-[rgba(57,46,78,0.6)] bg-gradient-to-br from-[#0b0713] to-[#000000] p-6 card--border-glow transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 ${className}`}
    >
      {/* Border glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(132, 0, 255, 0.15), transparent 80%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Department Selector Component with neon theme
function DepartmentSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {DEPARTMENTS.map((dept) => (
        <button
          key={dept.id}
          onClick={() => onChange(dept.id)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            selected === dept.id
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 border-2 border-purple-400 scale-105"
              : "bg-transparent border-2 border-white/20 text-white/70 hover:border-purple-500/50 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/20"
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
    <ParticleCard
      className="relative overflow-hidden rounded-2xl p-6 border border-solid border-[rgba(57,46,78,0.6)] bg-gradient-to-br from-[#0b0713] to-[#000000] card--border-glow transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
      enableTilt={true}
      clickEffect={false}
      enableMagnetism={true}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-sm text-white/60 font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-4xl font-black text-white">{value}</p>
          {trend && (
            <p
              className={`text-sm flex items-center gap-1 font-semibold ${
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </p>
          )}
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
          <Icon className="w-7 h-7 text-purple-400" />
        </div>
      </div>
    </ParticleCard>
  );
}

export default function PointsCalculation() {
  const [rawData, setRawData] = useState<ParticipantData[]>([]);
  const [deptStats, setDeptStats] = useState<{ [dept: string]: any }>({});
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const heroRef = useRef<HTMLDivElement>(null);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<ParticipantData[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"class" | "school" | "ai">(
    "school"
  );

  useEffect(() => {
    fetch("/points.csv")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load CSV file");
        return r.text();
      })
      .then((text) => {
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          throw new Error("No data found in CSV");
        }

        setRawData(parsed);

        // Calculate overall stats
        const overall = calculateOverallStats(parsed);
        setOverallStats(overall);

        // Get unique classes and events for filters
        const classesSet = getUniqueValues(parsed, "Class");
        const eventsSet = Object.keys(EVENT_POINTS).sort();
        setClasses(classesSet);
        setEvents(eventsSet);

        // Aggregate by department
        const deptAggregated = aggregateByDepartment(parsed);
        setDeptStats(deptAggregated);
        setSelectedDept(Object.keys(deptAggregated)[0] || "");

        setFilteredData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...rawData];

    if (selectedClass !== "All") {
      filtered = filtered.filter((row) => {
        const classStr = (row["Class"] || "").trim();
        return classStr === selectedClass;
      });
    }

    if (selectedEvent !== "All") {
      filtered = filtered.filter((row) => {
        const events = (row["Event(s) Registered"] || "")
          .split(",")
          .map((e) => e.trim());
        return events.includes(selectedEvent);
      });
    }

    setFilteredData(filtered);
  }, [selectedClass, selectedEvent, rawData]);

  // Enable smooth, damped scrolling for premium feel
  useSmoothScroll();

  // Hero animation
  useEffect(() => {
    if (!heroRef?.current) return;

    gsap.fromTo(
      heroRef.current?.querySelectorAll(".hero-element"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, [heroRef]);

  // Scroll reveal animations for all sections
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading comprehensive dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gradient-to-br from-[#0b0713] to-[#000000] rounded-2xl shadow-xl border border-red-500/30">
          <p className="text-red-400 font-semibold mb-2 text-xl">
            Error Loading Data
          </p>
          <p className="text-white/60">{error}</p>
          <p className="text-sm text-white/40 mt-4">
            Make sure points.csv is in the public folder
          </p>
        </div>
      </div>
    );
  }

  if (!selectedDept || !deptStats[selectedDept] || !overallStats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">No data available</p>
      </div>
    );
  }

  const deptData = deptStats[selectedDept];

  const comparisonData = Object.entries(deptStats).map(([id, data]) => ({
    name: DEPARTMENTS.find((d) => d.id === id)?.name || id,
    points: data.total,
    events: data.events,
    participants: data.participants,
  }));

  const categoryData = Object.entries(deptData.categoryPoints).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const topEvents = Object.entries(deptData.eventDetails)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Overall school event statistics
  const overallEventStats = Object.entries(overallStats.eventCounts)
    .map(([name, count]: [string, any]) => ({
      name,
      participants: count as number,
      points: ((EVENT_POINTS[name] || 10) * (count as number)) as number,
    }))
    .sort((a, b) => (b.participants as number) - (a.participants as number))
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />

        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Comprehensive Analytics</span>
          </div>

          <h1 className="hero-element text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Points Dashboard
          </h1>

          <p className="hero-element text-xl md:text-2xl mb-8 text-white/80">
            School-wide performance analytics & department rankings
          </p>

          <div className="hero-element flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-purple-400 font-bold">
                {overallStats.totalParticipants}
              </span>{" "}
              Participants
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-pink-400 font-bold">
                {overallStats.totalRegistrations}
              </span>{" "}
              Registrations
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-blue-400 font-bold">
                {overallStats.totalPoints}
              </span>{" "}
              Total Points
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-24">
        {/* Tab Navigation */}
        <section
          data-reveal
          className="sticky top-20 z-40 bg-gradient-to-b from-black via-black to-transparent pb-6"
        >
          <div className="flex gap-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab("school")}
              className={`px-6 py-4 font-semibold text-lg transition-all duration-300 relative ${
                activeTab === "school"
                  ? "text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              <span className="relative z-10">🏫 School-Wide Analytics</span>
              {activeTab === "school" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("class")}
              className={`px-6 py-4 font-semibold text-lg transition-all duration-300 relative ${
                activeTab === "class"
                  ? "text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              <span className="relative z-10">🎓 Individual Classes</span>
              {activeTab === "class" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-4 font-semibold text-lg transition-all duration-300 relative ${
                activeTab === "ai"
                  ? "text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              <span className="relative z-10">🤖 AI Query</span>
              {activeTab === "ai" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
              )}
            </button>
          </div>
        </section>

        {/* SCHOOL TAB */}
        {activeTab === "school" && (
          <>
            {/* Overall School Statistics */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <span className="w-1 h-10 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full" />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    School-Wide Performance
                  </span>
                </h2>
                <p className="text-white/60 mt-2">
                  Overall statistics across all departments
                </p>
              </div>
              <MagicBento
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
                glowColor="251, 146, 60"
                spotlightRadius={300}
                particleCount={12}
              >
                <StatCard
                  icon={Users}
                  value={overallStats.totalParticipants}
                  label="Total Participants"
                  trend={undefined}
                />
                <StatCard
                  icon={Trophy}
                  value={overallStats.totalRegistrations}
                  label="Total Registrations"
                  trend={undefined}
                />
                <StatCard
                  icon={Star}
                  value={overallStats.totalPoints}
                  label="School Points"
                  trend={undefined}
                />
                <StatCard
                  icon={TrendingUp}
                  value={overallStats.avgPointsPerParticipant}
                  label="Avg Points/Participant"
                  trend={undefined}
                />
                <StatCard
                  icon={Award}
                  value={overallStats.avgEventsPerParticipant}
                  label="Avg Events/Participant"
                  trend={undefined}
                />
                <StatCard
                  icon={Sparkles}
                  value={Object.keys(overallStats.departmentCounts).length}
                  label="Departments"
                  trend={undefined}
                />
              </MagicBento>
            </section>

            {/* Overall Event Statistics */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <span className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full" />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Event Participation Analysis
                  </span>
                </h2>
              </div>
              <Card className="p-8">
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={overallEventStats} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={180}
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(11,7,19,0.95)",
                        border: "1px solid rgba(132,0,255,0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 0 20px rgba(132, 0, 255, 0.2)",
                      }}
                      cursor={{ fill: "rgba(132, 0, 255, 0.1)" }}
                    />
                    <Bar
                      dataKey="participants"
                      fill="url(#gradientBarOverall)"
                      name="Participants"
                      radius={[0, 8, 8, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="gradientBarOverall"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </section>
          </>
        )}

        {/* CLASS TAB */}
        {activeTab === "class" && (
          <>
            {/* Filter Section */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Apply Filters
                </h2>
                <p className="text-white/60 mb-6">
                  Filter data by class or event to view specific statistics
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                    Filter by Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/50 transition-all duration-300 hover:border-purple-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="All" className="bg-black text-white">
                      All Classes
                    </option>
                    {classes.map((cls) => (
                      <option
                        key={cls}
                        value={cls}
                        className="bg-black text-white"
                      >
                        {cls}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/40 mt-2">
                    Showing {filteredData.length} participant
                    {filteredData.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                    Filter by Event
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-purple-500/50 text-white placeholder-white/50 transition-all duration-300 hover:border-purple-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="All" className="bg-black text-white">
                      All Events
                    </option>
                    {events.map((evt) => (
                      <option
                        key={evt}
                        value={evt}
                        className="bg-black text-white"
                      >
                        {evt}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/40 mt-2">
                    Showing {filteredData.length} participant
                    {filteredData.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </section>

            {/* Filtered Results Section */}
            {(selectedClass !== "All" || selectedEvent !== "All") && (
              <section data-reveal>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                    <span className="w-1 h-10 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
                    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Filtered Results
                    </span>
                  </h2>
                  <p className="text-white/60 mt-2">
                    Showing{" "}
                    <span className="text-pink-400 font-bold">
                      {filteredData.length}
                    </span>{" "}
                    participant{filteredData.length !== 1 ? "s" : ""}
                    {selectedClass !== "All" && (
                      <span>
                        {" "}
                        from{" "}
                        <span className="text-purple-400 font-bold">
                          {selectedClass}
                        </span>
                      </span>
                    )}
                    {selectedEvent !== "All" && (
                      <span>
                        {" "}
                        registered for{" "}
                        <span className="text-purple-400 font-bold">
                          {selectedEvent}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                <Card className="p-8">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredData.map((row, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-white/50 uppercase tracking-wide">
                              Name
                            </p>
                            <p className="text-white font-semibold">
                              {row["Name"]}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 uppercase tracking-wide">
                              Class
                            </p>
                            <p className="text-white font-semibold">
                              {row["Class"]}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 uppercase tracking-wide">
                              Events
                            </p>
                            <p className="text-white font-semibold">
                              {row["Event(s) Registered"]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            )}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Select Department
                </h2>
                <p className="text-white/60 mb-6">
                  Choose a department to view detailed statistics
                </p>
              </div>
              <DepartmentSelector
                selected={selectedDept}
                onChange={setSelectedDept}
              />
            </section>

            {/* Department Stats with MagicBento */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <span className="w-1 h-10 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedDept} Department Metrics
                  </span>
                </h2>
              </div>
              <MagicBento
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
                glowColor="132, 0, 255"
                spotlightRadius={300}
                particleCount={12}
              >
                <StatCard
                  icon={Trophy}
                  value={deptData.total}
                  label="Department Points"
                  trend={{
                    value: deptData.trend,
                    isPositive: deptData.trend > 0,
                  }}
                />
                <StatCard
                  icon={Award}
                  value={`#${deptData.rank}`}
                  label="Ranking"
                />
                <StatCard
                  icon={Star}
                  value={deptData.events}
                  label="Registrations"
                />
                <StatCard
                  icon={Users}
                  value={deptData.participants}
                  label="Participants"
                />
              </MagicBento>
            </section>

            {/* Department Charts */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <span className="w-1 h-10 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Department Analytics
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                  <h3 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                    Department Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(11,7,19,0.95)",
                          border: "1px solid rgba(132,0,255,0.3)",
                          borderRadius: "12px",
                          boxShadow: "0 0 20px rgba(132, 0, 255, 0.2)",
                        }}
                        cursor={{ fill: "rgba(132, 0, 255, 0.1)" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="points"
                        fill="url(#gradientBar)"
                        name="Points"
                        radius={[8, 8, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="gradientBar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></span>
                    Points by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        dataKey="value"
                        stroke="rgba(0,0,0,0.8)"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(11,7,19,0.95)",
                          border: "1px solid rgba(132,0,255,0.3)",
                          borderRadius: "12px",
                          boxShadow: "0 0 20px rgba(132, 0, 255, 0.2)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </section>

            {/* Top Events for Department */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <span className="w-1 h-10 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
                  <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                    Top Events - {selectedDept}
                  </span>
                </h2>
              </div>
              <Card className="p-8">
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={topEvents} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={180}
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(11,7,19,0.95)",
                        border: "1px solid rgba(132,0,255,0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 0 20px rgba(132, 0, 255, 0.2)",
                      }}
                      cursor={{ fill: "rgba(132, 0, 255, 0.1)" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="url(#gradientBar2)"
                      name="Registrations"
                      radius={[0, 8, 8, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="gradientBar2"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </section>

            {/* Department Leaderboard */}
            <section data-reveal>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    Department Leaderboard
                  </span>
                </h2>
              </div>
              <Card className="p-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Rank
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Department
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Points
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Events
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Participants
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-white/80 text-sm uppercase tracking-wide">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(deptStats)
                      .sort(([, a], [, b]) => a.rank - b.rank)
                      .map(([id, data], index) => {
                        const dept = DEPARTMENTS.find((d) => d.id === id);
                        return (
                          <tr
                            key={id}
                            className={`border-b border-white/5 transition-all duration-200 hover:bg-white/5 ${
                              selectedDept === id
                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-l-purple-500"
                                : ""
                            }`}
                          >
                            <td className="py-4 px-4">
                              <span className="font-mono font-bold text-lg">
                                {index === 0
                                  ? "🥇"
                                  : index === 1
                                  ? "🥈"
                                  : index === 2
                                  ? "🥉"
                                  : `#${data.rank}`}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-semibold text-white">
                                  {dept?.name || id}
                                </div>
                                <div className="text-xs text-white/50">
                                  {dept?.fullName}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-mono font-bold text-lg text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                {data.total}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right text-white/70">
                              {data.events}
                            </td>
                            <td className="py-4 px-4 text-right text-white/70">
                              {data.participants}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span
                                className={`font-semibold ${
                                  data.trend > 0
                                    ? "text-emerald-400"
                                    : data.trend < 0
                                    ? "text-red-400"
                                    : "text-white/50"
                                }`}
                              >
                                {data.trend > 0
                                  ? "↑"
                                  : data.trend < 0
                                  ? "↓"
                                  : "→"}{" "}
                                {Math.abs(data.trend)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Card>
            </section>
          </>
        )}

        {/* AI QUERY TAB */}
        {activeTab === "ai" && <AIQuery data={rawData} />}
      </div>

      {/* Footer Glow */}
      <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}
