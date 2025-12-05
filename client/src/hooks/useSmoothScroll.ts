import { useEffect } from 'react';

/**
 * Hook to create a smooth, damped scrolling effect
 * This gives the website a premium, fluid feel by reducing scroll speed
 * and smoothly decelerating the scrolling motion
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    let scrollVelocity = 0;
    // Initialize with current scroll position to prevent jumping to top on reload
    let currentScroll = window.scrollY;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let animationFrameId: number | null = null;
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      
      // If we haven't scrolled in a while, sync with actual window position
      // This handles cases where user scrolled via scrollbar or other methods
      if (now - lastWheelTime > 100) {
        currentScroll = window.scrollY;
        scrollVelocity = 0;
      }
      lastWheelTime = now;
      
      // Add multiple calls within same frame to velocity instead of replacing
      scrollVelocity += e.deltaY * 0.5;
      
      // Cap max velocity to prevent massive jumps
      scrollVelocity = Math.max(Math.min(scrollVelocity, 150), -150);

      isScrolling = true;

      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set timeout to mark when scrolling stops
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);

      // Start animation if not already running
      if (animationFrameId === null) {
        updateScroll();
      }
    };

    const updateScroll = () => {
      // Apply noise reduction
      if (Math.abs(scrollVelocity) < 0.5) {
        scrollVelocity = 0;
        animationFrameId = null;
        return;
      }

      // Apply current velocity to scroll position
      currentScroll += scrollVelocity;
      
      // Create boundaries
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      currentScroll = Math.max(0, Math.min(currentScroll, maxScroll));
      
      // Dampen velocity for smooth deceleration
      scrollVelocity *= 0.95;

      // Update actual scroll position
      window.scrollTo(0, currentScroll);

      // Continue animation while velocity is significant
      if (Math.abs(scrollVelocity) > 0.5) {
        animationFrameId = requestAnimationFrame(updateScroll);
      } else {
        animationFrameId = null;
      }
    };

    // Enable wheel event with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
};

export default useSmoothScroll;
