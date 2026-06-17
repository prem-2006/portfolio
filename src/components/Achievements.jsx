import { useEffect, useRef } from 'react';
import {
  FaCloud,
  FaCode,
  FaCubes,
  FaBookOpen,
  FaRocket,
  FaGithub,
} from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENTS = [
  {
    icon: <FaCloud />,
    title: 'CNCF LFX Mentorship Applicant',
    date: '2026',
    description:
      'Applied for the CNCF LFX Mentorship program to contribute to Chaos Mesh — implementing BDD testing framework for the chaos engineering platform.',
    side: 'left',
  },
  {
    icon: <FaRocket />,
    title: 'C4GT DMP Applicant',
    date: '2026',
    description:
      'Applied for Code for GovTech Digital Mentorship Program to work on Sugar Labs AI — integrating AI capabilities into open-source educational tools.',
    side: 'right',
  },
  {
    icon: <FaCubes />,
    title: 'GSoC Participant',
    date: '2026',
    description:
      'Participated in Google Summer of Code (GSoC).',
    side: 'left',
  },
  {
    icon: <FaCode />,
    title: 'Open Source Contributions',
    date: '2025',
    description:
      'Contributed to ESP-Website (Django) — Bootstrap migration PRs merged. Active contributor to open source projects across the web ecosystem.',
    side: 'right',
  },
  {
    icon: <FaGithub />,
    title: 'GitHub Contributions',
    date: '2025',
    description:
      'Consistent open source contributions and active streak on GitHub.',
    side: 'left',
  },
  {
    icon: <FaCode />,
    title: 'LeetCode',
    date: '2023 – Present',
    description:
      'Active problem solver on LeetCode with consistent participation.',
    side: 'right',
  },
  {
    icon: <FaCubes />,
    title: 'CodeChef',
    date: '2023 – Present',
    description:
      'Active competitor on CodeChef. Solved 1100+ problems.',
    side: 'left',
  },
];

export default function Achievements() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.timeline-card');
    if (!cards || cards.length === 0) return;

    const tweens = [];
    cards.forEach((card, i) => {
      const isLeft = ACHIEVEMENTS[i].side === 'left';
      gsap.set(card, { x: isLeft ? -80 : 80, opacity: 0 });

      const tween = gsap.to(card, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
      tweens.push(tween);
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(timer);
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section id="achievements" className="relative py-20">
      <div ref={sectionRef} className="section-container">
        <h2 className="section-title">Achievements</h2>
        <p className="section-subtitle mt-4 mb-16">
          Milestones and contributions along the journey.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="timeline-line hidden md:block" />
          {/* Mobile left line */}
          <div
            className="md:hidden absolute left-5 top-0 bottom-0 w-0.5"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #e63946, #00f0ff, #e63946, transparent)',
            }}
          />

          <div className="flex flex-col gap-12">
            {ACHIEVEMENTS.map((item, index) => (
              <div
                key={index}
                className={`timeline-card relative flex items-start gap-8 ${
                  item.side === 'right' ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Dot */}
                <div className="timeline-dot hidden md:block" style={{ top: '1.5rem' }} />
                {/* Mobile dot */}
                <div
                  className="md:hidden absolute left-3.5 top-1.5 w-3 h-3 rounded-full z-10"
                  style={{
                    background: '#e63946',
                    boxShadow: '0 0 15px rgba(230,57,70,0.5)',
                  }}
                />

                {/* Card */}
                <div
                  className={`glass-card p-6 flex-1 ml-10 md:ml-0 ${
                    item.side === 'left'
                      ? 'md:mr-auto md:pr-12'
                      : 'md:ml-auto md:pl-12'
                  } md:max-w-[45%]`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-lg p-2 rounded-lg"
                      style={{
                        color: '#00f0ff',
                        background: 'rgba(0, 240, 255, 0.1)',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
