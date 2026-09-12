import nusecEmblem from "@/assets/nusec-emblem.png";

const Footer = () => {
  return (
    <footer className="bg-cyber-darker border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src={nusecEmblem} alt="" className="h-8 w-8 object-contain" />
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
