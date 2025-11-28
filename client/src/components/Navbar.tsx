import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import blossomsLogo from "@assets/images/blossoms_logo.png";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const prevPathRef = useRef<string>("/");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(location === "/menu");

  // Keep isMenuOpen in sync with location changes (e.g., navigate via links)
  useEffect(() => {
    setIsMenuOpen(location === "/menu");
  }, [location]);

  const handleMenuClick = (ev?: React.MouseEvent) => {
    ev?.preventDefault();
    if (location !== "/menu") {
      // store current path so we can return to it when closing
      prevPathRef.current = location || "/";
      setLocation("/menu");
      setIsMenuOpen(true);
    } else {
      // close menu and go back to previous path
      const goto = prevPathRef.current || "/";
      setLocation(goto);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center px-2 py-1 rounded-lg transition-all overflow-hidden no-hover-outline hover:outline-none hover:shadow-none focus:outline-none focus-visible:outline-2 focus-visible:outline-accent"
              data-testid="link-home"
              onClick={(e) => {
                if (location === "/menu") {
                  prevPathRef.current = "/";
                  setIsMenuOpen(false);
                }
              }}
            >
              <img
                src={blossomsLogo}
                alt="Blossoms Logo"
                className="h-40 w-auto object-contain"
              />
            </a>
          </div>

          {/* Center: menu button (centered) */}
          <div className="flex-1 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="font-semibold flex items-center gap-3 text-xl px-4 py-2"
              onClick={handleMenuClick}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              data-testid="btn-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="leading-none">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </Button>
          </div>

          {/* Right: placeholder for CHRIST university logo */}
          <div className="flex-shrink-0">
            <div className="w-28 h-10 flex items-center justify-center border border-white/20 rounded-md text-sm text-white/80">
              CHRIST
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
