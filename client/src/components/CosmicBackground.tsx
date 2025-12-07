import React, { useEffect, useRef } from "react";

interface CosmicBackgroundProps {
  className?: string;
}

export default function CosmicBackground({ className = "" }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Classes ---

    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      twinkleSpeed: number;
      baseOpacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = this.baseOpacity;
        this.speed = Math.random() * 0.2 + 0.05; // slow drift
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        // subtle drift
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }

        // twinkle
        this.opacity =
          this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * 0.2;
        
        // Mouse interaction: brighten when near
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.opacity = Math.min(1, this.opacity + (1 - dist / 150) * 0.5);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow for larger stars
        if (this.size > 1.2) {
             ctx.fillStyle = `rgba(132, 0, 255, ${this.opacity * 0.1})`;
             ctx.beginPath();
             ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
             ctx.fill();
        }
      }
    }

    class ShootingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5; // Start more from top half
        this.vx = -(Math.random() * 4 + 6); // Move left fast
        this.vy = (Math.random() * 2 + 2);  // Move down
        this.maxLife = 50;
        this.life = this.maxLife;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw() {
        if (!ctx) return;
        const opacity = Math.max(0, this.life / this.maxLife);
        
        // Tail
        const tailX = this.x - this.vx * 3;
        const tailY = this.y - this.vy * 3;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(132, 0, 255, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class MouseParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.size = Math.random() * 2 + 1;
        // Random colors: purple, blue, white, pink
        const colors = ["#a855f7", "#3b82f6", "#ffffff", "#ec4899"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
        this.size *= 0.95; // Shrink
      }

      draw() {
        if (!ctx) return;
        if (this.life <= 0) return;
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // --- Initialization ---

    const stars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push(new Star());
    }

    let shootingStars: ShootingStar[] = [];
    let mouseParticles: MouseParticle[] = [];

    // --- Animation Loop ---
    
    let animationFrameId: number;
    let lastMousePos = { x: mouse.x, y: mouse.y };
    
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Stars
      for (const star of stars) {
        star.update();
        star.draw();
      }

      // Shooting Stars (random chance)
      if (Math.random() < 0.015) { // 1.5% chance per frame
        shootingStars.push(new ShootingStar());
      }
      
      shootingStars = shootingStars.filter(s => s.life > 0);
      for (const s of shootingStars) {
        s.update();
        s.draw();
      }

      // Mouse Particles
      // Emit if mouse moved significantly
      const dx = mouse.x - lastMousePos.x;
      const dy = mouse.y - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 2) {
          // Spawn particles along the path for smoother trail
          const count = Math.min(5, Math.floor(dist / 5)) || 1;
          for(let i=0; i<count; i++) {
              mouseParticles.push(new MouseParticle(
                  lastMousePos.x + (dx * i / count) + (Math.random() - 0.5) * 5, 
                  lastMousePos.y + (dy * i / count) + (Math.random() - 0.5) * 5
              ));
          }
      }
      lastMousePos = { x: mouse.x, y: mouse.y };

      mouseParticles = mouseParticles.filter(p => p.life > 0);
      for (const p of mouseParticles) {
        p.update();
        p.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-init stars to cover new area if needed or just let them be
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
