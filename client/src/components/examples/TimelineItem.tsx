import TimelineItem from "../TimelineItem";

export default function TimelineItemExample() {
  return (
    <div className="p-8 bg-background">
      <TimelineItem
        title="Quantum Computing Workshop"
        description="Hands-on workshop on quantum computing fundamentals led by IBM researchers."
        date="March 13, 2024"
        location="CS Lab, Block A"
        status="ongoing"
        position="left"
      />
    </div>
  );
}
