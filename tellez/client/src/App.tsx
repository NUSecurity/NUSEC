import { Board } from "@/pages/Board";
import { Join } from "@/pages/Join";
import { Play } from "@/pages/Play";
import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Play />} />
      <Route path="/join" element={<Join />} />
      {/* Unlisted and password-gated. Never linked from the game. */}
      <Route path="/board" element={<Board />} />
      <Route path="*" element={<Play />} />
    </Routes>
  );
}
