import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade + slide-up reveal animation triggered on scroll.
 * @param {string | Element} selector - CSS selector or DOM element
 * @param {object} options - Override defaults
 */
export function revealOnScroll(selector, options = {}) {
  const {
    y = 60,
    duration = 1,
    ease = 'power3.out',
    start = 'top 85%',
    stagger = 0,
  } = options;

  gsap.from(selector, {
    y,
    opacity: 0,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger: selector,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Staggered children reveal on scroll.
 * @param {string | Element} parentSelector - Parent container
 * @param {string} childSelector - Child elements selector
 * @param {object} options - Override defaults
 */
export function staggerReveal(parentSelector, childSelector, options = {}) {
  const {
    y = 50,
    duration = 0.8,
    ease = 'power3.out',
    start = 'top 80%',
    stagger = 0.1,
  } = options;

  gsap.from(`${parentSelector} ${childSelector}`, {
    y,
    opacity: 0,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger: parentSelector,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Slide in from left or right on scroll.
 * @param {string | Element} selector
 * @param {'left' | 'right'} direction
 * @param {object} options
 */
export function slideIn(selector, direction = 'left', options = {}) {
  const {
    x = 100,
    duration = 1,
    ease = 'power3.out',
    start = 'top 85%',
  } = options;

  gsap.from(selector, {
    x: direction === 'left' ? -x : x,
    opacity: 0,
    duration,
    ease,
    scrollTrigger: {
      trigger: selector,
      start,
      toggleActions: 'play none none none',
    },
  });
}
