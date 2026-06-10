import { useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    name: 'Ai-Roads',
    description:
      'Road safety analytics platform using AI-powered insights to improve urban road infrastructure and reduce accidents.',
    tech: ['FastAPI', 'React', 'Databricks SQL', 'OpenAI'],
    github: 'https://github.com/premsingh/ai-roads',
    demo: '#',
  },
  {
    name: 'Lucky Card',
    description:
      'Web3 card game deployed on Flare Network where players test their luck in a decentralized, provably fair card game.',
    tech: ['Solidity', 'React', 'Wagmi', 'Viem'],
    github: 'https://github.com/premsingh/lucky-card',
    demo: '#',
  },
  {
    name: 'TaskFlow',
    description:
      'AI-powered task manager that automatically categorizes, prioritizes, and suggests optimal workflows for your tasks.',
    tech: ['Next.js', 'MongoDB', 'GPT-4o-mini', 'Tailwind'],
    github: 'https://github.com/premsingh/taskflow',
    demo: '#',
  },
  {
    name: 'Terminal Notes Vault',
    description:
      'Encrypted CLI notes manager published on PyPI. Securely store and retrieve notes with PBKDF2 encryption.',
    tech: ['Python', 'PBKDF2', 'CLI', 'PyPI'],
    github: 'https://github.com/premsingh/terminal-notes-vault',
    demo: 'https://pypi.org/project/terminal-notes-vault/',
  },
  {
    name: 'CyberCity',
    description:
      'Smart contract wallet with conditional execution — schedule transactions based on on-chain conditions.',
    tech: ['Solidity', 'TypeScript', 'Hardhat', 'Ethers.js'],
    github: 'https://github.com/premsingh/cybercity',
    demo: '#',
  },
];

const TECH_COLORS = {
  FastAPI: '#009688',
  React: '#61dafb',
  'Databricks SQL': '#ff3621',
  OpenAI: '#412991',
  Solidity: '#363636',
  Wagmi: '#1e1e1e',
  Viem: '#1e1e1e',
  'Next.js': '#ffffff',
  MongoDB: '#4db33d',
  'GPT-4o-mini': '#412991',
  Tailwind: '#38bdf8',
  Python: '#3776ab',
  PBKDF2: '#e63946',
  CLI: '#00f0ff',
  PyPI: '#3775a9',
  TypeScript: '#3178c6',
  Hardhat: '#f0d500',
  'Ethers.js': '#2535a0',
};

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.project-card');
    if (!cards || cards.length === 0) return;

    // Set initial state explicitly
    gsap.set(cards, { y: 60, opacity: 0 });

    // Animate on scroll
    const tween = gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Refresh after a tick so Lenis scroll positions are synced
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(timer);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="projects" className="relative py-20">
      <div ref={sectionRef} className="section-container">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle mt-4 mb-12">
          A collection of projects spanning AI, Web3, and full-stack development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {PROJECTS.map((project) => (
            <Tilt
              key={project.name}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable
              glareMaxOpacity={0.08}
              glareColor="#00f0ff"
              glarePosition="all"
              glareBorderRadius="16px"
              scale={1.02}
              transitionSpeed={400}
            >
              <div className="project-card glass-card gradient-border p-6 h-full flex flex-col">
                {/* Project Name */}
                <h3 className="font-display text-xl font-bold mb-3 text-white">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-full"
                      style={{
                        background: `${TECH_COLORS[t] || '#333'}20`,
                        color: TECH_COLORS[t] || '#888',
                        border: `1px solid ${TECH_COLORS[t] || '#333'}40`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <FaGithub size={16} />
                    <span>Source</span>
                  </a>
                  {project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-cyan transition-colors duration-300"
                      style={{ color: '#00f0ff' }}
                    >
                      <FaExternalLinkAlt size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
