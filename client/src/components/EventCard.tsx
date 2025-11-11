import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  category: string;
  imageUrl?: string;
}

export default function EventCard({ title, description, date, location, participants, category, imageUrl }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`event-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{participants} participants</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
