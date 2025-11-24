import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, X } from "lucide-react";
import ShapeBlur from "@/components/ShapeBlur";

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

export default function TimelineItemClean({
  title,
  description,
  date,
  time,
  location,
  status,
  position,
  highlighted = false,
}: TimelineItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="p-6 max-w-3xl w-[90%]"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{description}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {date} {time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            </div>
          </Card>
        </div>
      )}

      <div
        className={`flex items-center gap-6 mb-8 ${
          position === "right" ? "flex-row-reverse" : ""
        }`}
      >
        <div className="relative flex-1">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            style={{ padding: 4 }}
          >
            <ShapeBlur
              variation={0}
              pixelRatioProp={
                typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
              }
              shapeSize={0.5}
              roundness={0.6}
              borderSize={0.06}
              circleSize={0.35}
              circleEdge={1}
            />
          </div>

          <Card
            className="p-5 relative z-10 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={status === "ongoing" ? "default" : "secondary"}>
                {status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-gray-300">{description}</p>
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            </div>
          </Card>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "ongoing" ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        </div>
      </div>
    </>
  );
}
