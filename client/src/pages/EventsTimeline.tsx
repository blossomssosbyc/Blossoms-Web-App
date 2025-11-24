import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none z-0" />
    </div>
  );
}
