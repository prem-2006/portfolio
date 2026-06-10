import { useEffect, useRef } from 'react';
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiSolidity,
  SiCplusplus,
  SiReact,
  SiNextdotjs,
  SiFastapi,
  SiDjango,
  SiNodedotjs,
  SiExpress,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiVercel,
  SiOpenai,
  SiTensorflow,
  SiPytorch,
  SiEthereum,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiGit,
} from 'react-icons/si';
import { FaLink, FaDatabase, FaBrain, FaAws } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_GROUPS = [
  {
    category: 'Languages',
    color: '#e63946',
    skills: [
      { name: 'Python', icon: <SiPython /> },
      { name: 'JavaScript', icon: <SiJavascript /> },
      { name: 'TypeScript', icon: <SiTypescript /> },
      { name: 'Solidity', icon: <SiSolidity /> },
      { name: 'SQL', icon: <FaDatabase /> },
      { name: 'C++', icon: <SiCplusplus /> },
    ],
  },
  {
    category: 'Frameworks',
    color: '#00f0ff',
    skills: [
      { name: 'React', icon: <SiReact /> },
      { name: 'Next.js', icon: <SiNextdotjs /> },
      { name: 'FastAPI', icon: <SiFastapi /> },
      { name: 'Django', icon: <SiDjango /> },
      { name: 'Node.js', icon: <SiNodedotjs /> },
      { name: 'Express', icon: <SiExpress /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
    ],
  },
  {
    category: 'Cloud / DevOps',
    color: '#ff9f43',
    skills: [
      { name: 'AWS', icon: <FaAws /> },
      { name: 'Docker', icon: <SiDocker /> },
      { name: 'Kubernetes', icon: <SiKubernetes /> },
      { name: 'GitHub Actions', icon: <SiGithubactions /> },
      { name: 'Vercel', icon: <SiVercel /> },
      { name: 'Git', icon: <SiGit /> },
    ],
  },
  {
    category: 'AI / ML',
    color: '#a855f7',
    skills: [
      { name: 'OpenAI', icon: <SiOpenai /> },
      { name: 'LangChain', icon: <FaLink /> },
      { name: 'TensorFlow', icon: <SiTensorflow /> },
      { name: 'PyTorch', icon: <SiPytorch /> },
      { name: 'Hugging Face', icon: <FaBrain /> },
    ],
  },
  {
    category: 'Blockchain',
    color: '#f59e0b',
    skills: [
      { name: 'Ethereum', icon: <SiEthereum /> },
      { name: 'Hardhat', icon: <SiEthereum /> },
      { name: 'Wagmi', icon: <FaLink /> },
      { name: 'Viem', icon: <FaLink /> },
      { name: 'Flare Network', icon: <FaLink /> },
    ],
  },
  {
    category: 'Databases',
    color: '#10b981',
    skills: [
      { name: 'MongoDB', icon: <SiMongodb /> },
      { name: 'PostgreSQL', icon: <SiPostgresql /> },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const groups = sectionRef.current?.querySelectorAll('.skill-group');
    if (!groups || groups.length === 0) return;

    gsap.set(groups, { y: 40, opacity: 0 });

    const tween = gsap.to(groups, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: sectionRef.current,
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

  return (
    <section id="skills" className="relative py-20">
      <div ref={sectionRef} className="section-container">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle mt-4 mb-12">
          Technologies and tools I work with across the stack.
        </p>

        <div className="space-y-10 mt-8">
          {SKILL_GROUPS.map((group) => (
            <div key={group.category} className="skill-group">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color }}
                />
                <h3
                  className="font-mono text-sm font-semibold tracking-wider uppercase"
                  style={{ color: group.color }}
                >
                  {group.category}
                </h3>
                <div
                  className="flex-1 h-px"
                  style={{ background: `${group.color}20` }}
                />
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="skill-tag"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animation: `float ${6 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  >
                    <span style={{ color: group.color }}>{skill.icon}</span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
