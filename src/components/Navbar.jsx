import { useState, useEffect, useRef } from 'react';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    // Hide navbar on scroll down, show on scroll up
    const showAnim = gsap.from(nav, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: 'power2.inOut',
    }).progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="font-display text-2xl font-bold tracking-tight"
          style={{ color: '#e63946' }}
        >
          prem<span style={{ color: '#00f0ff' }}>.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Social Icons + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com/in/premsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href="https://x.com/premsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
            aria-label="X / Twitter"
          >
            <FaXTwitter size={18} />
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'rgba(10, 10, 15, 0.95)' }}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-300 hover:text-accent text-lg font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
