import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Search,
  Crown,
  Medal,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import AIQuery from "@/components/AIQuery";

gsap.registerPlugin(ScrollTrigger);

// ---------- Types ----------

type PointsRow = {
  id: number;
  event: string;
  school_of_sciences: number;
  school_of_psychological_sciences: number;
  school_of_social_sciences: number;
  school_of_business_and_management: number;
  school_of_commerce: number;
  createdAt?: string;
};

type SchoolRanking = {
  name: string;
  shortName: string;
  key: keyof PointsRow;
  totalPoints: number;
  totalEvents: number;
  rank: number;
};

// ---------- Small UI pieces ----------

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-solid border-[rgba(57,46,78,0.6)] bg-black/40 backdrop-blur-md p-6 card--border-glow transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  emphasis = false,
}: {
  icon: any;
  value: React.ReactNode;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <ParticleCard
      className={`relative overflow-hidden rounded-2xl p-5 border ${
        emphasis
          ? "border-purple-400/70 bg-gradient-to-br from-purple-900/50 to-slate-950/80"
          : "border-white/10 bg-black/55"
      } transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35`}
      enableTilt
      enableMagnetism
    >
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-3 ${
            emphasis
              ? "bg-gradient-to-br from-yellow-400/30 to-orange-500/25 border border-yellow-400/40"
              : "bg-gradient-to-br from-purple-500/20 to-pink-500/15 border border-purple-500/30"
          }`}
        >
          <Icon
            className={`w-7 h-7 ${
              emphasis ? "text-yellow-200" : "text-purple-200"
            }`}
          />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">
            {label}
          </p>
          <p
            className={`mt-1 ${
              emphasis
                ? "text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 bg-clip-text text-transparent"
                : "text-2xl font-bold text-white"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </ParticleCard>
  );
}

function SchoolSelector({
  selected,
  onChange,
  schools,
}: {
  selected: string;
  onChange: (school: string) => void;
  schools: string[];
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {schools.map((school) => (
        <button
          key={school}
          onClick={() => onChange(school)}
          className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 ${
            selected === school
              ? "bg-white text-slate-950 shadow-lg shadow-purple-500/40"
              : "bg-white/8 text-white/75 border border-white/10 hover:bg-white/12 hover:text-white"
          }`}
        >
          {school.replace("School of ", "")}
        </button>
      ))}
    </div>
  );
}

// ---------- Analysis Loader ----------

function AnalysisLoader() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        
        <div className="z-10 relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse" />
            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm relative">
                <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" />
                <Trophy className="w-10 h-10 text-purple-300 animate-pulse" />
            </div>
        </div>
    </div>
  );
}

// ---------- Constants ----------

const SCHOOL_NAMES = [
  "School of Sciences",
  "School of Psychological Sciences",
  "School of Social Sciences",
  "School of Business and Management",
  "School of Commerce",
];

const SCHOOL_KEY_MAP: Record<string, keyof PointsRow> = {
  "School of Sciences": "school_of_sciences",
  "School of Psychological Sciences": "school_of_psychological_sciences",
  "School of Social Sciences": "school_of_social_sciences",
  "School of Business and Management": "school_of_business_and_management",
  "School of Commerce": "school_of_commerce",
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

// ---------- Main ----------

export default function PointsCalculation() {
  const [activeTab, setActiveTab] = useState<
    "points" | "school-wise" | "comparison" | "graphs" | "winners" | "ai-query"
  >("points");

  const [points, setPoints] = useState<PointsRow[]>([]);
  const [schoolData, setSchoolData] = useState<any>({});
  const [winners, setWinners] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // search
  const [pointsEventSearch, setPointsEventSearch] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [winnerSearch, setWinnerSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  const [selectedSchool, setSelectedSchool] = useState<string>(
    "School of Psychological Sciences"
  );

  const heroRef = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  // fetch everything including POINTS_TABLE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pointsRows,
          regs,
          sciences,
          social,
          business,
          commerce,
          psych,
          winList,
        ] = await Promise.all([
          fetch("/api/points").then((r) => r.json()),
          fetch("/api/registrations").then((r) => r.json()),
          fetch("/api/school-of-sciences").then((r) => r.json()),
          fetch("/api/school-of-social-sciences").then((r) => r.json()),
          fetch("/api/school-of-business").then((r) => r.json()),
          fetch("/api/school-of-commerce").then((r) => r.json()),
          fetch("/api/school-of-psychology").then((r) => r.json()),
          fetch("/api/winners").then((r) => r.json()),
        ]);
        setPoints(pointsRows);
        setRegistrations(regs);
        setSchoolData({
          "School of Sciences": sciences,
          "School of Social Sciences": social,
          "School of Business and Management": business,
          "School of Commerce": commerce,
          "School of Psychological Sciences": psych,
        });
        setWinners(winList);
        setLoading(false);
      } catch (e) {
        console.error("Error loading data", e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!heroRef?.current) return;
    gsap.fromTo(
      heroRef.current?.querySelectorAll(".hero-element"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.4,
          },
        }
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [activeTab, selectedSchool, loading]);

  if (loading) {
    return <AnalysisLoader />;
  }

  // ---------- Rankings from POINTS_TABLE ----------

  const schoolRankings: SchoolRanking[] = SCHOOL_NAMES.map((name) => {
    const key = SCHOOL_KEY_MAP[name];
    const totalPoints = points.reduce(
      (acc, row) => acc + (Number(row[key]) || 0),
      0
    );
    const totalEvents = points.filter(
      (row) => (Number(row[key]) || 0) > 0
    ).length;
    return {
      name,
      shortName: name.replace("School of ", ""),
      key,
      totalPoints,
      totalEvents,
      rank: 0,
    };
  })
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const topSchool = schoolRankings[0];
  const totalPointsAll = schoolRankings.reduce(
    (acc, s) => acc + s.totalPoints,
    0
  );

  // school-wise from POINTS_TABLE
  const currentSchoolKey = SCHOOL_KEY_MAP[selectedSchool];
  const schoolPointsByEvent = points.map((row) => ({
    event: row.event,
    points: Number(row[currentSchoolKey]) || 0,
  }));

  const filteredSchoolPoints = schoolPointsByEvent
    .filter((e) =>
      e.event.toLowerCase().includes(schoolSearch.toLowerCase())
    )
    .sort((a, b) => b.points - a.points);

  const totalSchoolPoints = schoolPointsByEvent.reduce(
    (acc, r) => acc + r.points,
    0
  );

  // comparison: stacked by school per event (from POINTS_TABLE)
  const comparisonEvents = points
    .filter((row) =>
      row.event.toLowerCase().includes(eventSearch.toLowerCase())
    )
    .map((row) => ({
      event: row.event,
      Sciences: row.school_of_sciences,
      Psychology: row.school_of_psychological_sciences,
      "Social Sciences": row.school_of_social_sciences,
      Business: row.school_of_business_and_management,
      Commerce: row.school_of_commerce,
    }));

  // for AI Query
  const getAllDataForAI = () => {
    const all: any[] = [];
    points.forEach((p) =>
      all.push({
        type: "Points",
        event: p.event,
        sciences: String(p.school_of_sciences),
        psychology: String(p.school_of_psychological_sciences),
        social: String(p.school_of_social_sciences),
        business: String(p.school_of_business_and_management),
        commerce: String(p.school_of_commerce),
      })
    );
    return all;
  };

  // winners filter
  const filteredWinners = winners.filter(
    (row: any) =>
      row.event.toLowerCase().includes(winnerSearch.toLowerCase()) ||
      row.school.toLowerCase().includes(winnerSearch.toLowerCase()) ||
      row.team.toLowerCase().includes(winnerSearch.toLowerCase())
  );

  // ---------- layout with full‑page gradient background ----------

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* full-page gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#2b0640] via-[#050012] to-[#041a3a]" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -left-32 -top-40 w-[500px] h-[500px] rounded-full blur-3xl bg-purple-600/40" />
        <div className="absolute right-[-10%] top-[5%] w-[520px] h-[520px] rounded-full blur-3xl bg-blue-500/40" />
        <div className="absolute left-1/3 bottom-[-25%] w-[520px] h-[520px] rounded-full blur-3xl bg-pink-500/35" />
      </div>

      {/* hero */}
      <section
        ref={heroRef}
        className="relative h-[55vh] flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs md:text-sm font-medium tracking-wide">
              Live Analytics
            </span>
          </div>

          <h1 className="hero-element text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-200 via-violet-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Points Dashboard
          </h1>

          <p className="hero-element text-lg md:text-xl mb-2 text-white/85 max-w-2xl mx-auto">
            Real-time tracking of registrations, scores, and winners across all
            schools.
          </p>
        </div>
      </section>

      {/* main */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12 relative z-10">
        {/* tabs */}
        <section
          data-reveal
          className="sticky top-20 z-40 bg-black/45 backdrop-blur-xl pb-4 border-b border-white/10 rounded-t-2xl"
        >
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 pt-2">
            {[
              { id: "points", label: "🏆 Points", icon: Trophy },
              { id: "school-wise", label: "🏫 School‑Wise", icon: Users },
              { id: "comparison", label: "📊 Comparison", icon: BarChart2 },
              { id: "graphs", label: "📈 Graphs", icon: PieChartIcon },
              { id: "winners", label: "🥇 Winners", icon: Award },
              { id: "ai-query", label: "🤖 AI Query", icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm md:text-base font-semibold transition-all duration-200 whitespace-nowrap rounded-t-xl ${
                  activeTab === tab.id
                    ? "text-white bg-white/10 border-b-2 border-purple-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* POINTS TAB (from POINTS_TABLE) */}
        {activeTab === "points" && (
          <section
            data-reveal
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <MagicBento
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt
              clickEffect
              enableMagnetism
              glowColor="132,0,255"
              spotlightRadius={260}
              particleCount={10}
            >
              <StatCard
                icon={Crown}
                emphasis
                label="Leading school"
                value={topSchool ? topSchool.shortName : "-"}
              />
              <StatCard
                icon={Trophy}
                label="Top score"
                value={topSchool ? topSchool.totalPoints : 0}
              />
              <StatCard
                icon={Activity}
                label="Total events in points table"
                value={new Set(points.map((p) => p.event)).size}
              />
              <StatCard
                icon={TrendingUp}
                label="Total points awarded"
                value={totalPointsAll}
              />
            </MagicBento>

            {/* event-wise points table */}
            <Card className="p-0 overflow-hidden mt-4">
              <div className="p-4 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search events in points table…"
                    value={pointsEventSearch}
                    onChange={(e) => setPointsEventSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm md:text-base text-white placeholder-white/35 w-full"
                  />
                </div>
                <span className="text-xs text-white/50">
                  {points.filter((p) =>
                    p.event
                      .toLowerCase()
                      .includes(pointsEventSearch.toLowerCase())
                  ).length}{" "}
                  of {points.length} events
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3 font-bold">Event</th>
                      <th className="px-6 py-3 text-center">Sciences</th>
                      <th className="px-6 py-3 text-center">Psychology</th>
                      <th className="px-6 py-3 text-center">Social Sci.</th>
                      <th className="px-6 py-3 text-center">Business</th>
                      <th className="px-6 py-3 text-center">Commerce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {points
                      .filter((p) =>
                        p.event
                          .toLowerCase()
                          .includes(pointsEventSearch.toLowerCase())
                      )
                      .map((row, idx) => {
                        const values = [
                          row.school_of_sciences,
                          row.school_of_psychological_sciences,
                          row.school_of_social_sciences,
                          row.school_of_business_and_management,
                          row.school_of_commerce,
                        ];
                        const maxVal = Math.max(...values);
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-white/6 transition-colors"
                          >
                            <td className="px-6 py-3 font-medium text-white">
                              {row.event}
                            </td>
                            {values.map((val, i) => (
                              <td
                                key={i}
                                className={`px-6 py-3 text-center font-semibold ${
                                  val === maxVal && val > 0
                                    ? "text-yellow-300 bg-yellow-500/10"
                                    : "text-white/75"
                                }`}
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot className="bg-purple-500/10">
                    <tr className="font-bold text-white">
                      <td className="px-6 py-3">TOTAL</td>
                      {schoolRankings.map((s, idx) => (
                        <td
                          key={idx}
                          className="px-6 py-3 text-center text-purple-200"
                        >
                          {s.totalPoints}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* SCHOOL‑WISE TAB (derived from POINTS_TABLE) */}
        {activeTab === "school-wise" && (
          <section
            data-reveal
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  School‑wise points
                </h2>
                <p className="text-sm text-white/70">
                  Choose a school to see how its points are distributed across
                  events in the points table.
                </p>
              </div>
              <SchoolSelector
                selected={selectedSchool}
                onChange={setSelectedSchool}
                schools={SCHOOL_NAMES}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={Medal}
                label="Rank of selected"
                value={
                  (() => {
                    const r = schoolRankings.find(
                      (s) => s.name === selectedSchool
                    );
                    return r ? `#${r.rank}` : "-";
                  })()
                }
              />
              <StatCard
                icon={Trophy}
                label="Total points"
                value={totalSchoolPoints}
              />
              <StatCard
                icon={Activity}
                label="Events with points"
                value={schoolPointsByEvent.filter((e) => e.points > 0).length}
              />
              <StatCard
                icon={TrendingUp}
                label="Share of total"
                value={
                  totalPointsAll > 0
                    ? `${(
                        (totalSchoolPoints / totalPointsAll) *
                        100
                      ).toFixed(1)}%`
                    : "0.0%"
                }
              />
            </div>

            <Card className="p-0 overflow-hidden mt-6">
              <div className="p-4 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder={`Search events for ${selectedSchool.replace(
                      "School of ",
                      ""
                    )}…`}
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm md:text-base text-white placeholder-white/35 w-full"
                  />
                </div>
                <span className="text-xs text-white/50">
                  {filteredSchoolPoints.length} of{" "}
                  {schoolPointsByEvent.length} events
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3 font-bold">Event</th>
                      <th className="px-6 py-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSchoolPoints.length ? (
                      filteredSchoolPoints.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-white/6 transition-colors"
                        >
                          <td className="px-6 py-3 font-medium text-white">
                            {row.event}
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-purple-200">
                            {row.points}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-6 py-8 text-center text-white/50"
                        >
                          No events found matching “{schoolSearch}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* COMPARISON TAB – stacked chart based on POINTS_TABLE */}
        {activeTab === "comparison" && (
          <section
            data-reveal
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">
                  Total points by school
                </h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolRankings}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <XAxis
                        dataKey="shortName"
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050509",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="totalPoints" radius={[6, 6, 0, 0]}>
                        {schoolRankings.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">
                  Events with points
                </h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={schoolRankings}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <XAxis
                        dataKey="shortName"
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050509",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalEvents"
                        stroke="#82ca9d"
                        strokeWidth={2.2}
                        dot={{ r: 4 }}
                        name="Events with points"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-white">
                  Points per event (all schools)
                </h3>
                <div className="flex items-center gap-3 max-w-md w-full">
                  <Search className="w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder="Filter events by name…"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="bg-transparent border-b border-white/20 pb-1 text-sm text-white placeholder-white/40 flex-1 outline-none"
                  />
                </div>
              </div>
              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonEvents}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="event"
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#050509",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="Sciences" stackId="pts" fill={COLORS[0]} />
                    <Bar dataKey="Psychology" stackId="pts" fill={COLORS[1]} />
                    <Bar
                      dataKey="Social Sciences"
                      stackId="pts"
                      fill={COLORS[2]}
                    />
                    <Bar dataKey="Business" stackId="pts" fill={COLORS[3]} />
                    <Bar dataKey="Commerce" stackId="pts" fill={COLORS[4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}

        {/* GRAPHS */}
        {activeTab === "graphs" && (
          <section
            data-reveal
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">
                  Score distribution
                </h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={schoolRankings}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ shortName, percent }) =>
                          `${shortName} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        dataKey="totalPoints"
                      >
                        {schoolRankings.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050509",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">
                  Performance radar
                </h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={schoolRankings}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.12)" />
                      <PolarAngleAxis
                        dataKey="shortName"
                        tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, "auto"]}
                        tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
                      />
                      <Radar
                        name="Total points"
                        dataKey="totalPoints"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Events"
                        dataKey="totalEvents"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.5}
                      />
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#050509",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* WINNERS */}
        {activeTab === "winners" && (
          <section
            data-reveal
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search winners by event, school, or team..."
                  value={winnerSearch}
                  onChange={(e) => setWinnerSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-white/30 w-full"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-3 font-bold">Event</th>
                      <th className="px-6 py-3">Position</th>
                      <th className="px-6 py-3">School</th>
                      <th className="px-6 py-3">Class</th>
                      <th className="px-6 py-3 text-right">Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredWinners.length ? (
                      filteredWinners.map((row: any, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-white/6 transition-colors"
                        >
                          <td className="px-6 py-3 font-medium text-white">
                            {row.event}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                row.position === "1st"
                                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/35"
                                  : row.position === "2nd"
                                  ? "bg-gray-400/20 text-gray-200 border border-gray-400/35"
                                  : "bg-orange-700/20 text-orange-300 border border-orange-700/35"
                              }`}
                            >
                              {row.position}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-white/80">
                            {row.school}
                          </td>
                          <td className="px-6 py-3 text-white/75">
                            {row.class}
                          </td>
                          <td className="px-6 py-3 text-right font-mono text-cyan-300">
                            {row.team}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-white/50"
                        >
                          No winners found matching “{winnerSearch}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* AI QUERY */}
        {activeTab === "ai-query" && (
          <section
            data-reveal
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <AIQuery
              data={getAllDataForAI().map((item) =>
                Object.fromEntries(
                  Object.entries(item).map(([k, v]) => [k, String(v)])
                )
              )}
            />
          </section>
        )}
      </div>

      <div className="h-20" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #7c3aed, #ec4899);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #8b5cf6, #f472b6);
        }
        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: radial-gradient(circle at top, rgba(168,85,247,0.4), transparent 55%);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          filter: blur(12px);
        }
        .card--border-glow:hover::before { opacity: 1; }
      `}</style>
    </div>
  );
}
