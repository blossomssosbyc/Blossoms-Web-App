import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface TimelineItemProps {
  title: string;
  description: string;
  date: string;
  location: string;
  status: "completed" | "ongoing" | "upcoming";
  position: "left" | "right";
}

export default function TimelineItem({ title, description, date, location, status, position }: TimelineItemProps) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-green-600 dark:text-green-400", label: "Completed" },
    ongoing: { icon: Clock, color: "text-primary", label: "Ongoing" },
    upcoming: { icon: Clock, color: "text-muted-foreground", label: "Upcoming" },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`flex items-center gap-8 mb-12 ${position === "right" ? "flex-row-reverse" : ""}`}>
      <Card 
        className={`flex-1 p-6 hover-elevate transition-all ${status === "completed" ? "opacity-80" : ""}`}
        data-testid={`timeline-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant={status === "ongoing" ? "default" : "secondary"}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{date}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </Card>

      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${status === "ongoing" ? "bg-primary ring-4 ring-primary/20" : "bg-border"}`} />
      </div>

      <div className="flex-1" />
    </div>
  );
}
