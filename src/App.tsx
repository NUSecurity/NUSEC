import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Quiz from "./pages/Quiz";
import MeetingPage from "./pages/ctf/MeetingPage";
import ChallengePage from "./pages/ctf/ChallengePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/osint-quiz" element={<Quiz />} />

          {/*
            Mini-CTF at /challenges/mini-ctf. Unlisted on purpose: nothing on the
            site links here, and bare /challenges renders the 404 so the meeting
            slug has to be known. Both routes are driven by src/ctf/meetings —
            swapping in a new meeting needs no route changes.
          */}
          <Route path="/challenges/:meetingSlug" element={<MeetingPage />} />
          <Route
            path="/challenges/:meetingSlug/:challengeSlug"
            element={<ChallengePage />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
