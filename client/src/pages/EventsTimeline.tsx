import TimelineItem from "@/components/TimelineItem";

const events = [
  // NOVEMBER 10, 2025
  {
    title: "Greeting Card Making",
    description: "Art event for creative greeting card design.",
    date: "November 10, 2025",
    location: "B-614 & 613",
    status: "completed",
    position: "left",
  },
  {
    title: "Extempore",
    description: "Literary event featuring impromptu speeches.",
    date: "November 10, 2025",
    location: "Seminar Hall 2",
    status: "completed",
    position: "right",
  },
  // NOVEMBER 11, 2025
  {
    title: "Photography",
    description: "Art event capturing campus moments.",
    date: "November 11, 2025",
    location: "B-611",
    status: "completed",
    position: "left",
  },
  {
    title: "Debate (Prelims)",
    description: "Preliminary round of campus debate.",
    date: "November 11, 2025",
    location: "C-616 & 615",
    status: "completed",
    position: "right",
  },
  {
    title: "Short Film Making",
    description: "Theatre event for short film production.",
    date: "November 11, 2025",
    location: "B-614 & 613",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 12, 2025
  {
    title: "Pencil Sketching",
    description: "Art event for pencil sketch enthusiasts.",
    date: "November 12, 2025",
    location: "B-614 & 613",
    status: "completed",
    position: "right",
  },
  {
    title: "Air Crash",
    description: "Literary event simulating dramatic scenarios.",
    date: "November 12, 2025",
    location: "Seminar hall C block 6th floor",
    status: "completed",
    position: "left",
  },
  {
    title: "Western Singing (Solo)",
    description: "Solo singing of western music.",
    date: "November 12, 2025",
    location: "C-616",
    status: "completed",
    position: "right",
  },
  {
    title: "Rangoli Design",
    description: "Traditional art of rangoli design.",
    date: "November 12, 2025",
    location: "Nexus Commons",
    status: "completed",
    position: "left",
  },
  {
    title: "Dumb Charade",
    description: "Fun, fast-paced theatrical guessing game.",
    date: "November 12, 2025",
    location: "Seminar hall 1",
    status: "completed",
    position: "right",
  },
  {
    title: "Mono Acting",
    description: "Solo theatre performance.",
    date: "November 12, 2025",
    location: "Seminar hall 2",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 14, 2025
  {
    title: "Painting",
    description: "Live painting competition for artists.",
    date: "November 14, 2025",
    location: "B-611 & 610",
    status: "completed",
    position: "right",
  },
  {
    title: "Pot Pourri",
    description: "Mixed-literature quiz and games.",
    date: "November 14, 2025",
    location: "Seminar hall 1",
    status: "completed",
    position: "left",
  },
  {
    title: "Indian Folk & Film Singing (Solo)",
    description: "Solo performances of Indian folk and film songs.",
    date: "November 14, 2025",
    location: "C-616",
    status: "completed",
    position: "right",
  },
  {
    title: "Indian Classical Dance (Group)",
    description: "Group performance of classical Indian dance forms.",
    date: "November 14, 2025",
    location: "KEC AUDITORIUM",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 17, 2025
  {
    title: "Collage Making",
    description: "Art event for collaborative collage creation.",
    date: "November 17, 2025",
    location: "Seminar hall C block",
    status: "completed",
    position: "right",
  },
  {
    title: "Debate (Finals)",
    description: "Finals for campus debate championship.",
    date: "November 17, 2025",
    location: "Seminar hall B block 6th floor",
    status: "completed",
    position: "left",
  },
  {
    title: "Indian Duet",
    description: "Dance performance by Indian duet teams.",
    date: "November 17, 2025",
    location: "KEC AUDITORIUM",
    status: "completed",
    position: "right",
  },
  // NOVEMBER 18, 2025
  {
    title: "Pot Art",
    description: "Decorative art event using clay pots.",
    date: "November 18, 2025",
    location: "B-614 & 613",
    status: "completed",
    position: "left",
  },
  {
    title: "Quiz (Prelims)",
    description: "Preliminary round for the campus quiz competition.",
    date: "November 18, 2025",
    location: "Seminar hall 1",
    status: "completed",
    position: "right",
  },
  {
    title: "Mime",
    description: "Theatre event featuring silent performances.",
    date: "November 18, 2025",
    location: "Nexus Commons",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 19, 2025
  {
    title: "Mehandi Design",
    description: "Traditional mehandi (henna) design competition.",
    date: "November 19, 2025",
    location: "B-611 & 610",
    status: "completed",
    position: "right",
  },
  {
    title: "Creative Writing",
    description: "Literary event for creative story writing.",
    date: "November 19, 2025",
    location: "Seminar hall B block 6th floor",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 20, 2025
  {
    title: "Acoustic Music Group (Western)",
    description: "Group performances of acoustic western music.",
    date: "November 20, 2025",
    location: "Seminar hall 2",
    status: "completed",
    position: "right",
  },
  {
    title: "Street Theatre",
    description: "Outdoor theatre performances.",
    date: "November 20, 2025",
    location: "Peacock Circle",
    status: "completed",
    position: "left",
  },
  {
    title: "Digital Poster Making",
    description: "Digital art competition for poster creation.",
    date: "November 20, 2025",
    location: "B-611 & 610",
    status: "completed",
    position: "right",
  },
  {
    title: "Just a Minute (JAM)",
    description: "Test your quick thinking in a minute.",
    date: "November 20, 2025",
    location: "Seminar hall 1",
    status: "completed",
    position: "left",
  },
  {
    title: "Indian Dance Group (Non Theme - Film/Folk)",
    description: "Film and folk dance performances by groups.",
    date: "November 20, 2025",
    location: "Main Auditorium",
    status: "completed",
    position: "right",
  },
  // NOVEMBER 21, 2025
  {
    title: "Reel Making",
    description: "Creative event for making short reels.",
    date: "November 21, 2025",
    location: "B-611",
    status: "completed",
    position: "left",
  },
  {
    title: "Quiz (Finals)",
    description: "Final quiz round for top teams.",
    date: "November 21, 2025",
    location: "Seminar hall C block 6th floor",
    status: "completed",
    position: "right",
  },
  {
    title: "Dance Extravaganza",
    description: "Dance competition across styles and teams.",
    date: "November 21, 2025",
    location: "Turf",
    status: "completed",
    position: "left",
  },
  // NOVEMBER 22, 2025
  {
    title: "Battle of Bands (Western)",
    description: "Campus battle for western music bands.",
    date: "November 22, 2025",
    location: "Main Auditorium",
    status: "completed",
    position: "right",
  },
  {
    title: "Battle of Bands (Indian)",
    description: "Indian band music battle at campus fest.",
    date: "November 22, 2025",
    location: "Main Auditorium",
    status: "completed",
    position: "left",
  },
  {
    title: "Proscenium",
    description: "Stage drama competition for theatre teams.",
    date: "November 22, 2025",
    location: "KEC Auditorium",
    status: "completed",
    position: "right",
  },
];

export default function EventsTimeline() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Events Timeline</h1>
          <p className="text-muted-foreground">Schedule for Blossoms 2025-26</p>
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
