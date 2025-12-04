import React, { useState, useEffect } from "react";
import { Download, Loader, FileText, Users, Award, Calendar, TrendingUp, BarChart3, Grid3X3, PieChart as PieChartIcon, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

const SCHOOL_NAMES = [
  "School of Sciences",
  "School of Social Sciences",
  "School of Business",
  "School of Commerce",
  "School of Psychology"
];

const COLORS = [
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

export default function ReportGeneration() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  
  const [activeModal, setActiveModal] = useState<"bar" | "pie" | null>(null);

  // Data States
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any>({});
  const [winners, setWinners] = useState<any[]>([]);

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

  // Prepare data based on selection
  const getFilteredData = () => {
    // ... (existing logic) ...
    if (selectedDept === "All Departments") {
      return SCHOOL_NAMES.map(school => {
        const data = schoolData[school] || [];
        const totalScore = data.reduce((acc: number, curr: any) => acc + curr.score, 0);
        const totalReg = data.reduce((acc: number, curr: any) => acc + curr.totalReg, 0);
        const totalTurnUp = data.reduce((acc: number, curr: any) => acc + curr.turnUp, 0);
        return {
          name: school.replace("School of ", ""),
          fullName: school,
          score: totalScore,
          registrations: totalReg,
          turnUp: totalTurnUp
        };
      });
    } else {
      const data = schoolData[selectedDept] || [];
      return data.map((item: any) => ({
        name: item.event,
        score: item.score,
        registrations: item.totalReg,
        turnUp: item.turnUp,
        turnDown: item.turnDown
      }));
    }
  };

  const fullChartData = getFilteredData();
  // Sort and slice for summary view (Top 5)
  const summaryChartData = [...fullChartData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Modal Component
  const ChartModal = ({ type, onClose }: { type: "bar" | "pie"; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#0f172a] border border-purple-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-500/20" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-transparent">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              {type === "bar" ? <BarChart3 className="w-6 h-6 text-purple-400" /> : <PieChartIcon className="w-6 h-6 text-pink-400" />}
              {type === "bar" ? "Performance Overview (Full Detail)" : "Score Distribution (Full Detail)"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="text-2xl text-white/50 hover:text-white">&times;</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Large Chart */}
            <div className="h-[500px] bg-white/5 rounded-xl p-4 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                {type === "bar" ? (
                  <BarChart data={fullChartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={12} 
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={100}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="registrations" name="Registrations" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="turnUp" name="Turn Up" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={fullChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={180}
                      paddingAngle={2}
                      dataKey="score"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {fullChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Detailed Table */}
            <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
               <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-bold">{selectedDept === "All Departments" ? "School" : "Event"}</th>
                    <th className="px-6 py-4 text-right">Registrations</th>
                    <th className="px-6 py-4 text-right">Turn Up</th>
                    <th className="px-6 py-4 text-right">Turn Down</th>
                    <th className="px-6 py-4 text-right text-purple-400 font-bold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fullChartData.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.name}</td>
                      <td className="px-6 py-4 text-right">{row.registrations}</td>
                      <td className="px-6 py-4 text-right text-emerald-400">{row.turnUp}</td>
                      <td className="px-6 py-4 text-right text-red-400">{row.turnDown || 0}</td>
                      <td className="px-6 py-4 text-right font-bold text-purple-400">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Generate Report HTML
  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      try {
        const isAll = selectedDept === "All Departments";
        const title = isAll ? "Comprehensive Report" : `${selectedDept} Report`;
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${title} - Blossoms 2025</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Arial', sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
              .container { max-width: 1200px; margin: 0 auto; }
              .header { text-align: center; padding: 40px 20px; border-bottom: 3px solid rgba(139, 92, 246, 0.5); margin-bottom: 30px; background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%); border-radius: 12px; }
              .school-name { font-size: 48px; color: #8b5cf6; font-weight: 800; letter-spacing: 6px; text-transform: uppercase; text-shadow: 0 0 35px rgba(139, 92, 246, 0.4); }
              .blossoms-tag { font-size: 36px; color: #ec4899; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 0 30px rgba(236, 72, 153, 0.4); margin-top: 10px; }
              .report-title { font-size: 24px; color: #a78bfa; margin-top: 20px; font-weight: 600; }
              .chart-section { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 25px; margin: 25px 0; }
              .chart-title { font-size: 18px; font-weight: 700; color: #a78bfa; margin-bottom: 20px; text-align: center; }
              .chart-container { width: 100%; height: 400px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; overflow: hidden; }
              th, td { padding: 15px; text-align: left; border-bottom: 1px solid rgba(139, 92, 246, 0.2); }
              th { background: rgba(139, 92, 246, 0.1); color: #a78bfa; font-weight: 700; }
              td { color: #cbd5e1; }
              tr:hover { background: rgba(139, 92, 246, 0.05); }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="school-name">${isAll ? "All Schools" : selectedDept}</div>
                <div class="blossoms-tag">Blossoms Report 2025</div>
                <div class="report-title">${title}</div>
              </div>

              <div class="chart-section">
                <div class="chart-title">📊 ${isAll ? "Department Comparison" : "Event Performance"}</div>
                <div class="chart-container">
                  <canvas id="mainChart"></canvas>
                </div>
              </div>

              <div class="chart-section">
                <div class="chart-title">📋 Detailed Data</div>
                <table>
                  <thead>
                    <tr>
                      <th>${isAll ? "School" : "Event"}</th>
                      <th>Registrations</th>
                      <th>Turn Up</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${fullChartData.map((row: any) => `
                      <tr>
                        <td>${row.name}</td>
                        <td>${row.registrations}</td>
                        <td>${row.turnUp}</td>
                        <td>${row.score}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <script>
              const data = ${JSON.stringify(fullChartData)};
              const ctx = document.getElementById('mainChart').getContext('2d');
              new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: data.map(d => d.name),
                  datasets: [
                    {
                      label: 'Registrations',
                      data: data.map(d => d.registrations),
                      backgroundColor: '#8B5CF6',
                      borderColor: '#8B5CF6',
                      borderWidth: 1
                    },
                    {
                      label: 'Turn Up',
                      data: data.map(d => d.turnUp),
                      backgroundColor: '#10B981',
                      borderColor: '#10B981',
                      borderWidth: 1
                    }
                  ]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#cbd5e1' } },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#cbd5e1' } }
                  },
                  plugins: {
                    legend: { labels: { color: '#cbd5e1' } }
                  }
                }
              });
            </script>
          </body>
          </html>
        `;

        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/\s+/g, "_")}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGenerating(false);
      } catch (err) {
        console.error("Error generating report:", err);
        setGenerating(false);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Report Generation
            </h1>
            <p className="text-gray-400">Generate comprehensive reports for Blossoms 2025</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="All Departments">All Departments</option>
                {SCHOOL_NAMES.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={generateReport}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {generating ? "Generating..." : "Download Report"}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            className="bg-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-purple-500/50 transition-all group"
            onClick={() => setActiveModal("bar")}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-purple-400 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Performance Overview (Top 5)
              <span className="text-xs font-normal text-gray-500 ml-auto">Click to expand</span>
            </h2>
            <div className="h-[300px] pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.5)" 
                    fontSize={12} 
                    tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Bar dataKey="registrations" name="Registrations" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="turnUp" name="Turn Up" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div 
            className="bg-white/5 rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-pink-500/50 transition-all group"
            onClick={() => setActiveModal("pie")}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 group-hover:text-pink-400 transition-colors">
              <PieChartIcon className="w-5 h-5 text-pink-400" />
              Score Distribution (Top 5)
              <span className="text-xs font-normal text-gray-500 ml-auto">Click to expand</span>
            </h2>
            <div className="h-[300px] pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="score"
                  >
                    {summaryChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Detailed Statistics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60 uppercase">
                <tr>
                  <th className="px-6 py-4 font-bold">{selectedDept === "All Departments" ? "School" : "Event"}</th>
                  <th className="px-6 py-4 text-right">Registrations</th>
                  <th className="px-6 py-4 text-right">Turn Up</th>
                  <th className="px-6 py-4 text-right">Turn Down</th>
                  <th className="px-6 py-4 text-right text-purple-400 font-bold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fullChartData.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-right">{row.registrations}</td>
                    <td className="px-6 py-4 text-right text-emerald-400">{row.turnUp}</td>
                    <td className="px-6 py-4 text-right text-red-400">{row.turnDown || 0}</td>
                    <td className="px-6 py-4 text-right font-bold text-purple-400">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && <ChartModal type={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
