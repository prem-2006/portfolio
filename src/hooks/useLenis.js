import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Lenis smooth scroll and sync with GSAP ScrollTrigger.
 * Uses the correct synchronization pattern:
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   gsap.ticker.lagSmoothing(0)
 */
export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker for perfect frame sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing to prevent frame drops
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
