import React, { useMemo, useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Users,
  Trophy,
  Calendar,
  Flame,
  ArrowRight,
  FileText,
  Sparkles,
  Star,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicBento, { ParticleCard } from "@/components/MagicBento";
import StatCard from "@/components/StatCard";
import EventCard from "@/components/EventCard";

gsap.registerPlugin(ScrollTrigger);

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
}

// ============================================
// SMOOTH SCROLL HOOK
// ============================================

const useLenisSmoothScroll = () => {
  useEffect(() => {
    let animationId: number;
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    const ease = 0.08;

    const smoothScroll = () => {
      currentScroll += (targetScroll - currentScroll) * ease;
      
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        window.scrollTo(0, currentScroll);
      }
      
      animationId = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScroll += e.deltaY;
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    animationId = requestAnimationFrame(smoothScroll);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationId);
    };
  }, []);
};

// ============================================
// UNIFIED SEAMLESS BACKGROUND
// ============================================

const SeamlessBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();

    const orbs = [
      { baseX: 0.15, baseY: 0.08, radius: 0.5, color: [120, 0, 180], speed: 0.0002, phase: 0 },
      { baseX: 0.85, baseY: 0.05, radius: 0.45, color: [180, 0, 100], speed: 0.00025, phase: 1 },
      { baseX: 0.5, baseY: 0.15, radius: 0.55, color: [80, 0, 160], speed: 0.00015, phase: 2 },
      { baseX: 0.2, baseY: 0.35, radius: 0.4, color: [150, 20, 120], speed: 0.0003, phase: 3 },
      { baseX: 0.8, baseY: 0.3, radius: 0.48, color: [100, 0, 200], speed: 0.00018, phase: 4 },
      { baseX: 0.1, baseY: 0.55, radius: 0.42, color: [170, 30, 90], speed: 0.00022, phase: 5 },
      { baseX: 0.9, baseY: 0.5, radius: 0.5, color: [90, 10, 170], speed: 0.0002, phase: 6 },
      { baseX: 0.5, baseY: 0.7, radius: 0.52, color: [130, 0, 150], speed: 0.00016, phase: 7 },
      { baseX: 0.3, baseY: 0.85, radius: 0.45, color: [160, 40, 110], speed: 0.00024, phase: 8 },
      { baseX: 0.7, baseY: 0.9, radius: 0.48, color: [110, 20, 180], speed: 0.0002, phase: 9 },
    ];

    const animate = () => {
      time += 1;
      
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        const offsetX = Math.sin(time * orb.speed + orb.phase) * 0.08;
        const offsetY = Math.cos(time * orb.speed * 0.7 + orb.phase * 1.5) * 0.06;
        
        const mouseInfluenceX = (mouseRef.current.x / canvas.width - 0.5) * 0.02;
        const mouseInfluenceY = (mouseRef.current.y / window.innerHeight - 0.5) * 0.02;

        const x = (orb.baseX + offsetX + mouseInfluenceX) * canvas.width;
        const y = (orb.baseY + offsetY + mouseInfluenceY) * canvas.height;
        const radius = orb.radius * Math.max(canvas.width, canvas.height) * 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0.18)`);
        gradient.addColorStop(0.4, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0.08)`);
        gradient.addColorStop(0.7, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0.03)`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Subtle stars
      for (let i = 0; i < 100; i++) {
        const pseudoRandom = (seed: number) => {
          const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        
        const starX = pseudoRandom(i * 1.1) * canvas.width;
        const starY = pseudoRandom(i * 2.2) * canvas.height;
        const starSize = pseudoRandom(i * 3.3) * 1.5 + 0.5;
        const twinkle = Math.sin(time * 0.02 + i) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * twinkle})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      resize();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", resize);
    
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// Mouse Glow Effect
const MouseGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    document.body.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none transition-opacity duration-300"
      style={{
        zIndex: 1,
        opacity: visible ? 1 : 0,
        background: `radial-gradient(800px circle at ${pos.x}px ${pos.y}px, 
          rgba(120, 0, 200, 0.04), 
          transparent 40%)`,
        inset: 0,
      }}
    />
  );
};

// Floating Particles
const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 270,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2, opacity: 0.6 }}
    />
  );
};

// ============================================
// SCROLL REVEAL COMPONENT
// ============================================

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
}

const ScrollReveal = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    const wordElements = el?.querySelectorAll(".inline-block");
    gsap.fromTo(
      wordElements as any,
      {
        opacity: baseOpacity,
        willChange: "opacity",
        filter: enableBlur ? `blur(${blurStrength}px)` : "none",
      },
      {
        ease: "none",
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=20%",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <h2
      ref={containerRef}
      className="text-4xl md:text-5xl lg:text-6xl font-bold leading-relaxed"
    >
      {splitText}
    </h2>
  );
};

// ============================================
// EVENT DATA
// ============================================

const allEvents: EventData[] = [
  {
    title: "Greeting Card Making",
    description: "Art event for creative greeting card design.",
    date: "November 10, 2025",
    time: "4:30 PM",
    location: "B-614 & 613",
    category: "Art",
    participants: 50,
  },
  {
    title: "Extempore",
    description: "Impromptu speeches event",
    date: "November 10, 2025",
    time: "4:30 PM",
    location: "Seminar Hall 2",
    category: "Literature",
    participants: 40,
  },
  {
    title: "Photography",
    description: "Art event capturing campus moments",
    date: "November 11, 2025",
    time: "4:30 PM",
    location: "B-611",
    category: "Art",
    participants: 55,
  },
  {
    title: "Battle of Bands (Western)",
    description: "Campus battle for western music bands.",
    date: "November 22, 2025",
    time: "1:30 PM",
    location: "Main Auditorium",
    category: "Music",
    participants: 29,
  },
];

function isToday(dateStr: string): boolean {
  const today = new Date();
  const eventDate = new Date(dateStr);
  return (
    today.getFullYear() === eventDate.getFullYear() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getDate() === eventDate.getDate()
  );
}

function getTodaysUpcomingEvents(events: EventData[]): EventData[] {
  const now = new Date();
  return events
    .filter(
      (evt) =>
        isToday(evt.date) && new Date(`${evt.date} ${evt.time} GMT+0530`) > now
    )
    .sort((a, b) =>
      new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1
    );
}

// ============================================
// MAIN HOMEPAGE COMPONENT
// ============================================

export default function HomePage() {
  console.log("HomePage: Rendering started");
  const upcomingToday = useMemo(() => {
    console.log("HomePage: Calculating upcoming events");
    return getTodaysUpcomingEvents(allEvents);
  }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [stats, setStats] = useState({
    participants: 0,
    events: 0,
    schools: 5,
    days: 10,
  });

  // Enable smooth scrolling
  useLenisSmoothScroll();

  useEffect(() => {
    const fetchStats = async () => {
      console.log("HomePage: Fetching stats...");
      try {
        const res = await fetch("/api/registrations");
        console.log("HomePage: Stats response status:", res.status);
        const data = await res.json();
        console.log("HomePage: Stats data received:", data);

        if (Array.isArray(data)) {
          const totalParticipants = data.reduce(
            (acc: number, curr: any) => acc + (curr.total || 0),
            0
          );
          const totalEvents = data.length;

          setStats((prev) => ({
            ...prev,
            participants: totalParticipants,
            events: totalEvents,
          }));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Hero animations
  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero) return;

    gsap.fromTo(
      hero.querySelectorAll(".hero-element"),
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      }
    );

    if (title) {
      gsap.to(title, {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    gsap.to(hero.querySelector(".hero-content"), {
      y: 150,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  // Scroll reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  // Magnetic buttons effect
  useEffect(() => {
    const buttons = document.querySelectorAll(".magnetic-btn");

    buttons.forEach((button) => {
      const btn = button as HTMLElement;

      const handleEnter = () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      };

      const handleLeave = () => {
        gsap.to(btn, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      };

      const handleMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      };

      btn.addEventListener("mouseenter", handleEnter);
      btn.addEventListener("mouseleave", handleLeave);
      btn.addEventListener("mousemove", handleMove);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Background */}
      <SeamlessBackground />
      <MouseGlow />
      <FloatingParticles />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        <div className="hero-content relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium">Inter-School Festival</span>
          </div>

          <h1
            ref={titleRef}
            className="hero-element text-7xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight"
            style={{
              backgroundSize: "200% auto",
              animation: "gradient 8s ease infinite",
            }}
          >
            Blossoms
          </h1>

          <div className="hero-element text-4xl md:text-5xl font-bold mb-4 text-white/90">
            2025-26
          </div>

          <p className="hero-element text-xl md:text-2xl mb-3 text-white/70">
            CHRIST (Deemed to be University), Yeshwanthpur campus
          </p>

          <p className="hero-element text-lg md:text-xl mb-12 text-white/60">
            In collaboration with the School of Sciences
          </p>

          <div className="hero-element flex flex-wrap items-center justify-center gap-6">
            <Link href="/timeline">
              <button className="magnetic-btn group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  View Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>

            <Link href="/report">
              <button className="magnetic-btn group px-8 py-4 rounded-full backdrop-blur-md bg-white/5 border border-white/20 font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generate Report
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 relative" data-reveal style={{ zIndex: 10 }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            glowColor="132, 0, 255"
            spotlightRadius={300}
            particleCount={12}
          >
            <StatCard
              icon={Users}
              value={stats.participants.toLocaleString()}
              label="Total Participants"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              icon={Calendar}
              value={stats.events.toString()}
              label="Events"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              icon={Trophy}
              value={stats.schools.toString()}
              label="Schools"
              trend={undefined}
            />
            <StatCard
              icon={Flame}
              value={stats.days.toString()}
              label="Days of Events"
              trend={undefined}
            />
          </MagicBento>
        </div>
      </section>

      {/* ScrollReveal Section 1 */}
      <section className="py-32 px-4 relative" data-reveal style={{ zIndex: 10 }}>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScrollReveal enableBlur={true} baseOpacity={0.2} baseRotation={2} blurStrength={8}>
            A celebration of creativity, talent, and unity. Join us for an
            unforgettable journey through art, music, dance, and culture.
          </ScrollReveal>
        </div>
      </section>

      {/* ScrollReveal Section 2 */}
      <section className="py-32 px-4 relative" data-reveal style={{ zIndex: 10 }}>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScrollReveal enableBlur={true} baseOpacity={0.2} baseRotation={2} blurStrength={8}>
            Experience the magic of Blossoms 2025-26, where every moment
            sparkles with joy and excitement. Let the festivities begin!
          </ScrollReveal>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 relative" data-reveal style={{ zIndex: 10 }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12" data-reveal>
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              Upcoming Highlights
            </h2>
          </div>

          <MagicBento
            enableStars={false}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={false}
            enableMagnetism={true}
            glowColor="132, 0, 255"
            spotlightRadius={240}
            particleCount={8}
          >
            {upcomingToday.length > 0 ? (
              upcomingToday.map((event: EventData, i: number) => (
                <div key={i} data-reveal>
                  <ParticleCard
                    className="rounded-2xl"
                    enableTilt={true}
                    clickEffect={false}
                    enableMagnetism={true}
                    style={{
                      padding: 0,
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    <EventCard {...event} date={`${event.date}, ${event.time}`} />
                  </ParticleCard>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <div data-reveal>
                  <ParticleCard
                    className="inline-block p-8 rounded-2xl"
                    enableTilt={false}
                    clickEffect={false}
                    enableMagnetism={false}
                    style={{
                      background: "rgba(10, 5, 20, 0.6)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div>
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-xl text-gray-400">No upcoming events today</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Check back tomorrow for more exciting events!
                      </p>
                    </div>
                  </ParticleCard>
                </div>
              </div>
            )}
          </MagicBento>
        </div>
      </section>

      {/* Quick Access - Original Card Animation Style */}
      <section className="py-24 px-4 relative" data-reveal style={{ zIndex: 10 }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            data-reveal
            style={{ backgroundSize: "200% auto" }}
          >
            Quick Access
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg" data-reveal>
            Explore different sections of the event
          </p>

          <MagicBento
            enableStars={false}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            glowColor="132, 0, 255"
            spotlightRadius={260}
            particleCount={10}
          >
            {[
              {
                label: "Points Dashboard",
                desc: "View department rankings",
                gradient: "from-purple-500 to-pink-500",
                link: "/points",
              },
              {
                label: "Events Timeline",
                desc: "Full event schedule",
                gradient: "from-blue-500 to-cyan-500",
                link: "/timeline",
              },
              {
                label: "Gallery",
                desc: "Event photos & videos",
                gradient: "from-orange-500 to-yellow-500",
                link: "/gallery",
              },
              {
                label: "Reports",
                desc: "Generate custom reports",
                gradient: "from-green-500 to-emerald-500",
                link: "/report",
              },
            ].map((item) => {
              const cardStyle = {
                backgroundColor: "#060010",
                borderColor: "rgba(57,46,78,0.6)",
                color: "hsl(0, 0%, 100%)",
              } as React.CSSProperties;

              return (
                <div key={item.label} data-reveal>
                  <Link href={item.link}>
                    <ParticleCard
                      className="card relative overflow-hidden rounded-2xl p-6 border border-solid font-light transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(120,0,255,0.3)] card--border-glow group cursor-pointer"
                      style={cardStyle}
                      enableTilt={true}
                      clickEffect={true}
                      enableMagnetism={true}
                    >
                      <button className="w-full h-full text-left p-6 bg-transparent">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        />
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                          <ArrowRight className="w-6 h-6 mt-4 text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                      </button>
                    </ParticleCard>
                  </Link>
                </div>
              );
            })}
          </MagicBento>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-32 relative" style={{ zIndex: 10 }} />

      {/* Global Styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #7c3aed, #ec4899);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #8b5cf6, #f472b6);
        }

        /* Card glow effect */
        .card--border-glow {
          position: relative;
        }

        .card--border-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
          filter: blur(8px);
        }

        .card--border-glow:hover::before {
          opacity: 1;
        }

        /* Enhanced hover lift */
        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 25px 50px -12px rgba(120, 0, 255, 0.25),
            0 0 30px rgba(168, 85, 247, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Magnetic button glow */
        .magnetic-btn {
          position: relative;
        }

        .magnetic-btn::after {
          content: '';
          position: absolute;
          inset: -4px;
          background: inherit;
          border-radius: inherit;
          filter: blur(15px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .magnetic-btn:hover::after {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
