import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import quizData from "../../quiz.json";
import { QuizQuestion } from "@/types";
import MatrixRain from "@/components/animations/MatrixRain";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const questions: QuizQuestion[] = quizData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [isRevisiting, setIsRevisiting] = useState(false);

  const nav = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        answer: userAnswer
      })
    });

    const data = await response.json();

    if (data.correct) {
      setIsCorrect(true);
      setShowHint(false);
      setCompletedQuestions(prev => new Set(prev).add(currentQuestionIndex));
      
      // Move to next question or complete quiz
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setIsRevisiting(false);
        } else {
          setIsComplete(true);
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      setShowHint(true);
    }
  } catch (error) {
    console.error('Error validating answer:', error);
    // Handle error (show error message to user)
  }
};

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowHint(false);
      setIsRevisiting(true);
    }
  };

  const handleNext = () => {
    if (
      currentQuestionIndex < questions.length - 1 &&
      completedQuestions.has(currentQuestionIndex)
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
      setShowHint(false);
      setIsRevisiting(true);
    }
  };

  if (isComplete) {
    return (
      <>
        <MatrixRain className="absolute inset-0 w-full h-full opacity-50" />
        <div className="min-h-screen flex flex-col gap-8 items-center justify-center bg-black">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl text-center z-50"
          >
            <h1 className="text-4xl font-bold text-black mb-4">
              OMG! You did it!
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              You are officially an{" "}
              <span className="text-purple-600 font-bold">OSINT Master</span>!
            </p>
            <p className="text-lg text-gray-600 italic">
              Remember: With great power comes great responsibility.
            </p>
          </motion.div>
          <Button className="z-50" onClick={() => nav("/")}>
            <MoveLeftIcon /> Back
          </Button>
        </div>
      </>
    );
  }

  const getBorderColor = () => {
    if (isCorrect === true) return "border-green-500";
    if (isCorrect === false) return "border-red-500";
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div
            className={`bg-white rounded-lg shadow-2xl p-8 border-4 transition-colors duration-300 ${getBorderColor()}`}
          >
            {/* Progress indicator */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedQuestions.size / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Show if question is already completed AND user navigated back */}
            {isRevisiting && completedQuestions.has(currentQuestionIndex) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
              >
                You already got this right! Coming back for more? Enjoy!
              </motion.div>
            )}

            {/* Hint */}
           
            {showHint && currentQuestion.hint && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-yellow-600 mb-4"
              >
                💡 Hint: {currentQuestion.hint}
              </motion.p>
            )} 

            {/* Answer input form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500 transition-colors text-black"
                autoFocus
              />

              {/* Feedback message */}
              {isCorrect === false && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 font-semibold mb-4"
                >
                  ❌ Try again!
                </motion.p>
              )}

              {isCorrect === true && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-500 font-semibold mb-4"
                >
                  ✅ Correct!
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
              >
                Submit Answer
              </button>
            </form>

            {/* Navigation buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={
                  currentQuestionIndex === questions.length - 1 ||
                  !completedQuestions.has(currentQuestionIndex)
                }
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
