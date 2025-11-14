import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import blossomsLogo from "@assets/images/blossoms_logo.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all"
            data-testid="link-home"
          >
            <img src={blossomsLogo} alt="Blossoms Logo" className="h-13 w-40" />
          </Link>
          <Link href="/menu" data-testid="link-menu">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium flex items-center gap-2"
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
