import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  Trophy,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  onClick,
}: TimelineItemProps & { onClick?: () => void }) {
  const statusConfig = {
    completed: { icon: CheckCircle2, label: "Completed" },
    ongoing: { icon: Clock, label: "Ongoing" },
    upcoming: { icon: Clock, label: "Upcoming" },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div
      className={`flex items-center gap-8 mb-12 ${
        position === "right" ? "flex-row-reverse" : ""
      } relative`}
      style={{ position: "relative" }}
    >
      <Card
        className="flex-1 p-6 hover-elevate transition-all cursor-pointer"
        onClick={onClick}
        style={{
          opacity: status === "completed" ? 0.8 : 1,
          transform: highlighted ? "scale(1.05)" : "scale(1)",
          zIndex: highlighted ? 10 : 1,
          boxShadow: highlighted
            ? "0 20px 50px rgba(124, 58, 237, 0.3)"
            : "0 10px 30px rgba(0,0,0,0.2)",
          background: highlighted
            ? "rgba(124, 58, 237, 0.15)"
            : "rgba(255,255,255,0.05)",
          outline: highlighted
            ? "2px solid #7c3aed"
            : "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.3s cubic-bezier(.16,1,.3,1)",
          backdropFilter: "blur(10px)",
          borderRadius: "0.75rem",
        }}
        data-testid={`timeline-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <Badge
            variant={status === "ongoing" ? "default" : "secondary"}
            className={`shrink-0 ${
              status === "ongoing"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-purple-500/20 text-purple-200 border-purple-500/30"
            }`}
          >
            <span className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
          </Badge>
        </div>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="font-medium flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {date} {time}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </span>
        </div>

        {/* View Winners Button */}
        {status === "completed" && (
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-purple-200 transition-colors">
              <Trophy className="w-3 h-3" />
              View Results
            </button>
          </div>
        )}
      </Card>

      <div className="flex flex-col items-center" style={{ zIndex: 5 }}>
        <div
          className={`w-4 h-4 rounded-full ${
            status === "ongoing"
              ? "bg-primary ring-4 ring-primary/20"
              : "bg-border"
          }`}
        />
      </div>
      <div className="flex-1" />
    </div>
  );
}
