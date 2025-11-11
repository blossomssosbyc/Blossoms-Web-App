import TimelineItem from "@/components/TimelineItem";

const events = [
  {
    title: "Opening Ceremony",
    description: "Grand opening of Blossoms 2024 with keynote speeches from distinguished faculty and special guests.",
    date: "March 10, 2024",
    location: "Main Auditorium",
    status: "completed" as const,
    position: "left" as const,
  },
  {
    title: "Code Sprint Begins",
    description: "24-hour coding marathon featuring AI/ML challenges with real-world problem statements.",
    date: "March 11-12, 2024",
    location: "Innovation Center",
    status: "completed" as const,
    position: "right" as const,
  },
  {
    title: "Quantum Workshop",
    description: "Hands-on workshop on quantum computing fundamentals and applications led by IBM researchers.",
    date: "March 13, 2024",
    location: "CS Lab, Block A",
    status: "ongoing" as const,
    position: "left" as const,
  },
  {
    title: "Cultural Night",
    description: "Evening of performances showcasing talent from all departments with music, dance, and drama.",
    date: "March 14, 2024",
    location: "Outdoor Arena",
    status: "upcoming" as const,
    position: "right" as const,
  },
  {
    title: "Research Symposium",
    description: "Presentation of cutting-edge research papers by students and faculty across all science disciplines.",
    date: "March 15, 2024",
    location: "Conference Hall",
    status: "upcoming" as const,
    position: "left" as const,
  },
  {
    title: "Sports Tournament Finals",
    description: "Finals for cricket, basketball, and athletics competitions between departments.",
    date: "March 16, 2024",
    location: "Sports Complex",
    status: "upcoming" as const,
    position: "right" as const,
  },
  {
    title: "Science Exhibition",
    description: "Showcase of innovative projects from all departments with live demonstrations and judging.",
    date: "March 17, 2024",
    location: "Exhibition Hall",
    status: "upcoming" as const,
    position: "left" as const,
  },
  {
    title: "Closing Ceremony & Awards",
    description: "Grand finale with prize distribution, acknowledgments, and announcement of overall winners.",
    date: "March 18, 2024",
    location: "Main Auditorium",
    status: "upcoming" as const,
    position: "right" as const,
  },
];

export default function EventsTimeline() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Events Timeline</h1>
          <p className="text-muted-foreground">Complete schedule of Blossoms 2024</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
          
          <div className="space-y-0">
            {events.map((event, index) => (
              <TimelineItem key={index} {...event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
