import React, { useMemo, useRef, useEffect, useState } from "react";
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
import useSmoothScroll from "@/hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface ShapeBlurProps {
  className?: string;
  variation?: number;
  pixelRatioProp?: number;
  shapeSize?: number;
  roundness?: number;
  borderSize?: number;
  circleSize?: number;
  circleEdge?: number;
}

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
}

// ShapeBlur Component
const ShapeBlur = ({
  className = "",
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1.2,
  roundness = 0.4,
  borderSize = 0.05,
  circleSize = 0.3,
  circleEdge = 0.5,
}: ShapeBlurProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dynamically import Three.js
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;

    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE) return;
      let animationFrameId;
      let time = 0,
        lastTime = 0;

      const vMouse = new THREE.Vector2();
      const vMouseDamp = new THREE.Vector2();
      const vResolution = new THREE.Vector2();

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera();
      camera.position.z = 1;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const vertexShader = `
      varying vec2 v_texcoord;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_texcoord = uv;
      }
    `;

      const fragmentShader = `
      varying vec2 v_texcoord;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform float u_pixelRatio;
      uniform float u_shapeSize;
      uniform float u_roundness;
      uniform float u_borderSize;
      uniform float u_circleSize;
      uniform float u_circleEdge;
      
      #define PI 3.1415926535897932384626433832795
      #define TWO_PI 6.2831853071795864769252867665590
      #define VAR ${variation}
      
      vec2 coord(in vec2 p) {
        p = p / u_resolution.xy;
        if (u_resolution.x > u_resolution.y) {
          p.x *= u_resolution.x / u_resolution.y;
          p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
        } else {
          p.y *= u_resolution.y / u_resolution.x;
          p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
        }
        p -= 0.5;
        p *= vec2(-1.0, 1.0);
        return p;
      }
      
      float sdRoundRect(vec2 p, vec2 b, float r) {
        vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
        return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
      }
      
      float sdCircle(in vec2 st, in vec2 center) {
        return length(st - center) * 2.0;
      }
      
      float fill(float x, float size, float edge) {
        return 1.0 - smoothstep(size - edge, size + edge, x);
      }
      
      float strokeAA(float x, float size, float w, float edge) {
        float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
        float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
                - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
        return clamp(d, 0.0, 1.0);
      }
      
      void main() {
        vec2 st = coord(gl_FragCoord.xy) + 0.5;
        vec2 posMouse = coord(u_mouse * u_pixelRatio) * vec2(1., -1.) + 0.5;
        
        float sdfCircle = fill(sdCircle(st, posMouse), u_circleSize, u_circleEdge);
        float sdf = sdRoundRect(st, vec2(u_shapeSize), u_roundness);
        sdf = strokeAA(sdf, 0.0, u_borderSize, sdfCircle) * 4.0;
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, sdf);
      }
    `;

      const geo = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_mouse: { value: vMouseDamp },
          u_resolution: { value: vResolution },
          u_pixelRatio: { value: pixelRatioProp },
          u_shapeSize: { value: shapeSize },
          u_roundness: { value: roundness },
          u_borderSize: { value: borderSize },
          u_circleSize: { value: circleSize },
          u_circleEdge: { value: circleEdge },
        },
        transparent: true,
      });

      const quad = new THREE.Mesh(geo, material);
      scene.add(quad);

      const onPointerMove = (e: MouseEvent) => {
        const rect = mount?.getBoundingClientRect();
        vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
      };

      document.addEventListener("mousemove", onPointerMove);

      const resize = () => {
        const w = mount?.clientWidth || 0;
        const h = mount?.clientHeight || 0;
        const dpr = Math.min(window.devicePixelRatio, 2);

        renderer.setSize(w, h);
        renderer.setPixelRatio(dpr);

        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();

        quad.scale.set(w, h, 1);
        vResolution.set(w, h).multiplyScalar(dpr);
      };

      resize();
      window.addEventListener("resize", resize);

      const update = () => {
        time = performance.now() * 0.001;
        const dt = time - lastTime;
        lastTime = time;

        vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
        vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(update);
      };
      update();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    variation,
    pixelRatioProp,
    shapeSize,
    roundness,
    borderSize,
    circleSize,
    circleEdge,
  ]);

  return (
    <div
      className={className}
      ref={mountRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
}

// ScrollReveal Component
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

// All events data
const allEvents = [
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
      (evt: EventData) =>
        isToday(evt.date) && new Date(`${evt.date} ${evt.time} GMT+0530`) > now
    )
    .sort((a: EventData, b: EventData) =>
      new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1
    );
}

// Main Homepage Component
export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const upcomingToday = useMemo(() => getTodaysUpcomingEvents(allEvents), []);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enable smooth, damped scrolling for premium feel
  useSmoothScroll();

  // Hero animation
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    gsap.fromTo(
      hero?.querySelectorAll(".hero-element"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  // Scroll reveal animations for all sections
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
      {/* Hero Section with ShapeBlur */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* ShapeBlur Background */}
        <div className="absolute inset-0 opacity-30">
          <ShapeBlur
            variation={0}
            pixelRatioProp={
              typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
            }
            shapeSize={0.8}
            roundness={0.6}
            borderSize={0.08}
            circleSize={0.4}
            circleEdge={1.2}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/50" />

        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="hero-element mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">
              Annual Cultural Festival
            </span>
          </div>

          <h1 className="hero-element text-7xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Blossoms
          </h1>

          <div className="hero-element text-4xl md:text-5xl font-bold mb-4 text-white/90">
            2025-26
          </div>

          <p className="hero-element text-xl md:text-2xl mb-3 text-white/70">
            Christ University Yeshwanthpur
          </p>

          <p className="hero-element text-lg md:text-xl mb-12 text-white/60">
            School of Sciences
          </p>

          <div className="hero-element flex flex-wrap items-center justify-center gap-6">
            <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50">
              <span className="relative z-10 flex items-center gap-2">
                View Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="group px-8 py-4 rounded-full backdrop-blur-md bg-white/10 border-2 border-white/20 font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate Report
              </span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section with MagicBento */}
      <section className="py-24 px-4 relative overflow-hidden" data-reveal>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
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
              value="2,500+"
              label="Total Participants"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              icon={Calendar}
              value="35"
              label="Events"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              icon={Trophy}
              value="2"
              label="Departments"
              trend={undefined}
            />
            <StatCard
              icon={Flame}
              value="10"
              label="Days of Events"
              trend={undefined}
            />
          </MagicBento>
        </div>
      </section>

      {/* ScrollReveal Section */}
      <section className="py-32 px-4 relative overflow-hidden" data-reveal>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScrollReveal
            enableBlur={true}
            baseOpacity={0.2}
            baseRotation={2}
            blurStrength={8}
          >
            A celebration of creativity, talent, and unity. Join us for an
            unforgettable journey through art, music, dance, and culture.
          </ScrollReveal>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 relative" data-reveal>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12" data-reveal>
            <Star className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                    <EventCard
                      {...event}
                      date={`${event.date}, ${event.time}`}
                    />
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
                      background: "linear-gradient(180deg,#0b0713,#0b0b0b)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div>
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-xl text-gray-400">
                        No upcoming events today
                      </p>
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

      {/* Quick Access */}
      <section className="py-24 px-4 relative" data-reveal>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            data-reveal
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
              },
              {
                label: "Events Timeline",
                desc: "Full event schedule",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                label: "Gallery",
                desc: "Event photos & videos",
                gradient: "from-orange-500 to-yellow-500",
              },
              {
                label: "Reports",
                desc: "Generate custom reports",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((item) => {
              const cardStyle = {
                backgroundColor: "#060010",
                borderColor: "rgba(57,46,78,0.6)",
                color: "hsl(0, 0%, 100%)",
              } as React.CSSProperties;

              return (
                <div key={item.label} data-reveal>
                  <ParticleCard
                    className="card relative overflow-hidden rounded-2xl p-6 border border-solid font-light transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] card--border-glow"
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
                        <ArrowRight className="w-6 h-6 mt-4 text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
                      </div>
                    </button>
                  </ParticleCard>
                </div>
              );
            })}
          </MagicBento>
        </div>
      </section>

      {/* Footer Glow */}
      <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}
