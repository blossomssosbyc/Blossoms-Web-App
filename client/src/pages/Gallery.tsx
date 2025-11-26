import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Masonry from "@/components/Masonry";
import useSmoothScroll from "@/hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  {
    id: "1",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_1",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_1",
    title: "Greeting Card Contest Winner",
    event: "Greeting Card Making",
    date: "March 11, 2024",
    height: 400,
  },
  {
    id: "2",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_2",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_2",
    title: "Extempore Speech Competition",
    event: "Extempore",
    date: "March 12, 2024",
    height: 350,
  },
  {
    id: "3",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_3",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_3",
    title: "Photography Exhibition",
    event: "Photography",
    date: "March 13, 2024",
    height: 450,
  },
  {
    id: "4",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_4",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_4",
    title: "Debate Preliminaries",
    event: "Debate (Prelims)",
    date: "March 14, 2024",
    height: 380,
  },
  {
    id: "5",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_5",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_5",
    title: "Short Film Screening",
    event: "Short Film Making",
    date: "March 15, 2024",
    height: 500,
  },
  {
    id: "6",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_6",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_6",
    title: "Pencil Sketching Workshop",
    event: "Pencil Sketching",
    date: "March 11, 2024",
    height: 420,
  },
  {
    id: "7",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_7",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_7",
    title: "Dance Extravaganza Finals",
    event: "Dance Extravaganza",
    date: "March 12, 2024",
    height: 480,
  },
  {
    id: "8",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_8",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_8",
    title: "Western Singing Solo Performance",
    event: "Western Singing (Solo)",
    date: "March 13, 2024",
    height: 390,
  },
  {
    id: "9",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_9",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_9",
    title: "Battle of Bands - Western",
    event: "Battle of Bands (Western)",
    date: "March 16, 2024",
    height: 440,
  },
  {
    id: "10",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_10",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_10",
    title: "Rangoli Design Competition",
    event: "Rangoli Design",
    date: "March 17, 2024",
    height: 360,
  },
  {
    id: "11",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_11",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_11",
    title: "Quiz Finals",
    event: "Quiz (Finals)",
    date: "March 18, 2024",
    height: 410,
  },
  {
    id: "12",
    img: "https://drive.google.com/uc?export=view&id=FILE_ID_12",
    url: "https://drive.google.com/uc?export=view&id=FILE_ID_12",
    title: "Street Theatre Performance",
    event: "Street Theatre",
    date: "March 19, 2024",
    height: 470,
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

  const openLightbox = (index: number) => {
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
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  // Enable smooth, damped scrolling for premium feel
  useSmoothScroll();

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  // Scroll reveal animations for gallery sections
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-12" data-reveal>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/70">
            Moments from Blossoms 2025
          </p>
        </div>

        {/* Event Filters - Featured + Dropdown */}
        <div
          className="flex flex-wrap justify-center items-center gap-3 py-8"
          data-reveal
        >
          {/* Featured Event Buttons */}
          {featuredEvents.map((event) => (
            <Button
              key={event}
              variant={selectedEvent === event ? "default" : "outline"}
              onClick={() => setSelectedEvent(event)}
              className="transition-all hover:scale-105"
              data-testid={`button-event-${event
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
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
              className="w-[280px] max-h-[400px] overflow-y-auto bg-gray-900 border-white/10"
            >
              {dropdownEvents.map((event) => (
                <DropdownMenuItem
                  key={event}
                  onClick={() => setSelectedEvent(event)}
                  className={`${
                    selectedEvent === event ? "bg-purple-600/40" : ""
                  } text-white hover:bg-purple-600/30 cursor-pointer`}
                >
                  {event}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Images Count */}
        <p className="text-center text-sm text-white/50" data-reveal>
          Showing {filteredImages.length}{" "}
          {filteredImages.length === 1 ? "photo" : "photos"}
        </p>

        {/* Gallery Section with Background */}
        <section
          className="py-12 px-4 relative overflow-hidden rounded-2xl"
          data-reveal
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black rounded-2xl" />

          {/* Gallery Masonry */}
          <div className="relative z-10">
            {filteredImages.length > 0 ? (
              <Masonry
                items={filteredImages.map((img) => ({
                  id: img.id,
                  img: img.img,
                  url: img.url,
                  height: img.height,
                }))}
                ease="power3.out"
                duration={0.6}
                stagger={0.05}
                animateFrom="bottom"
                scaleOnHover={true}
                hoverScale={0.95}
                blurToFocus={true}
                colorShiftOnHover={false}
                onItemClick={(id) => {
                  const index = filteredImages.findIndex(
                    (img) => img.id === id
                  );
                  if (index !== -1) {
                    openLightbox(index);
                  }
                }}
              />
            ) : (
              <div className="text-center py-24 space-y-4">
                <p className="text-2xl font-semibold text-white/60">
                  No photos found
                </p>
                <p className="text-white/40">
                  Try selecting a different category
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 z-10 rounded-full"
              onClick={closeLightbox}
              data-testid="button-close-lightbox"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 text-white hover:bg-white/10 z-10 hidden md:flex rounded-full"
              onClick={prevImage}
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 text-white hover:bg-white/10 z-10 hidden md:flex rounded-full"
              onClick={nextImage}
              data-testid="button-next-image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>

            {/* Main Image Container */}
            <div className="max-w-6xl max-h-[90vh] flex flex-col items-center gap-6">
              <img
                src={filteredImages[currentImageIndex].img}
                alt={filteredImages[currentImageIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image Details */}
              <div className="text-center text-white space-y-2 bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-8 py-5 rounded-lg backdrop-blur-md border border-white/10">
                <p className="text-2xl font-bold">
                  {filteredImages[currentImageIndex].title}
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-white/80 flex-wrap">
                  <span>{filteredImages[currentImageIndex].date}</span>
                  {filteredImages[currentImageIndex].event && (
                    <>
                      <span>•</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full backdrop-blur-sm">
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
                  className="text-white border-white/20 hover:bg-white/10 rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-white border-white/20 hover:bg-white/10 rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Glow */}
        <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
      </div>
    </div>
  );
}
