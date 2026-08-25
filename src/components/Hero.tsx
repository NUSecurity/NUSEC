import { Shield, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatrixRain from "@/components/animations/MatrixRain";
import GlitchText from "@/components/animations/GlitchText";
import TerminalText from "@/components/animations/TerminalText";
import CircuitBoard from "@/components/animations/CircuitBoard";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden"
    >
      {/* Matrix Rain Background */}
      <MatrixRain className="absolute inset-0 w-full h-full opacity-30" />

      {/* Circuit Board Pattern */}
      <CircuitBoard className="absolute inset-0 w-full h-full" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMjcwIDk1JSA2MCUgLyAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                <GlitchText text="NUSECURITY" intensity="low" />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              <TerminalText text="Security Club" speed={100} />
            </p>
            <p className="text-lg text-cyber-gray">
              <TerminalText
                text="Growing the security community, one byte at a time"
                speed={30}
              />
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-card p-4 rounded-full mb-2">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Professionalism
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gradient-card p-4 rounded-full mb-2">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Community</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gradient-card p-4 rounded-full mb-2">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Education</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              className="bg-gradient-primary hover:bg-primary text-white px-8 py-3 text-lg font-semibold"
              onClick={() => scrollToSection("about")}
            >
              Learn More
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg"
              onClick={() => scrollToSection("contact")}
            >
              Join Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
