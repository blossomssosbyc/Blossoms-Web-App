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
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    completed: { icon: CheckCircle2, label: "Completed" },
    ongoing: { icon: Clock, label: "Ongoing" },
    upcoming: { icon: Clock, label: "Upcoming" },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Additional details to show on expansion
  const additionalDetails = {
    duration: "90 minutes",
    category: title.includes("Dance")
      ? "Performance"
      : title.includes("Singing") ||
        title.includes("Music") ||
        title.includes("Bands")
      ? "Music"
      : title.includes("Debate") ||
        title.includes("Quiz") ||
        title.includes("Writing")
      ? "Literary"
      : title.includes("Painting") ||
        title.includes("Sketch") ||
        title.includes("Rangoli")
      ? "Art"
      : "Theatre",
    eligibility: "Open to all students",
    contact: "Event Coordinator: +91 98765 43210",
  };

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Expanded Modal Overlay */}
      {isExpanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClose}
        >
          {/* Curved Line Extension */}
          {isExpanded && (
            <svg
              style={{
                position: "absolute",
                left: position === "left" ? "calc(50% + 2rem)" : "auto",
                right: position === "right" ? "calc(50% + 2rem)" : "auto",
                top: "50%",
                transform: "translateY(-50%)",
                width: "120px",
                height: "100%",
                minHeight: "400px",
                zIndex: 45,
                pointerEvents: "none",
              }}
            >
              <path
                d={
                  position === "left"
                    ? "M 0 50% Q 60 50%, 120 20% L 120 80% Q 60 50%, 0 50%"
                    : "M 120 50% Q 60 50%, 0 20% L 0 80% Q 60 50%, 120 50%"
                }
                fill="hsl(var(--border))"
                opacity="0.3"
              />
            </svg>
          )}

          <Card
            className="p-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "85vw",
              maxWidth: "1200px",
              maxHeight: "85vh",
              overflow: "visible",
              boxShadow:
                "0 25px 80px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2)",
              borderRadius: "0.75rem",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(20px)",
              outline: "2px solid #7c3aed",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h3
                className="font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent transition-all duration-300"
                style={{
                  fontSize: "2.5rem",
                  lineHeight: "1.2",
                }}
              >
                {title}
              </h3>
              <Badge
                variant={status === "ongoing" ? "default" : "secondary"}
                className={`flex items-center gap-1 shrink-0 ${
                  status === "ongoing"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-purple-500/20 text-purple-200 border-purple-500/30"
                }`}
              >
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </Badge>
            </div>

            <p
              className="text-gray-300 mb-4 transition-all duration-300"
              style={{
                fontSize: "1.125rem",
              }}
            >
              {description}
            </p>

            <div
              className="flex items-center gap-4 text-muted-foreground mb-4 flex-wrap"
              style={{
                fontSize: "1rem",
              }}
            >
              <span className="font-medium flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-purple-400" />
                {date} {time}
              </span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-pink-400" />
                {location}
              </span>
            </div>

            <div className="border-t pt-6 mt-4 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/10 backdrop-blur">
                  <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Duration
                  </div>
                  <div className="font-semibold text-lg text-purple-200">
                    {additionalDetails.duration}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10 backdrop-blur">
                  <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Category
                  </div>
                  <div className="font-semibold text-lg text-blue-200">
                    {additionalDetails.category}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-pink-500/20 bg-pink-500/10 backdrop-blur">
                  <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-pink-400" />
                    Eligibility
                  </div>
                  <div className="font-semibold text-lg text-pink-200">
                    {additionalDetails.eligibility}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur">
                <h4 className="text-xl font-semibold mb-3 text-purple-200">
                  Contact Information
                </h4>
                <p className="text-gray-300">{additionalDetails.contact}</p>
              </div>

              {/* Footer Note */}
              <div className="text-center text-sm text-gray-400 italic pt-4 border-t border-purple-500/20">
                Click the X button or press ESC to close
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Timeline Item */}
      <div
        className={`flex items-center gap-8 mb-12 ${
          position === "right" ? "flex-row-reverse" : ""
        } relative`}
        style={{ position: "relative" }}
      >
        {/* Curved Line Extension */}
        {isExpanded && (
          <svg
            style={{
              position: "absolute",
              left: position === "left" ? "calc(50% + 2rem)" : "auto",
              right: position === "right" ? "calc(50% + 2rem)" : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              width: "120px",
              height: "100%",
              minHeight: "400px",
              zIndex: 45,
              pointerEvents: "none",
            }}
          >
            <path
              d={
                position === "left"
                  ? "M 0 50% Q 60 50%, 120 20% L 120 80% Q 60 50%, 0 50%"
                  : "M 120 50% Q 60 50%, 0 20% L 0 80% Q 60 50%, 120 50%"
              }
              fill="hsl(var(--border))"
              opacity="0.3"
            />
          </svg>
        )}

        <Card
          className="flex-1 p-6 hover-elevate transition-all cursor-pointer"
          onClick={() => setIsExpanded(true)}
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
    </>
  );
}
