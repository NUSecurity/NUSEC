import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nusecLogo from "@/assets/nusec-logo.png";
import GlitchText from "@/components/animations/GlitchText";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src={nusecLogo} alt="NUSEC Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                <GlitchText text="NUSEC" intensity="low" />
              </h1>
              <p className="text-xs text-muted-foreground">Security Club</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("activities")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Activities
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Join
            </button>

            {/* Route navigation */}
            {/*<button
              type="button"
	                    onClick={() => navigate("/halloffame")} 
              className="text-foreground hover:text-primary transition-colors"
            >
              HALL OF FAME!!!
            </button> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("activities")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Activities & Calendar
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/halloffame");
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                HALL OF FAME!!!
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
