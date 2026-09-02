import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MatrixRain from "@/components/animations/MatrixRain";
import { useNoIndex } from "@/hooks/use-noindex";

interface CtfLayoutProps {
  /** Where the back link goes and what it says. */
  backTo: string;
  backLabel: string;
  children: React.ReactNode;
}

/**
 * Shared shell for every /challenges/* page: the dark backdrop, the back link,
 * and the noindex tag that keeps these unlisted pages out of search results.
 */
const CtfLayout = ({ backTo, backLabel, children }: CtfLayoutProps) => {
  useNoIndex();

  return (
    <main className="relative min-h-screen bg-background">
      <MatrixRain className="pointer-events-none fixed inset-0 h-full w-full opacity-20" />

      <div className="relative z-10 container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <Link
          to={backTo}
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        {children}
      </div>
    </main>
  );
};

export default CtfLayout;
