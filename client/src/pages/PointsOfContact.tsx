import React from "react";
import { Mail, Phone } from "lucide-react";
import MagicBento, { ParticleCard } from "@/components/MagicBento";

type Person = {
  name?: string;
  role?: string;
  img?: string;
  email?: string;
  phone?: string;
};

const SWO_COORDINATORS: Person[] = [
  {
    name: "Nikhil T Sebastian",
    role: "SWO Coordinator",
    email: "nikhil.t@example.edu",
    phone: "+91-90000-00001",
  },
  {
    name: "Gunjeen Kaur",
    role: "SWO Coordinator",
    email: "gunjeen.k@example.edu",
    phone: "+91-90000-00002",
  },
  {
    name: "Sumanth SY",
    role: "SWO Coordinator",
    email: "sumanth.s@example.edu",
    phone: "+91-90000-00003",
  },
];

const SWO_HEADS: Person[] = [
  {
    name: "Tanushree Pembarthi",
    role: "SWO Head",
    email: "tanushree.p@example.edu",
    phone: "+91-90000-00011",
  },
  {
    name: "Brian",
    role: "SWO Head",
    email: "brian@example.edu",
    phone: "+91-90000-00012",
  },
  {
    name: "[Name unknown]",
    role: "SWO Head",
    email: "unknown@example.edu",
    phone: "+91-90000-00013",
  },
];

const FACULTY_REPRESENTATIVES: { school: string; reps: Person[] }[] = [
  {
    school: "School of Sciences",
    reps: [
      {
        name: "Dr. A. Example",
        role: "Faculty Representative",
        email: "dr.a@example.edu",
        phone: "+91-90000-00101",
      },
    ],
  },
  {
    school: "School of Psychological Sciences",
    reps: [
      {
        name: "Dr. B. Example",
        role: "Faculty Representative",
        email: "dr.b@example.edu",
        phone: "+91-90000-00102",
      },
    ],
  },
  {
    school: "School of Social Sciences",
    reps: [
      {
        name: "Dr. C. Example",
        role: "Faculty Representative",
        email: "dr.c@example.edu",
        phone: "+91-90000-00103",
      },
    ],
  },
  {
    school: "School of Business and Management",
    reps: [
      {
        name: "Dr. D. Example",
        role: "Faculty Representative",
        email: "dr.d@example.edu",
        phone: "+91-90000-00104",
      },
    ],
  },
  {
    school: "School of Commerce Finance and Accountancy",
    reps: [
      {
        name: "Dr. E. Example",
        role: "Faculty Representative",
        email: "dr.e@example.edu",
        phone: "+91-90000-00105",
      },
    ],
  },
];

const STUDENT_REPRESENTATIVES: { school: string; reps: Person[] }[] = [
  {
    school: "School of Sciences",
    reps: [
      {
        name: "Student Rep A",
        role: "Student Representative",
        email: "sci.rep@example.edu",
        phone: "+91-90000-00201",
      },
    ],
  },
  {
    school: "School of Psychological Sciences",
    reps: [
      {
        name: "Student Rep B",
        role: "Student Representative",
        email: "psy.rep@example.edu",
        phone: "+91-90000-00202",
      },
    ],
  },
  {
    school: "School of Social Sciences",
    reps: [
      {
        name: "Student Rep C",
        role: "Student Representative",
        email: "soc.rep@example.edu",
        phone: "+91-90000-00203",
      },
    ],
  },
  {
    school: "School of Business and Management",
    reps: [
      {
        name: "Student Rep D",
        role: "Student Representative",
        email: "bm.rep@example.edu",
        phone: "+91-90000-00204",
      },
    ],
  },
  {
    school: "School of Commerce Finance and Accountancy",
    reps: [
      {
        name: "Student Rep E",
        role: "Student Representative",
        email: "cfa.rep@example.edu",
        phone: "+91-90000-00205",
      },
    ],
  },
];

export default function PointsOfContact() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Points of Contact
          </h1>
          <p className="mt-2 text-white/70">Key people for Blossoms 2025-26</p>
        </header>

        {/* SWO Coordinators */}
        <section data-reveal className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full" />
            SWO Coordinators
          </h2>

          <MagicBento enableStars enableSpotlight enableBorderGlow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
            >
              {SWO_COORDINATORS.map((p, idx) => (
                <ParticleCard
                  key={p.name || `coord-${idx}`}
                  className="card card--border-glow"
                  style={{ padding: "1.5rem", borderRadius: "0.75rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {/* Designation - Most Visible */}
                    <div
                      style={{
                        color: "#FFD166",
                        fontSize: "1.18rem",
                        fontWeight: 800,
                        textShadow: "0 4px 14px rgba(0,0,0,0.6)",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {p.role || "— Designation —"}
                    </div>

                    {/* Photo + Name Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.875rem",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        Photo
                      </div>
                      <div style={{ color: "white", fontWeight: "bold" }}>
                        {p.name || "— Name —"}
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {p.email || "email@example.edu"}
                    </div>

                    {/* Phone */}
                    <div
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {p.phone || "+91-00000-00000"}
                    </div>
                  </div>
                </ParticleCard>
              ))}
            </div>
          </MagicBento>
        </section>

        {/* SWO Heads */}
        <section data-reveal className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
            SWO Heads
          </h2>

          <MagicBento enableBorderGlow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
            >
              {SWO_HEADS.map((p, idx) => (
                <ParticleCard
                  key={p.name || `head-${idx}`}
                  className="card card--border-glow"
                  style={{ padding: "1.5rem", borderRadius: "0.75rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {/* Designation - Most Visible */}
                    <div
                      style={{
                        color: "#FFD166",
                        fontSize: "1.18rem",
                        fontWeight: 800,
                        textShadow: "0 4px 14px rgba(0,0,0,0.6)",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {p.role || "— Designation —"}
                    </div>

                    {/* Photo + Name Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.875rem",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        Photo
                      </div>
                      <div style={{ color: "white", fontWeight: "bold" }}>
                        {p.name || "— Name —"}
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {p.email || "email@example.edu"}
                    </div>

                    {/* Phone */}
                    <div
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {p.phone || "+91-00000-00000"}
                    </div>
                  </div>
                </ParticleCard>
              ))}
            </div>
          </MagicBento>
        </section>

        {/* Faculty Representatives */}
        <section data-reveal className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
            Blossoms Faculty Representatives
          </h2>

          <MagicBento enableBorderGlow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
              }}
            >
              {FACULTY_REPRESENTATIVES.flatMap((group) =>
                group.reps.map((r, idx) => (
                  <ParticleCard
                    key={`${group.school}-${r.name || idx}`}
                    className="card card--border-glow"
                    style={{ padding: "1.5rem", borderRadius: "0.75rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {/* Designation + School - Most Visible */}
                      <div
                        style={{
                          color: "#FFD166",
                          fontSize: "1.18rem",
                          fontWeight: 800,
                          textShadow: "0 4px 14px rgba(0,0,0,0.6)",
                          letterSpacing: "0.2px",
                        }}
                      >
                        {(r.role || "Faculty Representative") +
                          " • " +
                          group.school}
                      </div>

                      {/* Photo + Name Row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.875rem",
                            minWidth: "60px",
                            textAlign: "center",
                          }}
                        >
                          Photo
                        </div>
                        <div style={{ color: "white", fontWeight: "bold" }}>
                          {r.name || "— Name —"}
                        </div>
                      </div>

                      {/* Email */}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {r.email || "email@example.edu"}
                      </div>

                      {/* Phone */}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {r.phone || "+91-00000-00000"}
                      </div>
                    </div>
                  </ParticleCard>
                ))
              )}
            </div>
          </MagicBento>
        </section>

        {/* Student Representatives */}
        <section data-reveal className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
            Blossoms Student Representatives
          </h2>

          <MagicBento enableBorderGlow>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {STUDENT_REPRESENTATIVES.flatMap((group) =>
                group.reps.map((r, idx) => (
                  <ParticleCard
                    key={`${group.school}-${r.name || idx}`}
                    className="card card--border-glow"
                    style={{ padding: "1.5rem", borderRadius: "0.75rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {/* Designation + School - Most Visible */}
                      <div
                        style={{
                          color: "#FFD166",
                          fontSize: "1.18rem",
                          fontWeight: 800,
                          textShadow: "0 4px 14px rgba(0,0,0,0.6)",
                          letterSpacing: "0.2px",
                        }}
                      >
                        {(r.role || "Student Representative") +
                          " • " +
                          group.school}
                      </div>

                      {/* Photo + Name Row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.875rem",
                            minWidth: "60px",
                            textAlign: "center",
                          }}
                        >
                          Photo
                        </div>
                        <div style={{ color: "white", fontWeight: "bold" }}>
                          {r.name || "— Name —"}
                        </div>
                      </div>

                      {/* Email */}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {r.email || "email@example.edu"}
                      </div>

                      {/* Phone */}
                      <div
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {r.phone || "+91-00000-00000"}
                      </div>
                    </div>
                  </ParticleCard>
                ))
              )}
            </div>
          </MagicBento>
        </section>
      </div>
    </div>
  );
}
