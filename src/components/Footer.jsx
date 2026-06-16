import { FaLinkedinIn, FaXTwitter, FaGithub, FaHeart } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm font-mono">
          © {new Date().getFullYear()} Prem Singh. All rights reserved.
        </p>

        <p className="text-gray-600 text-sm flex items-center gap-1">
          Built with <FaHeart className="text-accent" size={12} /> using React & Three.js
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/prem-2006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-300"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/prem-singh-5b2709379/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href="https://x.com/prem_singh_20"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-300"
            aria-label="X / Twitter"
          >
            <FaXTwitter size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
