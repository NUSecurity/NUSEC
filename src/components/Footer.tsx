import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cyber-darker border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold text-foreground">NUSEC</h3>
              <p className="text-xs text-muted-foreground">
                Northeastern University Security Club
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} NUSEC. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Building the Secure Community of tomorrow, today.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
