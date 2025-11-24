import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Replace FILE_ID_HERE with actual Google Drive file IDs
// Format: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
// To get file ID: Right-click image in Drive → Get link → Copy the ID between /d/ and /view
// Add 'event' property to each image matching one of the events from the list
const galleryImages = [
  {
    id: 1,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_1",
    title: "Greeting Card Contest Winner",
    event: "Greeting Card Making",
    date: "March 11, 2024",
  },
  {
    id: 2,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_2",
    title: "Extempore Speech Competition",
    event: "Extempore",
    date: "March 12, 2024",
  },
  {
    id: 3,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_3",
    title: "Photography Exhibition",
    event: "Photography",
    date: "March 13, 2024",
  },
  {
    id: 4,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_4",
    title: "Debate Preliminaries",
    event: "Debate (Prelims)",
    date: "March 14, 2024",
  },
  {
    id: 5,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_5",
    title: "Short Film Screening",
    event: "Short Film Making",
    date: "March 15, 2024",
  },
  {
    id: 6,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_6",
    title: "Pencil Sketching Workshop",
    event: "Pencil Sketching",
    date: "March 11, 2024",
  },
  {
    id: 7,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_7",
    title: "Dance Extravaganza Finals",
    event: "Dance Extravaganza",
    date: "March 12, 2024",
  },
  {
    id: 8,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_8",
    title: "Western Singing Solo Performance",
    event: "Western Singing (Solo)",
    date: "March 13, 2024",
  },
  {
    id: 9,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_9",
    title: "Battle of Bands - Western",
    event: "Battle of Bands (Western)",
    date: "March 16, 2024",
  },
  {
    id: 10,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_10",
    title: "Rangoli Design Competition",
    event: "Rangoli Design",
    date: "March 17, 2024",
  },
  {
    id: 11,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_11",
    title: "Quiz Finals",
    event: "Quiz (Finals)",
    date: "March 18, 2024",
  },
  {
    id: 12,
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_12",
    title: "Street Theatre Performance",
    event: "Street Theatre",
    date: "March 19, 2024",
  },
];

const events = [
  "All Events",
  "Greeting Card Making",
  "Extempore",
  "Photography",
  "Debate (Prelims)",
  "Short Film Making",
  "Pencil Sketching",
  "Air Crash",
  "Western Singing (Solo)",
  "Rangoli Design",
  "Dumb Charade",
  "Mono Acting",
  "Painting",
  "Pot Pourri",
  "Indian Folk & Film Singing (Solo)",
  "Indian Classical Dance (Group)",
  "Collage Making",
  "Debate (Finals)",
  "Indian Duet",
  "Pot Art",
  "Quiz (Prelims)",
  "Mime",
  "Mehandi Design",
  "Creative Writing",
  "Acoustic Music Group (Western)",
  "Street Theatre",
  "Digital Poster Making",
  "Just a Minute (JAM)",
  "Indian Dance Group (Non Theme - Film/Folk)",
  "Reel Making",
  "Quiz (Finals)",
  "Dance Extravaganza",
  "Battle of Bands (Western)",
  "Battle of Bands (Indian)",
  "Proscenium",
];

// First 5 events to show as buttons (including "All Events")
const featuredEvents = events.slice(0, 5);
// Remaining events for dropdown
const dropdownEvents = events.slice(5);

export default function Gallery() {
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = galleryImages.filter((img) => {
    const eventMatch =
      selectedEvent === "All Events" || img.event === selectedEvent;
    return eventMatch;
  });

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length,
    );
  };

  // Keyboard navigation for lightbox
  useState(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-muted-foreground text-lg">
            Moments from Blossoms 2024
          </p>
        </div>

        {/* Event Filters - Featured + Dropdown */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {/* Featured Event Buttons */}
          {featuredEvents.map((event) => (
            <Button
              key={event}
              variant={selectedEvent === event ? "default" : "outline"}
              onClick={() => setSelectedEvent(event)}
              className="transition-all hover:scale-105"
              data-testid={`button-event-${event.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {event}
            </Button>
          ))}

          {/* More Events Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={
                  dropdownEvents.includes(selectedEvent) ? "default" : "outline"
                }
                className="min-w-[150px] justify-between"
              >
                {dropdownEvents.includes(selectedEvent)
                  ? selectedEvent
                  : "More Events"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[280px] max-h-[400px] overflow-y-auto"
            >
              {dropdownEvents.map((event) => (
                <DropdownMenuItem
                  key={event}
                  onClick={() => setSelectedEvent(event)}
                  className={selectedEvent === event ? "bg-secondary" : ""}
                >
                  {event}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Images Count */}
        <p className="text-center text-sm text-muted-foreground">
          Showing {filteredImages.length}{" "}
          {filteredImages.length === 1 ? "photo" : "photos"}
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary"
              onClick={() => openLightbox(index)}
              data-testid={`image-${image.id}`}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                    <p className="font-semibold text-lg">{image.title}</p>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-white/90">{image.date}</span>
                      {image.event && (
                        <span className="px-2 py-1 bg-primary/60 rounded-full text-xs backdrop-blur-sm w-fit">
                          {image.event}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="text-2xl font-semibold text-muted-foreground">
              No photos found
            </p>
            <p className="text-muted-foreground">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
              data-testid="button-close-lightbox"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20 z-10 hidden md:flex"
              onClick={prevImage}
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20 z-10 hidden md:flex"
              onClick={nextImage}
              data-testid="button-next-image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>

            {/* Main Image Container */}
            <div className="max-w-6xl max-h-[90vh] flex flex-col items-center gap-6">
              <img
                src={filteredImages[currentImageIndex].url}
                alt={filteredImages[currentImageIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image Details */}
              <div className="text-center text-white space-y-2 bg-black/50 px-6 py-4 rounded-lg backdrop-blur-sm">
                <p className="text-2xl font-bold">
                  {filteredImages[currentImageIndex].title}
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-white/80 flex-wrap">
                  <span>{filteredImages[currentImageIndex].date}</span>
                  {filteredImages[currentImageIndex].event && (
                    <>
                      <span>•</span>
                      <span className="px-3 py-1 bg-primary/40 rounded-full backdrop-blur-sm">
                        {filteredImages[currentImageIndex].event}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-white border-white/20 hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-white border-white/20 hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
