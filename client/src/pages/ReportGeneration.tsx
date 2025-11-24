import React, { useState, useEffect } from "react";
import { Download, Loader, FileText, Users, Award, Calendar, TrendingUp, BarChart3, Grid3X3 } from "lucide-react";
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

const COLORS = ["#07fbf8", "#0d7cff", "#c800ff", "#ff0080", "#00ff88", "#ffb800", "#ff6b35", "#a100f2"];

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

    return {
      totalParticipants: uniqueParticipants.size,
      totalDepartments: deptStats.length,
      totalEvents: events.length,
      totalRegistrations,
      avgEventsPerParticipant: (totalRegistrations / uniqueParticipants.size).toFixed(2),
      deptStats,
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
                background: linear-gradient(135deg, #0a0e27 0%, #1a1d3a 100%);
                color: #b0c4de;
                padding: 20px;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                padding: 40px 20px;
                border-bottom: 3px solid rgba(7, 251, 248, 0.5);
                margin-bottom: 30px;
                background: linear-gradient(180deg, rgba(7, 251, 248, 0.08) 0%, transparent 100%);
                border-radius: 12px;
              }
              .school-name {
                font-size: 48px;
                color: #07fbf8;
                font-weight: 800;
                letter-spacing: 6px;
                text-transform: uppercase;
                text-shadow: 0 0 35px rgba(7, 251, 248, 0.8);
              }
              .blossoms-tag {
                font-size: 36px;
                color: #0d7cff;
                font-weight: 800;
                letter-spacing: 5px;
                text-transform: uppercase;
                text-shadow: 0 0 30px rgba(13, 124, 255, 0.7);
                margin-top: 10px;
              }
              .event-title {
                font-size: 42px;
                color: #07fbf8;
                font-weight: 700;
                margin-top: 20px;
              }
              .chart-section {
                background: rgba(15, 23, 42, 0.9);
                border: 2px solid rgba(7, 251, 248, 0.3);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
              }
              .chart-title {
                font-size: 18px;
                font-weight: 700;
                color: #07fbf8;
                margin-bottom: 20px;
                text-align: center;
              }
              .chart-container {
                width: 100%;
                height: 400px;
                background: rgba(7, 251, 248, 0.03);
                border-radius: 8px;
                padding: 20px;
              }
              .student-card {
                background: rgba(15, 23, 42, 0.85);
                border: 2px solid rgba(7, 251, 248, 0.25);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
              }
              .student-name {
                font-size: 18px;
                font-weight: 700;
                color: #07fbf8;
                margin-bottom: 10px;
              }
              .student-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 14px;
              }
              .info-label {
                font-weight: 700;
                color: #0d7cff;
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

              <div style="margin-top: 40px; padding-top: 30px; border-top: 3px solid rgba(7, 251, 248, 0.3);">
                <h2 style="font-size: 28px; color: #07fbf8; margin-bottom: 20px; text-align: center;">📋 Student Details</h2>
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
                    backgroundColor: ['#07fbf8', '#0d7cff', '#c800ff', '#ff0080', '#00ff88', '#ffb800'],
                    borderColor: '#07fbf8',
                    borderWidth: 3,
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } }
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
                    backgroundColor: ['#07fbf8', '#0d7cff', '#c800ff', '#ff0080', '#00ff88', '#ffb800'],
                    borderColor: '#0a0e27',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 13, weight: 'bold' } }, position: 'right' } }
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
                    borderColor: '#07fbf8',
                    backgroundColor: 'rgba(7, 251, 248, 0.2)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0d7cff',
                    pointBorderColor: '#07fbf8',
                    pointRadius: 7
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } }
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
                background: linear-gradient(135deg, #0a0e27 0%, #1a1d3a 100%);
                color: #b0c4de;
                padding: 20px;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                padding: 40px 20px;
                border-bottom: 3px solid rgba(7, 251, 248, 0.5);
                margin-bottom: 30px;
                background: linear-gradient(180deg, rgba(7, 251, 248, 0.08) 0%, transparent 100%);
                border-radius: 12px;
              }
              .school-name {
                font-size: 48px;
                color: #07fbf8;
                font-weight: 800;
                letter-spacing: 6px;
                text-transform: uppercase;
                text-shadow: 0 0 35px rgba(7, 251, 248, 0.8);
              }
              .blossoms-tag {
                font-size: 36px;
                color: #0d7cff;
                font-weight: 800;
                letter-spacing: 5px;
                text-transform: uppercase;
                text-shadow: 0 0 30px rgba(13, 124, 255, 0.7);
                margin-top: 10px;
              }
              .chart-section {
                background: rgba(15, 23, 42, 0.9);
                border: 2px solid rgba(7, 251, 248, 0.3);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
              }
              .chart-title {
                font-size: 18px;
                font-weight: 700;
                color: #07fbf8;
                margin-bottom: 20px;
                text-align: center;
              }
              .chart-container {
                width: 100%;
                height: 400px;
                background: rgba(7, 251, 248, 0.03);
                border-radius: 8px;
                padding: 20px;
              }
              .dept-title {
                font-size: 28px;
                color: #00ff88;
                font-weight: 700;
                padding: 15px 20px;
                background: rgba(0, 255, 136, 0.12);
                border-left: 4px solid #00ff88;
                margin: 25px 0 15px 0;
                border-radius: 5px;
              }
              .student-card {
                background: rgba(15, 23, 42, 0.85);
                border: 2px solid rgba(7, 251, 248, 0.25);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
              }
              .student-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(7, 251, 248, 0.2);
              }
              .student-name {
                font-size: 16px;
                font-weight: 700;
                color: #07fbf8;
              }
              .student-badge {
                font-size: 12px;
                background: rgba(7, 251, 248, 0.15);
                border: 1px solid #07fbf8;
                color: #07fbf8;
                padding: 5px 12px;
                border-radius: 4px;
                font-weight: 700;
              }
              .student-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-size: 13px;
              }
              .info-label {
                font-weight: 700;
                color: #0d7cff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="school-name">School of Science</div>
                <div class="blossoms-tag">Blossoms Report 2025</div>
                <h2 style="font-size: 32px; color: #07fbf8; margin-top: 20px;">Comprehensive Report</h2>
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
                    { label: 'Participants', data: deptChartData.map(d => d.participants), backgroundColor: '#07fbf8', borderColor: '#0d7cff', borderWidth: 2 },
                    { label: 'Registrations', data: deptChartData.map(d => d.registrations), backgroundColor: '#0d7cff', borderColor: '#07fbf8', borderWidth: 2 }
                  ]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.1)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.1)' } }
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
                    backgroundColor: ['#07fbf8', '#0d7cff', '#c800ff', '#ff0080', '#00ff88', '#ffb800'],
                    borderColor: '#0a0e27',
                    borderWidth: 3
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 13, weight: 'bold' } }, position: 'right' } }
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
                    borderColor: '#07fbf8',
                    backgroundColor: 'rgba(7, 251, 248, 0.2)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0d7cff',
                    pointBorderColor: '#07fbf8',
                    pointRadius: 7
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#b0c4de', font: { size: 14, weight: 'bold' } } } },
                  scales: {
                    y: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } },
                    x: { ticks: { color: '#07fbf8', font: { size: 13, weight: 'bold' } }, grid: { color: 'rgba(7, 251, 248, 0.15)' } }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-lg shadow-xl border-2 border-destructive/50">
          <p className="text-destructive font-semibold mb-3 text-2xl">⚠️ Error</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const participantsForEvent = csvData.filter((row) => {
    const eventsStr = row["Event(s) Registered"] || "";
    return eventsStr.split(",").map((e) => e.trim()).includes(selectedEvent);
  });

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(7, 251, 248, 0.3); }
          50% { text-shadow: 0 0 20px rgba(7, 251, 248, 0.6); }
        }

        .glow-text {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        .hover-elevate {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-elevate:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(7, 251, 248, 0.2);
        }

        .active-elevate:active {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-l-4 border-accent pl-6 mb-8 slide-in">
          <h1 className="text-6xl font-bold mb-3 text-accent glow-text" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, letterSpacing: '2px' }}>
            Event Analytics & Reports
          </h1>
          <p className="text-muted-foreground text-lg">
            Download HTML reports with ALL graphs - Opens in browser & downloads automatically
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl p-6 shadow-lg text-white hover-elevate">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Participants</p>
                <p className="text-4xl font-bold">{stats.totalParticipants}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#07fbf8] to-[#0d7cff] rounded-xl p-6 shadow-lg text-white hover-elevate">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Events</p>
                <p className="text-4xl font-bold">{stats.totalEvents}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#c800ff] to-[#ff0080] rounded-xl p-6 shadow-lg text-white hover-elevate">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-1">Departments</p>
                <p className="text-4xl font-bold">{stats.totalDepartments}</p>
              </div>
              <Award className="w-12 h-12 text-pink-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00ff88] to-[#ffb800] rounded-xl p-6 shadow-lg text-white hover-elevate">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Avg. Events/Person</p>
                <p className="text-4xl font-bold">{stats.avgEventsPerParticipant}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl border border-card-border shadow-lg p-6 hover-elevate">
              <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Download Reports
              </h3>
              <div className="space-y-3">
                <button
                  onClick={downloadCSV}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active-elevate"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>

                <button
                  onClick={generateIndividualEventPDF}
                  disabled={generating || !selectedEvent}
                  className="w-full bg-gradient-to-r from-[#07fbf8] to-[#0d7cff] hover:from-[#07fbf8]/90 hover:to-[#0d7cff]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active-elevate text-sm"
                >
                  {generating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" /> Event HTML + 6 Graphs
                    </>
                  )}
                </button>

                <button
                  onClick={generateComprehensivePDF}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-[#c800ff] to-[#ff0080] hover:from-[#c800ff]/90 hover:to-[#ff0080]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active-elevate text-sm"
                >
                  {generating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Grid3X3 className="w-4 h-4" /> Full HTML + 6 Graphs
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-card-border shadow-lg p-6 hover-elevate">
              <label className="block text-foreground text-sm font-bold mb-3">Select Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-input border-2 border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-sm"
              >
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
              <div className="mt-4 p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-l-4 border-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Participants:</p>
                <p className="text-3xl font-bold text-accent">{participantsForEvent.length}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-card-border shadow-lg p-6 hover-elevate">
              <h3 className="text-lg font-bold mb-4 text-foreground">Department Summary</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.deptStats.map((dept, idx) => (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-border/50 hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                      <span className="font-semibold text-foreground text-sm">{dept.name}</span>
                    </div>
                    <span className="text-accent font-bold text-sm">{dept.participants}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Visualizations */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                Department Bar Chart
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={deptChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#07fbf8" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <YAxis stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="participants" fill="#07fbf8" radius={[8, 8, 0, 0]} name="Participants" />
                  <Bar dataKey="registrations" fill="#0d7cff" radius={[8, 8, 0, 0]} name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                Top Events Pie Chart
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie 
                    data={topEventData} 
                    dataKey="count" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={130} 
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} 
                    labelLine={{ stroke: '#07fbf8', strokeWidth: 2 }}
                  >
                    {topEventData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Event Registration Area Chart
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={eventData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#07fbf8" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#07fbf8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    style={{ fontSize: '12px', fontWeight: 700 }} 
                  />
                  <YAxis stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#07fbf8" 
                    fill="rgba(7, 251, 248, 0.3)" 
                    strokeWidth={3} 
                    name="Registrations" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                Event Trend Line Chart
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={eventData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#07fbf8" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#07fbf8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    style={{ fontSize: '12px', fontWeight: 700 }} 
                  />
                  <YAxis stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#07fbf8" 
                    strokeWidth={3} 
                    dot={{ fill: '#07fbf8', r: 5 }} 
                    activeDot={{ r: 8 }} 
                    name="Registrations" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                Department Radar Chart
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={deptChartData}>
                  <PolarGrid stroke="rgba(7, 251, 248, 0.2)" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    stroke="#07fbf8" 
                    style={{ fontSize: '12px', fontWeight: 700 }} 
                  />
                  <PolarRadiusAxis stroke="#07fbf8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                  <Radar 
                    name="Participants" 
                    dataKey="participants" 
                    stroke="#07fbf8" 
                    fill="rgba(7, 251, 248, 0.3)" 
                    strokeWidth={3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-card-border hover-elevate">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                Composed Chart (Bar + Line)
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={deptChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#07fbf8" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <YAxis stroke="#07fbf8" style={{ fontSize: '13px', fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 39, 0.95)', 
                      borderRadius: '8px', 
                      border: '2px solid #07fbf8', 
                      color: '#07fbf8', 
                      fontSize: '13px' 
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar 
                    dataKey="participants" 
                    fill="#07fbf8" 
                    radius={[8, 8, 0, 0]} 
                    name="Participants" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#ff0080" 
                    strokeWidth={3} 
                    name="Registrations" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
