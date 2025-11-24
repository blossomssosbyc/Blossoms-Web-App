import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { ParticleCard } from "@/components/MagicBento";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  category: string;
  imageUrl?: string;
}

export default function EventCard({
  title,
  description,
  date,
  location,
  participants,
  category,
  imageUrl,
}: EventCardProps) {
  const cardStyle = {
    backgroundColor: "#060010",
    borderColor: "#392e4e",
    color: "hsl(0, 0%, 100%)",
  } as React.CSSProperties;

  return (
    <ParticleCard
      className="card relative aspect-auto min-h-[300px] w-full rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] card--border-glow flex flex-col"
      style={cardStyle}
      enableTilt={true}
      clickEffect={true}
      enableMagnetism={true}
      data-testid={`event-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {imageUrl && (
        <div className="h-48 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <Badge
              variant="secondary"
              className="flex-shrink-0 bg-purple-500/20 text-purple-400 border-purple-500/30"
            >
              {category}
            </Badge>
          </div>
          <p className="text-sm text-white/80 line-clamp-2">{description}</p>
        </div>
        <div className="space-y-2 border-t border-purple-500/20 pt-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{participants} participants</span>
          </div>
        </div>
      </div>
    </ParticleCard>
  );
}
