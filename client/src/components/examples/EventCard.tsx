import EventCard from "../EventCard";
import scienceLabImage from "@assets/generated_images/Science_lab_experiment_event_b2686828.png";

export default function EventCardExample() {
  return (
    <div className="p-8 bg-background">
      <EventCard
        title="Quantum Computing Workshop"
        description="Hands-on workshop exploring quantum algorithms and their applications in modern computing."
        date="March 15, 2024"
        location="CS Lab, Block A"
        participants={120}
        category="Workshop"
        imageUrl={scienceLabImage}
      />
    </div>
  );
}
