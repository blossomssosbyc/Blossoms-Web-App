import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  TrendingUp,
  Award,
  Star,
  Users,
  Sparkles,
  BarChart2,
  PieChart as PieChartIcon,
  Activity
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
  Cell
} from "recharts";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import {
  REGISTRATIONS_DATA,
  SCHOOL_STATS,
  WINNERS_DATA,
  SCHOOLS,
} from "@/data/pointsData";

gsap.registerPlugin(ScrollTrigger);

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

function SchoolSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (school: string) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {SCHOOLS.map((school) => (
        <button
          key={school}
          onClick={() => onChange(school)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            selected === school
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 border-2 border-purple-400 scale-105"
              : "bg-transparent border-2 border-white/20 text-white/70 hover:border-purple-500/50 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/20"
          }`}
        >
          {school}
        </button>
      ))}
    </div>
  );
}

export default function PointsCalculation() {
  const [activeTab, setActiveTab] = useState<"registrations" | "schools" | "winners">("registrations");
  const [selectedSchool, setSelectedSchool] = useState<string>(SCHOOLS[0]);
  const heroRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();

  useEffect(() => {
    if (!heroRef?.current) return;

    gsap.fromTo(
      heroRef.current?.querySelectorAll(".hero-element"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, [heroRef]);

  // Scroll reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50, scale: 0.95 },
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
  }, [activeTab, selectedSchool]);

  // Calculate total stats for Hero
  const totalRegistrations = REGISTRATIONS_DATA.reduce((acc, curr) => acc + curr.total, 0);
  const totalEvents = REGISTRATIONS_DATA.length;
  const totalSchools = SCHOOLS.length;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Live Analytics</span>
          </div>

          <h1 className="hero-element text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Points Dashboard
          </h1>

          <p className="hero-element text-xl md:text-2xl mb-8 text-white/80">
            Real-time tracking of registrations, scores, and winners.
          </p>

          <div className="hero-element flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-purple-400 font-bold">{totalRegistrations}</span> Registrations
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-pink-400 font-bold">{totalEvents}</span> Events
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70">
              <span className="text-blue-400 font-bold">{totalSchools}</span> Schools
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-24">
        {/* Tab Navigation */}
        <section data-reveal className="sticky top-20 z-40 bg-gradient-to-b from-black via-black to-transparent pb-6">
          <div className="flex gap-4 border-b border-white/10 overflow-x-auto">
            {[
              { id: "registrations", label: "📊 Registrations", color: "from-yellow-400 to-orange-400" },
              { id: "schools", label: "🏫 School Performance", color: "from-purple-400 to-pink-400" },
              { id: "winners", label: "🏆 Winners List", color: "from-blue-400 to-cyan-400" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold text-lg transition-all duration-300 relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white/70"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} rounded-full`} />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* REGISTRATIONS TAB */}
        {activeTab === "registrations" && (
          <section data-reveal className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <span className="w-1 h-10 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full" />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Event Registrations
                </span>
              </h2>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Event Name</th>
                      <th className="px-6 py-4 text-right">Sciences</th>
                      <th className="px-6 py-4 text-right">Psychology</th>
                      <th className="px-6 py-4 text-right">Social Sci</th>
                      <th className="px-6 py-4 text-right">Business</th>
                      <th className="px-6 py-4 text-right">Commerce</th>
                      <th className="px-6 py-4 text-right font-bold text-white">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {REGISTRATIONS_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{row.eventName}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.sciences}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.psychology}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.socialSciences}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.business}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.commerce}</td>
                        <td className="px-6 py-4 text-right font-bold text-yellow-400">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* SCHOOLS TAB */}
        {activeTab === "schools" && (
          <section data-reveal className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-6">
                <span className="w-1 h-10 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  School Performance
                </span>
              </h2>
              <SchoolSelector selected={selectedSchool} onChange={setSelectedSchool} />
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
                value={SCHOOL_STATS[selectedSchool].reduce((acc, curr) => acc + curr.score, 0)}
                label="Total Score"
              />
              <StatCard
                icon={Users}
                value={SCHOOL_STATS[selectedSchool].reduce((acc, curr) => acc + curr.totalReg, 0)}
                label="Total Registrations"
              />
              <StatCard
                icon={TrendingUp}
                value={SCHOOL_STATS[selectedSchool].reduce((acc, curr) => acc + curr.turnUp, 0)}
                label="Total Turn Up"
              />
               <StatCard
                icon={Activity}
                value={SCHOOL_STATS[selectedSchool].length}
                label="Events Participated"
              />
            </MagicBento>

            <Card className="p-0 overflow-hidden mt-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Event</th>
                      <th className="px-6 py-4 text-right">Total Reg</th>
                      <th className="px-6 py-4 text-right">Turn Up</th>
                      <th className="px-6 py-4 text-right">Turn Down</th>
                      <th className="px-6 py-4 text-right font-bold text-white">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {SCHOOL_STATS[selectedSchool].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{row.event}</td>
                        <td className="px-6 py-4 text-right text-white/70">{row.totalReg}</td>
                        <td className="px-6 py-4 text-right text-emerald-400">{row.turnUp}</td>
                        <td className="px-6 py-4 text-right text-red-400">{row.turnDown}</td>
                        <td className="px-6 py-4 text-right font-bold text-purple-400">{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* WINNERS TAB */}
        {activeTab === "winners" && (
          <section data-reveal className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <span className="w-1 h-10 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Winners List
                </span>
              </h2>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Event</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">School</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4 text-right">Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {WINNERS_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{row.event}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            row.position === "1st" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                            row.position === "2nd" ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                            "bg-orange-700/20 text-orange-400 border border-orange-700/30"
                          }`}>
                            {row.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/70">{row.school}</td>
                        <td className="px-6 py-4 text-white/70">{row.class}</td>
                        <td className="px-6 py-4 text-right font-mono text-cyan-400">{row.team}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* Footer Glow */}
      <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}
