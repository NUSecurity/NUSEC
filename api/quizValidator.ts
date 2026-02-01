// api/validate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Answers stored ONLY on the server - never sent to client
const ANSWERS: Record<number, string> = {
  1: "2025-09-13",
  2: "28.02968845564392, -82.82074467963191",
  3: "Caladesi Island",
  4: "Instagram",
  5: "Norway",
  6: "Serbia",
  7: "109.233.191.130",
  8: "CVE-2025-23048"
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questionId, answer } = req.body;

  // Validate input
  if (!questionId || !answer) {
    return res.status(400).json({ error: 'Missing questionId or answer' });
  }

  const correctAnswer = ANSWERS[questionId];
  
  // Check if question exists
  if (!correctAnswer) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Normalize and compare answers (case-insensitive, trimmed)
  const isCorrect = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  
  // Only return whether it's correct, never the actual answer
  return res.status(200).json({ correct: isCorrect });
}