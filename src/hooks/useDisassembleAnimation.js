import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Shared disassemble → reassemble animation hook for all 3D tech objects.
 *
 * Usage:
 *   const { groupRef, animateIn } = useDisassembleAnimation();
 *
 *   // Attach groupRef to a <group> wrapping all your meshes
 *   // Call animateIn() after the meshes are ready
 *
 * Each child of the group will be scattered to random positions,
 * then magnetically pulled back to its original position over 2.5s.
 * After assembly, a slow continuous rotation is applied to the group.
 */
export default function useDisassembleAnimation(options = {}) {
  const {
    scatterRadius = 12,
    duration = 2.5,
    ease = 'power3.inOut',
    stagger = 0.02,
    rotationSpeed = 0.15,
  } = options;

  const groupRef = useRef();
  const homePositions = useRef([]);
  const tl = useRef(null);
  const rotationTl = useRef(null);

  const animateIn = useCallback(() => {
    const group = groupRef.current;
    if (!group) return;

    // Store home positions and scatter
    homePositions.current = [];

    group.children.forEach((child) => {
      homePositions.current.push({
        x: child.position.x,
        y: child.position.y,
        z: child.position.z,
      });

      // Scatter to random positions
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const r = scatterRadius + Math.random() * scatterRadius * 0.5;
      child.position.set(
        Math.cos(angle) * Math.cos(elevation) * r,
        Math.sin(elevation) * r,
        Math.sin(angle) * Math.cos(elevation) * r
      );

      // Random initial rotation
      child.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Start invisible
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
      // Handle children of children (e.g., groups within groups)
      child.traverse((c) => {
        if (c.material) {
          c.material.transparent = true;
          c.material.opacity = 0;
        }
      });
    });

    // Create reassembly timeline
    tl.current = gsap.timeline();

    group.children.forEach((child, i) => {
      const home = homePositions.current[i];
      const delay = i * stagger;

      // Animate position back to home
      tl.current.to(
        child.position,
        {
          x: home.x,
          y: home.y,
          z: home.z,
          duration,
          ease,
        },
        delay
      );

      // Animate rotation to zero
      tl.current.to(
        child.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          duration,
          ease,
        },
        delay
      );

      // Fade in
      const fadeTargets = [];
      if (child.material) fadeTargets.push(child.material);
      child.traverse((c) => {
        if (c.material && !fadeTargets.includes(c.material)) {
          fadeTargets.push(c.material);
        }
      });

      fadeTargets.forEach((mat) => {
        tl.current.to(
          mat,
          {
            opacity: 1,
            duration: duration * 0.6,
            ease: 'power2.out',
          },
          delay
        );
      });
    });

    // After assembly, start slow rotation
    tl.current.call(() => {
      rotationTl.current = gsap.to(group.rotation, {
        y: Math.PI * 2,
        duration: 60 / rotationSpeed,
        repeat: -1,
        ease: 'none',
      });
    });
  }, [scatterRadius, duration, ease, stagger, rotationSpeed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tl.current) tl.current.kill();
      if (rotationTl.current) rotationTl.current.kill();
    };
  }, []);

  return { groupRef, animateIn };
}
