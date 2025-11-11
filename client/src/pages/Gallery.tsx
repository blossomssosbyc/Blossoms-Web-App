import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import scienceLabImage from "@assets/generated_images/Science_lab_experiment_event_b2686828.png";
import codingImage from "@assets/generated_images/Coding_competition_event_photo_6d0cc36f.png";
import culturalImage from "@assets/generated_images/Cultural_performance_event_photo_e43955bd.png";
import awardImage from "@assets/generated_images/Award_ceremony_event_photo_b0647d87.png";
import sportsImage from "@assets/generated_images/Sports_event_action_photo_9e10f7ba.png";

const galleryImages = [
  { id: 1, url: scienceLabImage, title: "Science Lab Experiments", category: "Technical", date: "March 11, 2024" },
  { id: 2, url: codingImage, title: "Code Sprint Competition", category: "Technical", date: "March 12, 2024" },
  { id: 3, url: culturalImage, title: "Cultural Night Performance", category: "Cultural", date: "March 13, 2024" },
  { id: 4, url: awardImage, title: "Award Ceremony", category: "Awards", date: "March 14, 2024" },
  { id: 5, url: sportsImage, title: "Sports Tournament", category: "Sports", date: "March 15, 2024" },
  { id: 6, url: scienceLabImage, title: "Workshop Session", category: "Workshop", date: "March 11, 2024" },
  { id: 7, url: codingImage, title: "Hackathon Finals", category: "Technical", date: "March 12, 2024" },
  { id: 8, url: culturalImage, title: "Dance Performance", category: "Cultural", date: "March 13, 2024" },
];

const categories = ["All", "Technical", "Cultural", "Sports", "Workshop", "Awards"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gallery</h1>
          <p className="text-muted-foreground">Moments from Blossoms 2024</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-category-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover-elevate transition-all group"
              onClick={() => openLightbox(index)}
              data-testid={`image-${image.id}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-semibold">{image.title}</p>
                    <p className="text-sm text-white/80">{image.date}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={closeLightbox}
              data-testid="button-close-lightbox"
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={prevImage}
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={nextImage}
              data-testid="button-next-image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <div className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-4">
              <img
                src={filteredImages[currentImageIndex].url}
                alt={filteredImages[currentImageIndex].title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="text-center text-white">
                <p className="text-xl font-semibold">{filteredImages[currentImageIndex].title}</p>
                <p className="text-sm text-white/70">{filteredImages[currentImageIndex].date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
