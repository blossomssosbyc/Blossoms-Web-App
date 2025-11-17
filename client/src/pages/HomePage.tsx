import React, { useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import EventCard from "@/components/EventCard";
import {
  Users,
  Trophy,
  Calendar,
  Flame,
  ArrowRight,
  FileText,
} from "lucide-react";
import heroImage from "@assets/generated_images/University_campus_hero_image_4e7f28cd.png";

// Full list of all scheduled events
const allEvents = [
  { title: "Greeting Card Making", description: "Art event for creative greeting card design.", date: "November 10, 2025", time: "4:30 PM", location: "B-614 & 613", category: "Art", participants: 50 },
  { title: "Extempore", description: "Impromptu speeches event", date: "November 10, 2025", time: "4:30 PM", location: "Seminar Hall 2", category: "Literature", participants: 40 },
  { title: "Photography", description: "Art event capturing campus moments", date: "November 11, 2025", time: "4:30 PM", location: "B-611", category: "Art", participants: 55 },
  { title: "Debate (Prelims)", description: "Preliminary debate round", date: "November 11, 2025", time: "4:30 PM", location: "C-616 & 615", category: "Literature", participants: 60 },
  { title: "Short Film Making", description: "Theatre short film event", date: "November 11, 2025", time: "4:30 PM", location: "B-614 & 613", category: "Theatre", participants: 45 },
  { title: "Pencil Sketching", description: "Pencil sketching art event", date: "November 12, 2025", time: "4:30 PM", location: "B-614 & 613", category: "Art", participants: 50 },
  { title: "Air Crash", description: "Literary simulation", date: "November 12, 2025", time: "4:30 PM", location: "Seminar hall C block 6th floor", category: "Literature", participants: 30 },
  { title: "Western Singing (Solo)", description: "Solo western singing", date: "November 12, 2025", time: "4:30 PM", location: "C-616", category: "Music", participants: 40 },
  { title: "Rangoli Design", description: "Traditional rangoli art", date: "November 12, 2025", time: "4:30 PM", location: "Nexus Commons", category: "Art", participants: 30 },
  { title: "Dumb Charade", description: "Theatre guessing game", date: "November 12, 2025", time: "4:30 PM", location: "Seminar hall 1", category: "Theatre", participants: 35 },
  { title: "Mono Acting", description: "Solo acting event", date: "November 12, 2025", time: "4:30 PM", location: "Seminar hall 2", category: "Theatre", participants: 25 },
  { title: "Painting", description: "Live painting competition", date: "November 14, 2025", time: "4:30 PM", location: "B-611 & 610", category: "Art", participants: 60 },
  { title: "Pot Pourri", description: "Literature quiz & games", date: "November 14, 2025", time: "4:30 PM", location: "Seminar hall 1", category: "Literature", participants: 40 },
  { title: "Indian Folk & Film Singing (Solo)", description: "Solo folk/film singing", date: "November 14, 2025", time: "4:30 PM", location: "C-616", category: "Music", participants: 30 },
  { title: "Indian Classical Dance (Group)", description: "Classical dance performance", date: "November 14, 2025", time: "4:30 PM", location: "KEC AUDITORIUM", category: "Dance", participants: 45 },
  { title: "Collage Making", description: "Art event for collaborative collage creation.", date: "November 17, 2025", time: "4:30 PM", location: "Seminar hall C block", category: "Art", participants: 40 },
  { title: "Debate (Finals)", description: "Finals for campus debate championship.", date: "November 17, 2025", time: "4:30 PM", location: "Seminar hall B block 6th floor", category: "Literature", participants: 55 },
  { title: "Indian Duet", description: "Dance performance by Indian duet teams.", date: "November 17, 2025", time: "4:30 PM", location: "KEC AUDITORIUM", category: "Dance", participants: 37 },
  { title: "Pot Art", description: "Decorative art event using clay pots.", date: "November 18, 2025", time: "4:30 PM", location: "B-614 & 613", category: "Art", participants: 35 },
  { title: "Quiz (Prelims)", description: "Preliminary round for the campus quiz competition.", date: "November 18, 2025", time: "4:30 PM", location: "Seminar hall 1", category: "Literature", participants: 35 },
  { title: "Mime", description: "Theatre event featuring silent performances.", date: "November 18, 2025", time: "4:30 PM", location: "Nexus Commons", category: "Theatre", participants: 40 },
  { title: "Mehandi Design", description: "Traditional mehandi (henna) design competition.", date: "November 19, 2025", time: "4:30 PM", location: "B-611 & 610", category: "Art", participants: 35 },
  { title: "Creative Writing", description: "Literary event for creative story writing.", date: "November 19, 2025", time: "4:30 PM", location: "Seminar hall B block 6th floor", category: "Literature", participants: 38 },
  { title: "Acoustic Music Group (Western)", description: "Group performances of acoustic western music.", date: "November 20, 2025", time: "4:30 PM", location: "Seminar hall 2", category: "Music", participants: 25 },
  { title: "Street Theatre", description: "Outdoor theatre performances.", date: "November 20, 2025", time: "4:30 PM", location: "Peacock Circle", category: "Theatre", participants: 49 },
  { title: "Digital Poster Making", description: "Digital art competition for poster creation.", date: "November 20, 2025", time: "4:30 PM", location: "B-611 & 610", category: "Art", participants: 32 },
  { title: "Just a Minute (JAM)", description: "Test your quick thinking in a minute.", date: "November 20, 2025", time: "4:30 PM", location: "Seminar hall 1", category: "Literature", participants: 27 },
  { title: "Indian Dance Group (Non Theme - Film/Folk)", description: "Film and folk dance performances by groups.", date: "November 20, 2025", time: "4:30 PM", location: "Main Auditorium", category: "Dance", participants: 44 },
  { title: "Reel Making", description: "Creative event for making short reels.", date: "November 21, 2025", time: "4:30 PM", location: "B-611", category: "Art", participants: 50 },
  { title: "Quiz (Finals)", description: "Final quiz round for top teams.", date: "November 21, 2025", time: "4:30 PM", location: "Seminar hall C block 6th floor", category: "Literature", participants: 36 },
  { title: "Dance Extravaganza", description: "Dance competition across styles and teams.", date: "November 21, 2025", time: "4:30 PM", location: "Turf", category: "Dance", participants: 40 },
  { title: "Battle of Bands (Western)", description: "Campus battle for western music bands.", date: "November 22, 2025", time: "1:30 PM", location: "Main Auditorium", category: "Music", participants: 29 },
  { title: "Battle of Bands (Indian)", description: "Indian band music battle at campus fest.", date: "November 22, 2025", time: "3:30 PM", location: "Main Auditorium", category: "Music", participants: 28 },
  { title: "Proscenium", description: "Stage drama competition for theatre teams.", date: "November 22, 2025", time: "12:00 PM", location: "KEC Auditorium", category: "Theatre", participants: 25 },
]


function isToday(dateStr: string) {
  const today = new Date();
  const eventDate = new Date(dateStr);
  return (
    today.getFullYear() === eventDate.getFullYear() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getDate() === eventDate.getDate()
  );
}

function getTodaysUpcomingEvents(events: typeof allEvents) {
  const now = new Date();
  return events
    .filter(
      (evt) =>
        isToday(evt.date) && new Date(`${evt.date} ${evt.time} GMT+0530`) > now,
    )
    .sort((a, b) =>
      new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`)
        ? 1
        : -1,
    );
}

export default function HomePage() {
  const upcomingToday = useMemo(() => getTodaysUpcomingEvents(allEvents), []);
  const upcomingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (upcomingToday.length > 0 && upcomingSectionRef.current) {
      upcomingSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [upcomingToday]);

  return (
    <div className="min-h-screen fade-in-on-load">
      <section
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            style={{
              fontFamily: "'Raleway', sans-serif",
              textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
              letterSpacing: "-0.02em",
              transform: "scale(1.02)",
              transition: "transform 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            data-testid="text-hero-title"
          >
            Blossoms 2025-26
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90">
            Christ University Yeshwanthpur
          </p>
          <p className="text-lg md:text-xl mb-8 text-white/80">
            School of Sciences
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/timeline">
              <Button
                size="lg"
                variant="default"
                className="gap-2"
                data-testid="button-view-events"
              >
                View Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/report">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 backdrop-blur-md bg-white/20 border-2 border-white/40 text-white hover:bg-white/30"
                data-testid="button-generate-report"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              value="2,500+"
              label="Total Participants"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              icon={Calendar}
              value="35"
              label="Events"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard icon={Trophy} value="2" label="Departments" />
            <StatCard icon={Flame} value="10" label="Days of Events" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card" ref={upcomingSectionRef}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">
            Upcoming Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingToday.length > 0 ? (
              upcomingToday.map((event, i) => (
                <EventCard
                  key={i}
                  title={event.title}
                  description={event.description}
                  date={`${event.date}, ${event.time}`}
                  location={event.location}
                  participants={event.participants}
                  category={event.category}
                />
              ))
            ) : (
              <div className="col-span-3 text-lg text-muted-foreground text-center py-12">
                No upcoming events today!
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Quick Access
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore different sections of the event
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                path: "/points",
                label: "Points Dashboard",
                desc: "View department rankings",
              },
              {
                path: "/timeline",
                label: "Events Timeline",
                desc: "Full event schedule",
              },
              {
                path: "/gallery",
                label: "Gallery",
                desc: "Event photos & videos",
              },
              {
                path: "/report",
                label: "Reports",
                desc: "Generate custom reports",
              },
            ].map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start gap-2 hover-elevate"
                  data-testid={`button-quick-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span className="font-semibold text-lg">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.desc}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
