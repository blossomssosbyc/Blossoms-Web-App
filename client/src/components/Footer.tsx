import blossomsLogo from "@assets/images/blossoms_logo.png";

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-black/10 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          
          {/* Logos Section */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={blossomsLogo} alt="Blossoms Logo" className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            
            <div className="flex flex-col items-center md:items-start">
               <span className="text-xl font-bold tracking-wide text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CHRIST</span>
               <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80">(Deemed to be University)</span>
            </div>
            
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            
            <span className="text-xl font-bold tracking-wide text-primary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">SWO</span>
          </div>

          {/* Credits & Mentors - Stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left">
            
            {/* Developed By */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-foreground/90 uppercase tracking-widest border-b border-primary/30 pb-1 mb-1">Developed by</h3>
              <div className="flex flex-col text-sm text-muted-foreground/80 gap-1 font-medium">
                <span className="hover:text-primary transition-colors duration-200">Vishnu S</span>
                <span className="hover:text-primary transition-colors duration-200">Shashwat</span>
                <span className="hover:text-primary transition-colors duration-200">Shruthi S Patel</span>
              </div>
            </div>

            {/* Mentored By */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-foreground/90 uppercase tracking-widest border-b border-primary/30 pb-1 mb-1">Mentored by</h3>
              <div className="flex flex-col text-sm text-muted-foreground/80 gap-1 font-medium">
                <span className="hover:text-primary transition-colors duration-200">Dr. Gayathry Warrier</span>
                <span className="hover:text-primary transition-colors duration-200">Dr. Balakrishnan C</span>
              </div>
            </div>

          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50">
          <span>&copy; {new Date().getFullYear()} Blossoms. All rights reserved.</span>
          <span className="flex items-center gap-2">
            Made with <span className="text-red-500 animate-pulse">❤</span> by the Tech Team
          </span>
        </div>
      </div>
    </footer>
  );
}
