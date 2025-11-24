import { useEffect } from 'react';

/**
 * Hook to create a smooth, damped scrolling effect
 * This gives the website a premium, fluid feel by reducing scroll speed
 * and smoothly decelerating the scrolling motion
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    let scrollVelocity = 0;
    let currentScroll = 0;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let animationFrameId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Reduce scroll speed by 50% for premium feel
      // Lower value = slower, smoother scrolling
      scrollVelocity = e.deltaY * 0.5;
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
      // Apply current velocity to scroll position
      currentScroll += scrollVelocity;
      
      // Dampen velocity for smooth deceleration
      // Value closer to 1 = faster deceleration, less smooth
      // Value closer to 0.9 = slower deceleration, smoother
      scrollVelocity *= 0.95;

      // Update actual scroll position
      window.scrollTo(0, currentScroll);

      // Continue animation while velocity is significant
      if (Math.abs(scrollVelocity) > 0.1) {
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
