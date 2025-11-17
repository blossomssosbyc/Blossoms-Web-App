import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

type TimelineItemProps = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "completed" | "ongoing" | "upcoming";
  position: "left" | "right";
  highlighted?: boolean;
};

export default function TimelineItem({
  title,
  description,
  date,
  time,
  location,
  status,
  position,
  highlighted = false,
}: TimelineItemProps) {
  const statusConfig = {
    completed: { icon: CheckCircle2, label: "Completed" },
    ongoing: { icon: Clock, label: "Ongoing" },
    upcoming: { icon: Clock, label: "Upcoming" },
  };
  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-8 mb-12 ${position === "right" ? "flex-row-reverse" : ""}`}
    >
      <Card
        className={`flex-1 p-6 hover-elevate transition-all ${status === "completed" ? "opacity-80" : ""}`}
        style={{
          transform: highlighted ? "scale(1.1)" : "scale(1)",
          zIndex: highlighted ? 10 : 1,
          boxShadow: highlighted ? "0 10px 30px rgba(0,0,0,0.22)" : "none",
          borderRadius: highlighted ? "0.75rem" : "",
          background: highlighted ? "rgba(255,255,255,0.11)" : "",
          outline: highlighted ? "2px solid #7c3aed" : "none",
          transition:
            "transform 0.28s cubic-bezier(.16,1,.3,1),box-shadow 0.28s,background 0.28s,border-radius 0.28s,outline 0.28s",
        }}
        data-testid={`timeline-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant={status === "ongoing" ? "default" : "secondary"}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">
            {date} {time}
          </span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </Card>
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${status === "ongoing" ? "bg-primary ring-4 ring-primary/20" : "bg-border"}`}
        />
      </div>
      <div className="flex-1" />
    </div>
  );
}
