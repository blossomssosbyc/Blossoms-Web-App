import React, { useState, useEffect } from "react";
import { Download, Loader, FileText, Users, Award, Calendar, TrendingUp, BarChart3, Grid3X3, PieChart as PieChartIcon } from "lucide-react";
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Enhanced CSV parser
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).filter((line) => line.trim()).map((line) => {
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

// Extract department
function extractDepartment(classStr: string): string {
  const match = classStr.match(/\b(BCA|EMS|MDS|BSC|MSC|AI)\b/i);
  return match ? match[0].toUpperCase() : "OTHER";
}

const COLORS = [
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#84CC16", // Lime
  "#06B6D4", // Cyan
  "#D946EF", // Fuchsia
  "#F97316", // Orange
];

export default function ReportGeneration() {
  const [csvData, setCSVData] = useState<Array<{ [key: string]: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    fetch("/points.csv")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load CSV");
        return r.text();
      })
      .then((text) => {
        const parsed = parseCSV(text);
        setCSVData(parsed);
        const eventSet = new Set<string>();
        parsed.forEach((row) => {
          const eventsStr = row["Event(s) Registered"] || "";
          eventsStr.split(",").forEach((e) => {
            const trimmed = e.trim();
            if (trimmed) eventSet.add(trimmed);
          });
        });
        const sortedEvents = Array.from(eventSet).sort();
        setEvents(sortedEvents);
        if (sortedEvents.length > 0) setSelectedEvent(sortedEvents[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const calculateStats = () => {
    const depts: { [key: string]: { participants: Set<string>; events: number } } = {};
    const uniqueParticipants = new Set<string>();
    let totalRegistrations = 0;

    csvData.forEach((row) => {
      const eventsStr = row["Event(s) Registered"] || "";
      const eventsList = eventsStr.split(",").map((e) => e.trim()).filter(Boolean);
      const dept = extractDepartment(row.Class);

      uniqueParticipants.add(row.Name);
      totalRegistrations += eventsList.length;

      if (!depts[dept]) {
        depts[dept] = { participants: new Set(), events: 0 };
      }
      depts[dept].participants.add(row.Name);
      depts[dept].events += eventsList.length;
    });

    const deptStats = Object.entries(depts)
      .map(([name, data]) => ({
        name,
        participants: data.participants.size,
        events: data.events,
      }))
      .sort((a, b) => b.participants - a.participants);

    const engagementCounts = { "1 Event": 0, "2 Events": 0, "3 Events": 0, "4+ Events": 0 };
    uniqueParticipants.forEach(name => {
      const studentRow = csvData.find(r => r.Name === name);
      if (studentRow) {
        const eventsStr = studentRow["Event(s) Registered"] || "";
        const count = eventsStr.split(",").map(e => e.trim()).filter(Boolean).length;
        if (count === 1) engagementCounts["1 Event"]++;
        else if (count === 2) engagementCounts["2 Events"]++;
        else if (count === 3) engagementCounts["3 Events"]++;
        else if (count >= 4) engagementCounts["4+ Events"]++;
      }
    });

    const engagementData = Object.entries(engagementCounts).map(([name, count]) => ({
      name,
      count,
      fill: name === "1 Event" ? "#8B5CF6" : name === "2 Events" ? "#EC4899" : name === "3 Events" ? "#10B981" : "#F59E0B"
    }));

    return {
      totalParticipants: uniqueParticipants.size,
      totalDepartments: deptStats.length,
      totalEvents: events.length,
      totalRegistrations,
      avgEventsPerParticipant: (totalRegistrations / uniqueParticipants.size).toFixed(2),
      mostActiveDept: deptStats[0]?.name || "N/A",
      deptStats,
      engagementData
    };
  };

  const stats = calculateStats();

  const eventStats: { [key: string]: number } = {};
  csvData.forEach((row) => {
    const eventsStr = row["Event(s) Registered"] || "";
    eventsStr.split(",").forEach((e) => {
      const trimmed = e.trim();
      if (trimmed) eventStats[trimmed] = (eventStats[trimmed] || 0) + 1;
    });
  });

  const eventData = Object.entries(eventStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topEventData = eventData.slice(0, 8);
  const deptChartData = stats.deptStats.map((d) => ({
    name: d.name,
    participants: d.participants,
    registrations: d.events,
  }));

  // Generate Individual Event Report - DOWNLOADS HTML FILE
  const generateIndividualEventPDF = () => {
    if (!selectedEvent) return;
    setGenerating(true);

    setTimeout(() => {
      try {
        const eventParticipants = csvData
          .filter((row) => {
            const eventsStr = row["Event(s) Registered"] || "";
            return eventsStr.split(",").map((e) => e.trim()).includes(selectedEvent);
          })
          .sort((a, b) => a.Name.localeCompare(b.Name));

        const deptBreakdown = stats.deptStats.map(d => ({
          ...d,
          eventParticipants: eventParticipants.filter(p => extractDepartment(p.Class) === d.name).length
        }));

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${selectedEvent} - Report</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Arial', sans-serif;
                background: #0f172a;
                color: #e2e8f0;
                padding: 20px;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                padding: 40px 20px;
                border-bottom: 3px solid rgba(139, 92, 246, 0.5);
                margin-bottom: 30px;
                background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%);
                border-radius: 12px;
              }
              .school-name {
                font-size: 48px;
                color: #8b5cf6;
                font-weight: 800;
                letter-spacing: 6px;
                text-transform: uppercase;
                text-shadow: 0 0 35px rgba(139, 92, 246, 0.4);
              }
              .blossoms-tag {
                font-size: 36px;
                color: #ec4899;
                font-weight: 800;
                letter-spacing: 5px;
                text-transform: uppercase;
                text-shadow: 0 0 30px rgba(236, 72, 153, 0.4);
                margin-top: 10px;
              }
              .event-title {
                font-size: 42px;
                color: #f8fafc;
                font-weight: 700;
                margin-top: 20px;
              }
              .chart-section {
                background: rgba(30, 41, 59, 0.5);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
              }
              .chart-title {
                font-size: 18px;
                font-weight: 700;
                color: #a78bfa;
                margin-bottom: 20px;
                text-align: center;
              }
              .chart-container {
                width: 100%;
                height: 400px;
                background: rgba(15, 23, 42, 0.5);
                border-radius: 8px;
                padding: 20px;
              }
              .student-card {
                background: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
              }
              .student-name {
                font-size: 18px;
                font-weight: 700;
                color: #a78bfa;
                margin-bottom: 10px;
              }
              .student-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 14px;
                color: #cbd5e1;
              }
              .info-label {
                font-weight: 700;
                color: #ec4899;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="school-name">School of Science</div>
                <div class="blossoms-tag">Blossoms Report 2025</div>
                <div class="event-title">${selectedEvent}</div>
              </div>

              <!-- Department Bar Chart -->
              <div class="chart-section">
                <div class="chart-title">📊 Department Participation - Bar Chart</div>
                <div class="chart-container">
                  <canvas id="deptBarChart"></canvas>
                </div>
              </div>

              <!-- Department Pie Chart -->
              <div class="chart-section">
                <div class="chart-title">🎯 Department Distribution - Pie Chart</div>
                <div class="chart-container">
                  <canvas id="deptPieChart"></canvas>
                </div>
              </div>

              <!-- Department Line Chart -->
              <div class="chart-section">
                <div class="chart-title">📈 Department Trend - Line Chart</div>
                <div class="chart-container">
                  <canvas id="deptLineChart"></canvas>
                </div>
              </div>

              <!-- Department Radar Chart -->
              <div class="chart-section">
                <div class="chart-title">🔷 Department Performance - Radar Chart</div>
                <div class="chart-container">
                  <canvas id="deptRadarChart"></canvas>
                </div>
              </div>

              <!-- Event Statistics Area Chart -->
              <div class="chart-section">
                <div class="chart-title">📊 Overall Event Statistics - Area Chart</div>
                <div class="chart-container">
                  <canvas id="eventAreaChart"></canvas>
                </div>
              </div>

              <!-- Event Doughnut Chart -->
              <div class="chart-section">
                <div class="chart-title">🎯 Top Events - Doughnut Chart</div>
                <div class="chart-container">
                  <canvas id="eventDoughnutChart"></canvas>
                </div>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 3px solid rgba(139, 92, 246, 0.3);">
                <h2 style="font-size: 28px; color: #a78bfa; margin-bottom: 20px; text-align: center;">📋 Student Details</h2>
                ${eventParticipants.map((participant, idx) => `
                  <div class="student-card">
                    <div class="student-name">${idx + 1}. ${participant.Name}</div>
                    <div class="student-info">
                      <div><span class="info-label">Class:</span> ${participant.Class}</div>
                      <div><span class="info-label">Department:</span> ${extractDepartment(participant.Class)}</div>
                      <div><span class="info-label">Reg No:</span> ${participant["Register No."]}</div>
                      <div><span class="info-label">Phone:</span> ${participant["Phone No."]}</div>
                      <div style="grid-column: span 2;"><span class="info-label">Email:</span> ${participant["Christ Email"]}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <script>
              const deptData = ${JSON.stringify(deptBreakdown)};
              const eventData = ${JSON.stringify(eventData.slice(0, 10))};

              // Bar Chart
              new Chart(document.getElementById('deptBarChart'), {
                type: 'bar',
                data: {
                  labels: deptData.map(d => d.name),
                  datasets: [{
                    label: 'Participants',
                    data: deptData.map(d => d.eventParticipants),
                    backgroundColor: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                    borderColor: '#8B5CF6',
                    borderWidth: 2,
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } },
                    x: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } }
                  }
                }
              });

              // Pie Chart
              new Chart(document.getElementById('deptPieChart'), {
                type: 'pie',
                data: {
                  labels: deptData.map(d => d.name),
                  datasets: [{
                    data: deptData.map(d => d.eventParticipants),
                    backgroundColor: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                    borderColor: '#0f172a',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 13, weight: 'bold' } }, position: 'right' } }
                }
              });

              // Line Chart
              new Chart(document.getElementById('deptLineChart'), {
                type: 'line',
                data: {
                  labels: deptData.map(d => d.name),
                  datasets: [{
                    label: 'Participants Trend',
                    data: deptData.map(d => d.eventParticipants),
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#EC4899',
                    pointBorderColor: '#8B5CF6',
                    pointRadius: 6
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } },
                    x: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } }
                  }
                }
              });

              // Radar Chart
              new Chart(document.getElementById('deptRadarChart'), {
                type: 'radar',
                data: {
                  labels: deptData.map(d => d.name),
                  datasets: [{
                    label: 'Department Performance',
                    data: deptData.map(d => d.eventParticipants),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    borderWidth: 2,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#fff',
                    pointRadius: 5
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    r: {
                      ticks: { color: '#a78bfa', backdropColor: 'transparent', font: { size: 12, weight: 'bold' } },
                      grid: { color: 'rgba(139, 92, 246, 0.2)' },
                      pointLabels: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }
                    }
                  }
                }
              });

              // Area Chart
              new Chart(document.getElementById('eventAreaChart'), {
                type: 'line',
                data: {
                  labels: eventData.map(e => e.name),
                  datasets: [{
                    label: 'Event Registrations',
                    data: eventData.map(e => e.count),
                    borderColor: '#07fbf8',
                    backgroundColor: 'rgba(7, 251, 248, 0.3)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointBackgroundColor: '#0d7cff',
                    pointBorderColor: '#07fbf8',
                    pointRadius: 6
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 12, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } }
                  }
                }
              });

              // Doughnut Chart
              new Chart(document.getElementById('eventDoughnutChart'), {
                type: 'doughnut',
                data: {
                  labels: eventData.map(e => e.name),
                  datasets: [{
                    data: eventData.map(e => e.count),
                    backgroundColor: ['#07fbf8', '#0d7cff', '#c800ff', '#ff0080', '#00ff88', '#ffb800', '#ff6b35', '#a100f2', '#06b6d4', '#ec4899'],
                    borderColor: '#0a0e27',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 13, weight: 'bold' } }, position: 'bottom' } }
                }
              });
            </script>
          </body>
          </html>
        `;

        // DOWNLOAD HTML FILE DIRECTLY
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedEvent.replace(/[^a-z0-9]/gi, '_')}_Report_${new Date().toISOString().split("T")[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGenerating(false);
      } catch (err) {
        console.error("Report Generation Error:", err);
        setGenerating(false);
      }
    }, 100);
  };

  // Generate Comprehensive Report - DOWNLOADS HTML FILE
  const generateComprehensivePDF = () => {
    setGenerating(true);

    setTimeout(() => {
      try {
        const studentsByDept: { [key: string]: typeof csvData } = {};
        csvData.forEach((student) => {
          const dept = extractDepartment(student.Class);
          if (!studentsByDept[dept]) {
            studentsByDept[dept] = [];
          }
          studentsByDept[dept].push(student);
        });

        Object.keys(studentsByDept).forEach((dept) => {
          studentsByDept[dept].sort((a, b) => a.Name.localeCompare(b.Name));
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Comprehensive Report - Blossoms 2025</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Arial', sans-serif;
                background: #0f172a;
                color: #e2e8f0;
                padding: 20px;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                padding: 40px 20px;
                border-bottom: 3px solid rgba(139, 92, 246, 0.5);
                margin-bottom: 30px;
                background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%);
                border-radius: 12px;
              }
              .school-name {
                font-size: 48px;
                color: #8b5cf6;
                font-weight: 800;
                letter-spacing: 6px;
                text-transform: uppercase;
                text-shadow: 0 0 35px rgba(139, 92, 246, 0.4);
              }
              .blossoms-tag {
                font-size: 36px;
                color: #ec4899;
                font-weight: 800;
                letter-spacing: 5px;
                text-transform: uppercase;
                text-shadow: 0 0 30px rgba(236, 72, 153, 0.4);
                margin-top: 10px;
              }
              .chart-section {
                background: rgba(30, 41, 59, 0.5);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
              }
              .chart-title {
                font-size: 18px;
                font-weight: 700;
                color: #a78bfa;
                margin-bottom: 20px;
                text-align: center;
              }
              .chart-container {
                width: 100%;
                height: 400px;
                background: rgba(15, 23, 42, 0.5);
                border-radius: 8px;
                padding: 20px;
              }
              .dept-title {
                font-size: 28px;
                color: #10b981;
                font-weight: 700;
                padding: 15px 20px;
                background: rgba(16, 185, 129, 0.12);
                border-left: 4px solid #10b981;
                margin: 25px 0 15px 0;
                border-radius: 5px;
              }
              .student-card {
                background: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
              }
              .student-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(139, 92, 246, 0.2);
              }
              .student-name {
                font-size: 16px;
                font-weight: 700;
                color: #a78bfa;
              }
              .student-badge {
                font-size: 12px;
                background: rgba(139, 92, 246, 0.15);
                border: 1px solid #8b5cf6;
                color: #a78bfa;
                padding: 5px 12px;
                border-radius: 4px;
                font-weight: 700;
              }
              .student-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 13px;
                color: #cbd5e1;
              }
              .info-label {
                font-weight: 700;
                color: #ec4899;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="school-name">School of Science</div>
                <div class="blossoms-tag">Blossoms Report 2025</div>
                <h2 style="font-size: 32px; color: #a78bfa; margin-top: 20px;">Comprehensive Report</h2>
              </div>

              <!-- Overall Bar Chart -->
              <div class="chart-section">
                <div class="chart-title">📊 Overall Department Participation - Bar Chart</div>
                <div class="chart-container">
                  <canvas id="overallBarChart"></canvas>
                </div>
              </div>

              <!-- Overall Pie Chart -->
              <div class="chart-section">
                <div class="chart-title">🎯 Department Distribution - Pie Chart</div>
                <div class="chart-container">
                  <canvas id="overallPieChart"></canvas>
                </div>
              </div>

              <!-- Overall Line Chart -->
              <div class="chart-section">
                <div class="chart-title">📈 Registration Trend - Line Chart</div>
                <div class="chart-container">
                  <canvas id="overallLineChart"></canvas>
                </div>
              </div>

              <!-- Overall Radar Chart -->
              <div class="chart-section">
                <div class="chart-title">🔷 Department Performance - Radar Chart</div>
                <div class="chart-container">
                  <canvas id="overallRadarChart"></canvas>
                </div>
              </div>

              <!-- Event Area Chart -->
              <div class="chart-section">
                <div class="chart-title">📊 Event Statistics - Area Chart</div>
                <div class="chart-container">
                  <canvas id="eventAreaChart"></canvas>
                </div>
              </div>

              <!-- Event Doughnut Chart -->
              <div class="chart-section">
                <div class="chart-title">🎯 Top Events - Doughnut Chart</div>
                <div class="chart-container">
                  <canvas id="eventDoughnutChart"></canvas>
                </div>
              </div>

              ${Object.entries(studentsByDept).map(([deptName, students]) => `
                <div class="dept-title">📋 ${deptName} Department - ${students.length} Students</div>
                ${students.map((student, idx) => {
                  const eventCount = (student["Event(s) Registered"] || "").split(",").filter(e => e.trim()).length;
                  return `
                    <div class="student-card">
                      <div class="student-header">
                        <div class="student-name">${idx + 1}. ${student.Name}</div>
                        <div class="student-badge">${student.Class}</div>
                      </div>
                      <div class="student-info">
                        <div><span class="info-label">Reg No:</span> ${student["Register No."]}</div>
                        <div><span class="info-label">Events:</span> ${eventCount}</div>
                        <div><span class="info-label">Email:</span> ${student["Christ Email"]}</div>
                        <div><span class="info-label">Phone:</span> ${student["Phone No."]}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              `).join('')}
            </div>

            <script>
              const deptChartData = ${JSON.stringify(deptChartData)};
              const eventData = ${JSON.stringify(eventData.slice(0, 10))};

              // Overall Bar Chart
              new Chart(document.getElementById('overallBarChart'), {
                type: 'bar',
                data: {
                  labels: deptChartData.map(d => d.name),
                  datasets: [
                    { label: 'Participants', data: deptChartData.map(d => d.participants), backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', borderWidth: 2 },
                    { label: 'Registrations', data: deptChartData.map(d => d.registrations), backgroundColor: '#EC4899', borderColor: '#EC4899', borderWidth: 2 }
                  ]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.1)' } },
                    x: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.1)' } }
                  }
                }
              });

              // Overall Pie Chart
              new Chart(document.getElementById('overallPieChart'), {
                type: 'pie',
                data: {
                  labels: deptChartData.map(d => d.name),
                  datasets: [{
                    data: deptChartData.map(d => d.participants),
                    backgroundColor: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                    borderColor: '#0f172a',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 13, weight: 'bold' } }, position: 'right' } }
                }
              });

              // Overall Line Chart
              new Chart(document.getElementById('overallLineChart'), {
                type: 'line',
                data: {
                  labels: deptChartData.map(d => d.name),
                  datasets: [{
                    label: 'Registration Trend',
                    data: deptChartData.map(d => d.registrations),
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#EC4899',
                    pointBorderColor: '#8B5CF6',
                    pointRadius: 7
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } },
                    x: { ticks: { color: '#a78bfa', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(139, 92, 246, 0.15)' } }
                  }
                }
              });

              // Overall Radar Chart
              new Chart(document.getElementById('overallRadarChart'), {
                type: 'radar',
                data: {
                  labels: deptChartData.map(d => d.name),
                  datasets: [{
                    label: 'Overall Performance',
                    data: deptChartData.map(d => d.participants),
                    borderColor: '#07fbf8',
                    backgroundColor: 'rgba(7, 251, 248, 0.25)',
                    borderWidth: 3,
                    pointBackgroundColor: '#0d7cff',
                    pointBorderColor: '#07fbf8',
                    pointRadius: 6
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    r: {
                      ticks: { color: '#07fbf8', backdropColor: 'transparent', font: { size: 12, weight: 'bold' } },
                      grid: { color: 'rgba(7, 251, 248, 0.2)' },
                      pointLabels: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }
                    }
                  }
                }
              });

              // Event Area Chart
              new Chart(document.getElementById('eventAreaChart'), {
                type: 'line',
                data: {
                  labels: eventData.map(e => e.name),
                  datasets: [{
                    label: 'Event Registrations',
                    data: eventData.map(e => e.count),
                    borderColor: '#07fbf8',
                    backgroundColor: 'rgba(7, 251, 248, 0.3)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointBackgroundColor: '#0d7cff',
                    pointBorderColor: '#07fbf8',
                    pointRadius: 6
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 12, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } }
                  }
                }
              });

              // Event Doughnut Chart
              new Chart(document.getElementById('eventDoughnutChart'), {
                type: 'doughnut',
                data: {
                  labels: eventData.map(e => e.name),
                  datasets: [{
                    data: eventData.map(e => e.count),
                    backgroundColor: ['#07fbf8', '#0d7cff', '#c800ff', '#ff0080', '#00ff88', '#ffb800', '#ff6b35', '#a100f2', '#06b6d4', '#ec4899'],
                    borderColor: '#0a0e27',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 13, weight: 'bold' } }, position: 'bottom' } }
                }
              });
            </script>
          </body>
          </html>
        `;

        // DOWNLOAD HTML FILE DIRECTLY
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Comprehensive_Report_${new Date().toISOString().split("T")[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGenerating(false);
      } catch (err) {
        console.error("Report Generation Error:", err);
        setGenerating(false);
      }
    }, 100);
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];
    const csvString = [
      headers.join(","),
      ...csvData.map((row) => headers.map((h) => `"${row[h] || ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Event_Data_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-violet-500 animate-spin" />
          <p className="text-slate-300 animate-pulse">Loading live statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl font-bold mb-2">Error loading data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const participantsForEvent = csvData.filter((row) => {
    const eventsStr = row["Event(s) Registered"] || "";
    return eventsStr.split(",").map((e) => e.trim()).includes(selectedEvent);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-violet-500/20 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Report Generation
              </span>
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              Real-time Analytics Dashboard
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadCSV}
              className="group relative px-6 py-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl hover:bg-emerald-500/20 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2 font-bold text-emerald-400">
                <Download className="w-5 h-5" />
                Download CSV
              </span>
            </button>

            <button
              onClick={generateComprehensivePDF}
              disabled={generating}
              className="group relative px-6 py-3 bg-violet-500/10 border border-violet-500/50 rounded-xl hover:bg-violet-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2 font-bold text-violet-400">
                {generating ? <Loader className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                Comprehensive Report
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Registrations", value: stats.totalRegistrations, icon: Users, color: "#8B5CF6" },
            { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "#EC4899" },
            { label: "Departments", value: stats.totalDepartments, icon: Grid3X3, color: "#10B981" },
            { label: "Top Event", value: topEventData[0]?.name || "N/A", icon: Award, color: "#F59E0B" },
            { label: "Avg Events/Student", value: stats.avgEventsPerParticipant, icon: TrendingUp, color: "#3B82F6" },
            { label: "Most Active Dept", value: stats.mostActiveDept, icon: BarChart3, color: "#EF4444" },
            { label: "Unique Participants", value: stats.totalParticipants, icon: Users, color: "#6366F1" },
            { label: "Engagement (4+)", value: stats.engagementData.find(d => d.name === "4+ Events")?.count || 0, icon: Award, color: "#14B8A6" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="relative group p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5`} style={{ color: stat.color }}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Distribution - Pie */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-violet-400" />
              Department Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="registrations"
                  >
                    {deptChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(15, 23, 42, 0.5)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Events - Bar */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Top Events by Registration
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEventData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20}>
                    {topEventData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Engagement - Radial Bar */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Student Engagement Levels
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={stats.engagementData}>
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="count"
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dept Performance - Scatter */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-blue-400" />
              Dept Size vs Participation
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="participants" name="Participants" stroke="#94a3b8" />
                  <YAxis type="number" dataKey="registrations" name="Registrations" stroke="#94a3b8" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Scatter name="Departments" data={deptChartData} fill="#8884d8">
                    {deptChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Trends - Area Chart */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              Event Registration Trends
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventData.slice(0, 15)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#EC4899" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Comparison - Radar */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Department Performance Radar
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={deptChartData.slice(0, 6)}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8' }} />
                  <Radar name="Participants" dataKey="participants" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Radar name="Registrations" dataKey="registrations" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overall Performance - Composed */}
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Overall Performance Metrics
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deptChartData.slice(0, 8)}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(139, 92, 246, 0.2)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" strokeOpacity={0.05} />
                  <Area type="monotone" dataKey="registrations" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.2} />
                  <Bar dataKey="participants" barSize={20} fill="#F59E0B" />
                  <Line type="monotone" dataKey="registrations" stroke="#EF4444" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Individual Event Generation */}
        <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-violet-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Generate Event Report</h3>
            <p className="text-slate-400 mb-8 max-w-2xl">
              Select an event to generate a detailed PDF report containing participant lists, department breakdown, and statistics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1 group">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-violet-500/30 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                >
                  {events.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400">
                  ▼
                </div>
              </div>

              <button
                onClick={generateIndividualEventPDF}
                disabled={!selectedEvent || generating}
                className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
              >
                {generating ? <Loader className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
