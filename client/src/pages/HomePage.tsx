import { useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import EventCard from "@/components/EventCard";
import { Users, Trophy, Calendar, Flame, ArrowRight, FileText } from "lucide-react";
import heroImage from "@assets/generated_images/University_campus_hero_image_4e7f28cd.png";

// List of all event objects - fill this fully with your events for accurate filtering
const allEvents = [
  {
    title: "Pencil Sketching",
    description: "Art event for pencil sketch enthusiasts.",
    date: "November 12, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    category: "Art",
    participants: 80,
  },
  // More event objects here...
];

// Utility to check if a date string matches today's date
function isToday(dateStr: string) {
  const today = new Date();
  const eventDate = new Date(dateStr);
  return (
    today.getFullYear() === eventDate.getFullYear() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getDate() === eventDate.getDate()
  );
}

// Filter events happening later today
function getTodaysUpcomingEvents(events: typeof allEvents) {
  const now = new Date();
  return events.filter(
    (evt) =>
      isToday(evt.date) && new Date(`${evt.date} ${evt.time} GMT+0530`) > now
  );
}

export default function HomePage() {
  const upcomingToday = useMemo(() => getTodaysUpcomingEvents(allEvents), []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="text-hero-title">
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
              <Button size="lg" variant="default" className="gap-2" data-testid="button-view-events">
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} value="2,500+" label="Total Participants" trend={{ value: 15, isPositive: true }} />
            <StatCard icon={Calendar} value="42" label="Events" trend={{ value: 8, isPositive: true }} />
            <StatCard icon={Trophy} value="5" label="Departments" />
            <StatCard icon={Flame} value="7" label="Days of Events" />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">Upcoming Highlights</h2>
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

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Quick Access</h2>
          <p className="text-muted-foreground mb-8">Explore different sections of the event</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { path: "/points", label: "Points Dashboard", desc: "View department rankings" },
              { path: "/timeline", label: "Events Timeline", desc: "Full event schedule" },
              { path: "/gallery", label: "Gallery", desc: "Event photos & videos" },
              { path: "/report", label: "Reports", desc: "Generate custom reports" },
            ].map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start gap-2 hover-elevate"
                  data-testid={`button-quick-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="font-semibold text-lg">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
