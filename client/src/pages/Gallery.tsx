import { useState, useEffect, useMemo } from "react";
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
import { galleryService, GalleryImage } from "@/services/galleryService";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await galleryService.getImages();
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Extract events dynamically from fetched images
  const events = useMemo(() => {
    const uniqueEvents = Array.from(new Set(images.map(img => img.event))).filter(Boolean).sort();
    return ["All Events", ...uniqueEvents];
  }, [images]);

  const featuredEvents = events.slice(0, 5);
  const dropdownEvents = events.slice(5);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const eventMatch =
        selectedEvent === "All Events" || img.event === selectedEvent;
      return eventMatch;
    });
  }, [images, selectedEvent]);

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
  }, [lightboxOpen, nextImage, prevImage]); // Added deps to fix stale state closure if needed, though state updaters handle it.

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
  }, [loading]); // Re-run animation setup when loading finishes and content renders

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
            >
              {event}
            </Button>
          ))}

          {/* More Events Dropdown */}
          {dropdownEvents.length > 0 && (
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
                    className={`${selectedEvent === event ? "bg-purple-600/40" : ""
                      } text-white hover:bg-purple-600/30 cursor-pointer`}
                  >
                    {event}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
            {loading ? (
              <div className="text-center py-24 text-white/60">Loading Moments...</div>
            ) : filteredImages.length > 0 ? (
              <Masonry
                items={filteredImages.map((img) => ({
                  id: img.id.toString(), // Ensure ID is string if Masonry expects it
                  img: img.img!,
                  url: img.url!,
                  height: img.height!,
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
                    (img) => img.id.toString() === id
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
        {lightboxOpen && filteredImages[currentImageIndex] && (
          <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 z-10 rounded-full"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 text-white hover:bg-white/10 z-10 hidden md:flex rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 text-white hover:bg-white/10 z-10 hidden md:flex rounded-full"
              onClick={nextImage}
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
