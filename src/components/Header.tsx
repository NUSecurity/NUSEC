import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import nusecEmblem from "@/assets/nusec-emblem.png";
import GlitchText from "@/components/animations/GlitchText";
import { scrollToSection } from "@/lib/scroll";

/** Sections on the landing page, in nav order. */
const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Join" },
];

/** Pages that are not part of the landing page, shown after the sections. */
const pages = [{ to: "/bench", label: "Career Bench" }];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToSection = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const linkStyles = "text-foreground hover:text-primary transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img
              src={nusecEmblem}
              alt="NUSEC Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                <GlitchText text="NUSEC" intensity="low" />
              </h1>
              <p className="text-xs text-muted-foreground">Security Club</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => goToSection(id)}
                className={linkStyles}
              >
                {label}
              </button>
            ))}
            {pages.map(({ to, label }) => (
              <Link key={to} to={to} className={linkStyles}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => goToSection(id)}
                  className={`text-left ${linkStyles}`}
                >
                  {label}
                </button>
              ))}
              {pages.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-left ${linkStyles}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
