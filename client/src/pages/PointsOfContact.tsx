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

          <MagicBento enableStars enableBorderGlow>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SWO_COORDINATORS.map((p, idx) => (
                <ParticleCard
                  key={p.name || `coord-${idx}`}
                  className="card card--border-glow p-10 rounded-3xl min-h-[200px]"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-white/6 flex items-center justify-center text-white/70 text-base font-semibold">
                        Photo
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-semibold text-white">
                        {p.name || "— Name —"}
                      </div>
                      <div className="text-sm text-white/60">
                        {p.role || "— Designation —"}
                      </div>
                      <div className="flex flex-col gap-1 mt-4 text-sm">
                        {p.email ? (
                          <a
                            href={`mailto:${p.email}`}
                            className="flex items-center gap-3 text-white/70 hover:text-white"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="break-all">{p.email}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-white/40">
                            <Mail className="w-4 h-4" />
                            <span>email@example.edu</span>
                          </div>
                        )}

                        {p.phone ? (
                          <a
                            href={`tel:${p.phone}`}
                            className="flex items-center gap-3 text-white/70 hover:text-white"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{p.phone}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-white/40">
                            <Phone className="w-4 h-4" />
                            <span>+91-00000-00000</span>
                          </div>
                        )}
                      </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SWO_HEADS.map((p, idx) => (
                <ParticleCard
                  key={p.name || `head-${idx}`}
                  className="card card--border-glow p-10 rounded-3xl min-h-[200px]"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-white/6 flex items-center justify-center text-white/70 text-base font-semibold">
                        Photo
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-semibold text-white">
                        {p.name || "— Name —"}
                      </div>
                      <div className="text-sm text-white/60">
                        {p.role || "— Designation —"}
                      </div>
                      <div className="flex flex-col gap-1 mt-4 text-sm">
                        {p.email ? (
                          <a
                            href={`mailto:${p.email}`}
                            className="flex items-center gap-3 text-white/70 hover:text-white"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="break-all">{p.email}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-white/40">
                            <Mail className="w-4 h-4" />
                            <span>email@example.edu</span>
                          </div>
                        )}

                        {p.phone ? (
                          <a
                            href={`tel:${p.phone}`}
                            className="flex items-center gap-3 text-white/70 hover:text-white"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{p.phone}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-white/40">
                            <Phone className="w-4 h-4" />
                            <span>+91-00000-00000</span>
                          </div>
                        )}
                      </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FACULTY_REPRESENTATIVES.flatMap((group) =>
                group.reps.map((r, idx) => (
                  <ParticleCard
                    key={`${group.school}-${r.name || idx}`}
                    className="card card--border-glow p-10 rounded-3xl min-h-[200px]"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-white/6 flex items-center justify-center text-white/70 text-base font-semibold">
                          Photo
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-semibold text-white">
                          {r.name || "— Name —"}
                        </div>
                        <div className="text-sm text-white/60">
                          {(r.role || "Faculty Representative") +
                            " • " +
                            group.school}
                        </div>
                        <div className="flex flex-col gap-1 mt-4 text-sm">
                          {r.email ? (
                            <a
                              href={`mailto:${r.email}`}
                              className="flex items-center gap-3 text-white/70 hover:text-white"
                            >
                              <Mail className="w-4 h-4" />
                              <span className="break-all">{r.email}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-3 text-white/40">
                              <Mail className="w-4 h-4" />
                              <span>email@example.edu</span>
                            </div>
                          )}

                          {r.phone ? (
                            <a
                              href={`tel:${r.phone}`}
                              className="flex items-center gap-3 text-white/70 hover:text-white"
                            >
                              <Phone className="w-4 h-4" />
                              <span>{r.phone}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-3 text-white/40">
                              <Phone className="w-4 h-4" />
                              <span>+91-00000-00000</span>
                            </div>
                          )}
                        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {STUDENT_REPRESENTATIVES.flatMap((group) =>
                group.reps.map((r, idx) => (
                  <ParticleCard
                    key={`${group.school}-${r.name || idx}`}
                    className="card card--border-glow p-10 rounded-3xl min-h-[200px]"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-white/6 flex items-center justify-center text-white/70 text-base font-semibold">
                          Photo
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-semibold text-white">
                          {r.name || "— Name —"}
                        </div>
                        <div className="text-sm text-white/60">
                          {(r.role || "Student Representative") +
                            " • " +
                            group.school}
                        </div>
                        <div className="flex flex-col gap-1 mt-4 text-sm">
                          {r.email ? (
                            <a
                              href={`mailto:${r.email}`}
                              className="flex items-center gap-3 text-white/70 hover:text-white"
                            >
                              <Mail className="w-4 h-4" />
                              <span className="break-all">{r.email}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-3 text-white/40">
                              <Mail className="w-4 h-4" />
                              <span>email@example.edu</span>
                            </div>
                          )}

                          {r.phone ? (
                            <a
                              href={`tel:${r.phone}`}
                              className="flex items-center gap-3 text-white/70 hover:text-white"
                            >
                              <Phone className="w-4 h-4" />
                              <span>{r.phone}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-3 text-white/40">
                              <Phone className="w-4 h-4" />
                              <span>+91-00000-00000</span>
                            </div>
                          )}
                        </div>
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
