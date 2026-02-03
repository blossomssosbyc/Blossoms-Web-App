import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, MapPin, Clock, Users, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TimelineItem from "@/components/TimelineItem";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "Greeting Card Making",
    description: "Art event for creative greeting card design.",
    date: "November 10, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    position: "left",
  },
  {
    title: "Extempore",
    description: "Literary event featuring impromptu speeches.",
    date: "November 10, 2025",
    time: "4:30 PM",
    location: "Seminar Hall 2",
    position: "right",
  },
  {
    title: "Photography",
    description: "Art event capturing campus moments.",
    date: "November 11, 2025",
    time: "4:30 PM",
    location: "B-611",
    position: "left",
  },
  {
    title: "Debate (Prelims)",
    description: "Preliminary round of campus debate.",
    date: "November 11, 2025",
    time: "4:30 PM",
    location: "C-616 & 615",
    position: "right",
  },
  {
    title: "Short Film Making",
    description: "Theatre event for short film production.",
    date: "November 11, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    position: "left",
  },
  {
    title: "Pencil Sketching",
    description: "Art event for pencil sketch enthusiasts.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    position: "right",
  },
  {
    title: "Air Crash",
    description: "Literary event simulating dramatic scenarios.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "Seminar hall C block 6th floor",
    position: "left",
  },
  {
    title: "Western Singing (Solo)",
    description: "Solo singing of western music.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "C-616",
    position: "right",
  },
  {
    title: "Rangoli Design",
    description: "Traditional art of rangoli design.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "Nexus Commons",
    position: "left",
  },
  {
    title: "Dumb Charade",
    description: "Fun, fast-paced theatrical guessing game.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "Seminar hall 1",
    position: "right",
  },
  {
    title: "Mono Acting",
    description: "Solo theatre performance.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "Seminar hall 2",
    position: "left",
  },
  {
    title: "Painting",
    description: "Live painting competition for artists.",
    date: "November 14, 2025",
    time: "4:30 PM",
    location: "B-611 & 610",
    position: "right",
  },
  {
    title: "Pot Pourri",
    description: "Mixed-literature quiz and games.",
    date: "November 14, 2025",
    time: "4:30 PM",
    location: "Seminar hall 1",
    position: "left",
  },
  {
    title: "Indian Folk & Film Singing (Solo)",
    description: "Solo performances of Indian folk and film songs.",
    date: "November 14, 2025",
    time: "4:30 PM",
    location: "C-616",
    position: "right",
  },
  {
    title: "Indian Classical Dance (Group)",
    description: "Group performance of classical Indian dance forms.",
    date: "November 14, 2025",
    time: "4:30 PM",
    location: "KEC AUDITORIUM",
    position: "left",
  },
  {
    title: "Collage Making",
    description: "Art event for collaborative collage creation.",
    date: "November 17, 2025",
    time: "4:30 PM",
    location: "Seminar hall C block",
    position: "right",
  },
  {
    title: "Debate (Finals)",
    description: "Finals for campus debate championship.",
    date: "November 17, 2025",
    time: "4:30 PM",
    location: "Seminar hall B block 6th floor",
    position: "left",
  },
  {
    title: "Indian Duet",
    description: "Dance performance by Indian duet teams.",
    date: "November 17, 2025",
    time: "4:30 PM",
    location: "KEC AUDITORIUM",
    position: "right",
  },
  {
    title: "Pot Art",
    description: "Decorative art event using clay pots.",
    date: "November 18, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    position: "left",
  },
  {
    title: "Quiz (Prelims)",
    description: "Preliminary round for the campus quiz competition.",
    date: "November 18, 2025",
    time: "4:30 PM",
    location: "Seminar hall 1",
    position: "right",
  },
  {
    title: "Mime",
    description: "Theatre event featuring silent performances.",
    date: "November 18, 2025",
    time: "4:30 PM",
    location: "Nexus Commons",
    position: "left",
  },
  {
    title: "Mehandi Design",
    description: "Traditional mehandi (henna) design competition.",
    date: "November 19, 2025",
    time: "4:30 PM",
    location: "B-611 & 610",
    position: "right",
  },
  {
    title: "Creative Writing",
    description: "Literary event for creative story writing.",
    date: "November 19, 2025",
    time: "4:30 PM",
    location: "Seminar hall B block 6th floor",
    position: "left",
  },
  {
    title: "Acoustic Music Group (Western)",
    description: "Group performances of acoustic western music.",
    date: "November 20, 2025",
    time: "4:30 PM",
    location: "Seminar hall 2",
    position: "right",
  },
  {
    title: "Street Theatre",
    description: "Outdoor theatre performances.",
    date: "November 20, 2025",
    time: "4:30 PM",
    location: "Peacock Circle",
    position: "left",
  },
  {
    title: "Digital Poster Making",
    description: "Digital art competition for poster creation.",
    date: "November 20, 2025",
    time: "4:30 PM",
    location: "B-611 & 610",
    position: "right",
  },
  {
    title: "Just a Minute (JAM)",
    description: "Test your quick thinking in a minute.",
    date: "November 20, 2025",
    time: "4:30 PM",
    location: "Seminar hall 1",
    position: "left",
  },
  {
    title: "Indian Dance Group (Non Theme - Film/Folk)",
    description: "Film and folk dance performances by groups.",
    date: "November 20, 2025",
    time: "4:30 PM",
    location: "Main Auditorium",
    position: "right",
  },
  {
    title: "Reel Making",
    description: "Creative event for making short reels.",
    date: "November 21, 2025",
    time: "4:30 PM",
    location: "B-611",
    position: "left",
  },
  {
    title: "Quiz (Finals)",
    description: "Final quiz round for top teams.",
    date: "November 21, 2025",
    time: "4:30 PM",
    location: "Seminar hall C block 6th floor",
    position: "right",
  },
  {
    title: "Dance Extravaganza",
    description: "Dance competition across styles and teams.",
    date: "November 21, 2025",
    time: "4:30 PM",
    location: "Turf",
    position: "left",
  },
  {
    title: "Battle of Bands (Western)",
    description: "Campus battle for western music bands.",
    date: "November 22, 2025",
    time: "1:30 PM",
    location: "Main Auditorium",
    position: "right",
  },
  {
    title: "Battle of Bands (Indian)",
    description: "Indian band music battle at campus fest.",
    date: "November 22, 2025",
    time: "3:30 PM",
    location: "Main Auditorium",
    position: "left",
  },
  {
    title: "Proscenium",
    description: "Stage drama competition for theatre teams.",
    date: "November 22, 2025",
    time: "12:00 PM",
    location: "KEC Auditorium",
    position: "right",
  },
];

function eventDateTime(event: { date: string; time: string }) {
  return new Date(`${event.date} ${event.time} GMT+0530`);
}

function getStatus(event: {
  date: string;
  time: string;
}): "completed" | "ongoing" | "upcoming" {
  const now = new Date();
  const start = eventDateTime(event);
  const end = new Date(start.getTime() + 90 * 60000);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "completed";
}

export default function EventsTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/winners")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setWinners(data);
        } else {
          console.error("Expected array for winners, got:", data);
          setWinners([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching winners:", err);
        setWinners([]);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    const index = events.findIndex((event) => {
      const start = eventDateTime(event);
      const end = new Date(start.getTime() + 90 * 60000);
      return (now >= start && now <= end) || now < start;
    });
    if (index !== -1 && eventRefs.current[index]) {
      eventRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  // Fade in animations for header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll(".header-element"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, []);

  // Scroll trigger animations for timeline items
  useEffect(() => {
    eventRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: ref,
              start: "top 80%",
              end: "top 50%",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedEvent]);

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-15 animate-pulse" />
        <div
          className="absolute bottom-40 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-20 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900/5 to-black pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div ref={headerRef} className="mb-16">
          <div className="header-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="text-xs font-medium text-purple-300">
              EVENT TIMELINE
            </span>
          </div>
          <h1 className="header-element text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Events Timeline
          </h1>
          <p className="header-element text-lg md:text-xl text-gray-300">
            Complete schedule for Blossoms 2025-26
          </p>
        </div>

        {/* Timeline Section */}
        <div ref={timelineRef} className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent hidden lg:block" />
          <div className="space-y-8 md:space-y-12">
            {events.map((event, index) => (
              <div
                key={index}
                ref={(el) => (eventRefs.current[index] = el)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <TimelineItem
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  status={getStatus(event)}
                  position={event.position as "left" | "right"}
                  highlighted={hoveredIndex === index}
                  onClick={() => setSelectedEvent(event)}
                  hasWinners={Array.isArray(winners) && winners.some((w) => w.event.toLowerCase() === event.title.toLowerCase())}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Starry Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Starry Background Effect */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
                {/* CSS Stars */}
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      opacity: Math.random() * 0.7 + 0.3,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1">
                        {selectedEvent.date}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 px-3 py-1">
                        {selectedEvent.time}
                      </Badge>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-4">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-2 text-purple-300">
                        <MapPin className="w-5 h-5" />
                        <span className="font-semibold">Location</span>
                      </div>
                      <p className="text-white text-lg">{selectedEvent.location}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-2 text-blue-300">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Duration</span>
                      </div>
                      <p className="text-white text-lg">90 Minutes</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-2 text-pink-300">
                        <Trophy className="w-5 h-5" />
                        <span className="font-semibold">Type</span>
                      </div>
                      <p className="text-white text-lg">Competition</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Open to all departments</span>
                    </div>
                    <div className="italic">
                      * Schedule subject to change
                    </div>
                  </div>

                  {/* Winners Section */}
                  {winners.filter((w) => w.event.toLowerCase() === selectedEvent.title.toLowerCase()).length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                          <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Winners</h3>
                      </div>

                      <div className="grid gap-3">
                        {winners
                          .filter((w) => w.event.toLowerCase() === selectedEvent.title.toLowerCase())
                          .map((winner, idx) => {
                            const pos = winner.position.toUpperCase();
                            const isFirst = pos === "FIRST" || pos === "1ST";
                            const isSecond = pos === "SECOND" || pos === "2ND";

                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all ${isFirst
                                    ? "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20"
                                    : isSecond
                                      ? "bg-white/5 border-white/10"
                                      : "bg-white/5 border-white/5"
                                  }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isFirst
                                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                                      : isSecond
                                        ? "bg-gray-300 text-black"
                                        : "bg-orange-700 text-white"
                                    }`}>
                                    {isFirst ? "1" : isSecond ? "2" : "3"}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{winner.team}</p>
                                    <p className="text-xs text-white/60">{winner.school}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs font-bold px-2 py-1 rounded bg-white/10 ${isFirst ? "text-yellow-200" : "text-white/70"
                                    }`}>
                                    {winner.position}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none z-0" />
    </div>
  );
}
