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
  Activity,
  Search,
  ArrowRight,
  Filter,
  LineChart as LineChartIcon
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import AIQuery from "@/components/AIQuery";

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
  schools
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

const SCHOOL_NAMES = [
  "School of Sciences",
  "School of Social Sciences",
  "School of Business",
  "School of Commerce",
  "School of Psychology"
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export default function PointsCalculation() {
  const [activeTab, setActiveTab] = useState<"school-wise" | "comparison" | "graphs" | "winners" | "ai-query">("school-wise");
  const [selectedSchool, setSelectedSchool] = useState<string>(SCHOOL_NAMES[0]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any>({});
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [schoolSearch, setSchoolSearch] = useState("");
  const [winnerSearch, setWinnerSearch] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          regs,
          sciences,
          social,
          business,
          commerce,
          psych,
          winList
        ] = await Promise.all([
          fetch("/api/registrations").then(res => res.json()),
          fetch("/api/school-of-sciences").then(res => res.json()),
          fetch("/api/school-of-social-sciences").then(res => res.json()),
          fetch("/api/school-of-business").then(res => res.json()),
          fetch("/api/school-of-commerce").then(res => res.json()),
          fetch("/api/school-of-psychology").then(res => res.json()),
          fetch("/api/winners").then(res => res.json())
        ]);

        setRegistrations(regs);
        setSchoolData({
          "School of Sciences": sciences,
          "School of Social Sciences": social,
          "School of Business": business,
          "School of Commerce": commerce,
          "School of Psychology": psych
        });
        setWinners(winList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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
  }, [activeTab, selectedSchool, loading]);

  // Prepare data for AI Query
  const getAllDataForAI = () => {
    const allData: any[] = [];
    
    // Add registrations
    registrations.forEach(r => {
      allData.push({
        type: "Registration",
        event: r.eventName,
        total: r.total.toString(),
        sciences: r.schoolOfSciences.toString(),
        social: r.schoolOfSocialSciences.toString(),
        business: r.schoolOfBusiness.toString(),
        commerce: r.schoolOfCommerce.toString(),
        psychology: r.schoolOfPsychologicalSciences.toString()
      });
    });

    // Add school stats
    Object.entries(schoolData).forEach(([schoolName, data]: [string, any]) => {
      data.forEach((d: any) => {
        allData.push({
          type: "School Stat",
          school: schoolName,
          event: d.event,
          totalReg: d.totalReg.toString(),
          turnUp: d.turnUp.toString(),
          turnDown: d.turnDown.toString(),
          score: d.score.toString()
        });
      });
    });

    // Add winners
    winners.forEach(w => {
      allData.push({
        type: "Winner",
        event: w.event,
        position: w.position,
        school: w.school,
        class: w.class,
        team: w.team
      });
    });

    return allData;
  };

  // Prepare comparison data
  const getComparisonData = () => {
    return SCHOOL_NAMES.map(school => {
      const data = schoolData[school] || [];
      const totalScore = data.reduce((acc: number, curr: any) => acc + curr.score, 0);
      const totalReg = data.reduce((acc: number, curr: any) => acc + curr.totalReg, 0);
      const totalTurnUp = data.reduce((acc: number, curr: any) => acc + curr.turnUp, 0);
      return {
        name: school.replace("School of ", ""),
        score: totalScore,
        registrations: totalReg,
        turnUp: totalTurnUp,
        fullName: school
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentSchoolData = schoolData[selectedSchool] || [];
  const filteredSchoolData = currentSchoolData.filter((row: any) => 
    row.event.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredWinners = winners.filter((row: any) => 
    row.event.toLowerCase().includes(winnerSearch.toLowerCase()) ||
    row.school.toLowerCase().includes(winnerSearch.toLowerCase()) ||
    row.team.toLowerCase().includes(winnerSearch.toLowerCase())
  );

  const totalSchoolScore = currentSchoolData.reduce((acc: number, curr: any) => acc + curr.score, 0);
  const totalSchoolReg = currentSchoolData.reduce((acc: number, curr: any) => acc + curr.totalReg, 0);
  const totalSchoolTurnUp = currentSchoolData.reduce((acc: number, curr: any) => acc + curr.turnUp, 0);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Live Analytics</span>
          </div>

          <h1 className="hero-element text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Points Dashboard
          </h1>

          <p className="hero-element text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Real-time tracking of registrations, scores, and winners across all schools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Tab Navigation */}
        <section data-reveal className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl pb-6 border-b border-white/10">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {[
              { id: "school-wise", label: "🏫 School-Wise", icon: Users },
              { id: "comparison", label: "📊 Comparison", icon: BarChart2 },
              { id: "graphs", label: "📈 Graphs", icon: PieChartIcon },
              { id: "winners", label: "🏆 Winners", icon: Award },
              { id: "ai-query", label: "🤖 AI Query", icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all duration-300 relative whitespace-nowrap rounded-t-lg ${
                  activeTab === tab.id 
                    ? "text-white bg-white/5 border-b-2 border-purple-500" 
                    : "text-white/50 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* TAB 1: SCHOOL-WISE ANALYSIS */}
        {activeTab === "school-wise" && (
          <section data-reveal className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Select School
              </h2>
              <SchoolSelector 
                selected={selectedSchool} 
                onChange={setSelectedSchool} 
                schools={SCHOOL_NAMES}
              />
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
                value={totalSchoolScore}
                label="Total Score"
              />
              <StatCard
                icon={Users}
                value={totalSchoolReg}
                label="Total Registrations"
              />
              <StatCard
                icon={TrendingUp}
                value={totalSchoolTurnUp}
                label="Total Turn Up"
              />
               <StatCard
                icon={Activity}
                value={currentSchoolData.length}
                label="Events Participated"
              />
            </MagicBento>

            <Card className="p-0 overflow-hidden mt-8">
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <Search className="w-5 h-5 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Filter events..." 
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-white/30 w-full"
                />
              </div>
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
                    {filteredSchoolData.length > 0 ? (
                      filteredSchoolData.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{row.event}</td>
                          <td className="px-6 py-4 text-right text-white/70">{row.totalReg}</td>
                          <td className="px-6 py-4 text-right text-emerald-400">{row.turnUp}</td>
                          <td className="px-6 py-4 text-right text-red-400">{row.turnDown}</td>
                          <td className="px-6 py-4 text-right font-bold text-purple-400">{row.score}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                          No events found matching "{schoolSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* TAB 2: COMPARISON */}
        {activeTab === "comparison" && (
          <section data-reveal className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">Total Scores Comparison</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(val) => val.split(' ').pop()} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {getComparisonData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">Registrations vs Turn Up</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(val) => val.split(' ').pop()} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="registrations" fill="#82ca9d" name="Registrations" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="turnUp" fill="#ffc658" name="Turn Up" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="p-0 overflow-hidden">
              <h3 className="text-xl font-bold p-6 border-b border-white/10 text-white">Overall Standings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-white/80 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Rank</th>
                      <th className="px-6 py-4">School</th>
                      <th className="px-6 py-4 text-right">Total Score</th>
                      <th className="px-6 py-4 text-right">Registrations</th>
                      <th className="px-6 py-4 text-right">Turn Up</th>
                      <th className="px-6 py-4 text-right">Turnout %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {getComparisonData()
                      .sort((a, b) => b.score - a.score)
                      .map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">#{idx + 1}</td>
                          <td className="px-6 py-4 font-medium text-white">{row.fullName}</td>
                          <td className="px-6 py-4 text-right font-bold text-purple-400">{row.score}</td>
                          <td className="px-6 py-4 text-right text-white/70">{row.registrations}</td>
                          <td className="px-6 py-4 text-right text-emerald-400">{row.turnUp}</td>
                          <td className="px-6 py-4 text-right text-blue-400">
                            {row.registrations > 0 ? ((row.turnUp / row.registrations) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* TAB 3: GRAPHS */}
        {activeTab === "graphs" && (
          <section data-reveal className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">Score Distribution</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                      data={getComparisonData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {getComparisonData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-6 text-white">Performance Radar</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getComparisonData()}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                    <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Turn Up" dataKey="turnUp" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* TAB 4: WINNERS */}
        {activeTab === "winners" && (
          <section data-reveal className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <span className="w-1 h-10 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Winners List
                </span>
              </h2>
            </div>

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
                    {filteredWinners.length > 0 ? (
                      filteredWinners.map((row: any, idx: number) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                          No winners found matching "{winnerSearch}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* TAB 5: AI QUERY */}
        {activeTab === "ai-query" && (
          <section data-reveal className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIQuery data={getAllDataForAI().map(item => 
              Object.fromEntries(Object.entries(item).map(([k, v]) => [k, String(v)]))
            )} />
          </section>
        )}
      </div>

      {/* Footer Glow */}
      <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}
