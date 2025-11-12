import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import blossomsLogo from "@assets/images/blossoms_logo.png";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/points", label: "Points Dashboard" },
    { path: "/timeline", label: "Events Timeline" },
    { path: "/gallery", label: "Gallery" },
    { path: "/report", label: "Reports" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all"
            data-testid="link-home"
          >
            <img src={blossomsLogo} alt="Blossoms Logo" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Button
                  variant={location === link.path ? "secondary" : "ghost"}
                  size="sm"
                  className="font-medium"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Button
                  variant={location === link.path ? "secondary" : "ghost"}
                  className="w-full justify-start font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
