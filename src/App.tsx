import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MeetingPage from "./pages/ctf/MeetingPage";
import ChallengePage from "./pages/ctf/ChallengePage";
import PcapAnalyzer from "./pages/tools/PcapAnalyzer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/*
            Hands On Practice at /challenges/hands-on-practice. Unlisted on
            purpose: nothing on the site links here, and bare /challenges
            renders the 404 so the meeting slug has to be known. Both routes
            are driven by src/ctf/meetings — swapping in a new meeting needs no
            route changes.
          */}
          <Route path="/challenges/:meetingSlug" element={<MeetingPage />} />
          <Route
            path="/challenges/:meetingSlug/:challengeSlug"
            element={<ChallengePage />}
          />

          {/*
            Challenge tooling, kept outside /challenges so a tool can be reused
            by any meeting that needs it.
          */}
          <Route path="/tools/pcap" element={<PcapAnalyzer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
