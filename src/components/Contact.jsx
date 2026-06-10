import { useState, useEffect, useRef, useMemo } from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { FaPaperPlane } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CODE_CHARS = '{}[]();:=><+-.const let var function return async await import export class'.split('');

function CodeRainBackground() {
  const chars = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${12 + Math.random() * 6}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {chars.map((c, i) => (
        <span
          key={i}
          className="code-rain-char"
          style={{
            left: c.left,
            animationDelay: c.delay,
            animationDuration: c.duration,
            fontSize: c.size,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
}

const SOCIAL_LINKS = [
  {
    icon: <FaEnvelope size={20} />,
    href: 'mailto:prem@example.com',
    label: 'Email',
  },
  {
    icon: <FaGithub size={20} />,
    href: 'https://github.com/premsingh',
    label: 'GitHub',
  },
  {
    icon: <FaLinkedinIn size={20} />,
    href: 'https://linkedin.com/in/premsingh',
    label: 'LinkedIn',
  },
  {
    icon: <FaXTwitter size={20} />,
    href: 'https://x.com/premsingh',
    label: 'X / Twitter',
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.contact-animate');
    gsap.set(items, { y: 40, opacity: 0 });

    const tween = gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(timer);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission (replace with Formspree/EmailJS if needed)
    await new Promise((r) => setTimeout(r, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      <CodeRainBackground />

      <div ref={sectionRef} className="section-container relative z-10">
        <h2 className="section-title contact-animate">Get In Touch</h2>
        <p className="section-subtitle mt-4 mb-12 contact-animate">
          Have a project in mind or just want to connect? Drop me a message.
        </p>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5 contact-animate">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                required
                className="form-input"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                required
                className="form-input"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                rows={5}
                required
                className="form-input resize-none"
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : submitted ? (
                <span>Message Sent! ✓</span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaPaperPlane />
                  Send Message
                </span>
              )}
            </button>
          </form>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mt-10 contact-animate">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(17, 17, 24, 0.8)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#8888a0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00f0ff';
                  e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)';
                  e.currentTarget.style.boxShadow =
                    '0 0 20px rgba(0,240,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8888a0';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
