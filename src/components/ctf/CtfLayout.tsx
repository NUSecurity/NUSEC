import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MatrixRain from "@/components/animations/MatrixRain";
import { Button } from "@/components/ui/button";
import { useNoIndex } from "@/hooks/use-noindex";
import { cn } from "@/lib/utils";

interface CtfLayoutProps {
  /** Where the Back button goes. Omit to render no Back button. */
  backTo?: string;
  /** Widens the column for content that needs it, like the packet table. */
  wide?: boolean;
  children: React.ReactNode;
}

/**
 * Shared shell for the /challenges/* and /tools/* pages: the dark backdrop,
 * the optional Back button, and the noindex tag that keeps these unlisted
 * pages out of search results.
 */
const CtfLayout = ({ backTo, wide = false, children }: CtfLayoutProps) => {
  useNoIndex();

  return (
    <main className="relative min-h-screen bg-background">
      <MatrixRain className="pointer-events-none fixed inset-0 h-full w-full opacity-20" />

      <div
        className={cn(
          "relative z-10 container mx-auto px-4 py-12 md:py-16",
          wide ? "max-w-6xl" : "max-w-3xl",
        )}
      >
        {backTo && (
          <Button asChild variant="outline" size="sm" className="mb-8">
            <Link to={backTo}>
              <ChevronLeft />
              Back
            </Link>
          </Button>
        )}

        {children}
      </div>
    </main>
  );
};

export default CtfLayout;
