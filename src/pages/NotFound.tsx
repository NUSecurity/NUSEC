import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import GlitchText from "@/components/animations/GlitchText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            <GlitchText text="404" intensity="low" />
          </span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Oops! This page doesn't exist.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-primary hover:bg-primary text-white px-8 py-3 text-lg font-semibold"
        >
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
