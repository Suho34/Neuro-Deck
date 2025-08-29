"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  PartyPopper,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface Flashcard {
  _id: string;
  front: string;
  back: string;
  difficulty: string;
  reviewCount: number;
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
  });

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch(`/api/decks/${deckId}/flashcards`);
        if (response.ok) {
          const data = await response.json();
          setFlashcards(data);
        } else {
          throw new Error("Failed to fetch flashcards");
        }
      } catch (error) {
        toast.error("Error loading flashcards");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashcards();
  }, [deckId]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleRating = async (rating: "hard" | "good" | "easy") => {
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentIndex];

    try {
      const response = await fetch(
        `/api/flashcards/${currentCard._id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );

      if (!response.ok) throw new Error("Failed to update card");

      // update session stats
      setSessionStats((prev) => ({
        reviewed: prev.reviewed + 1,
        correct:
          prev.correct + (rating === "good" || rating === "easy" ? 1 : 0),
        incorrect: prev.incorrect + (rating === "hard" ? 1 : 0),
      }));

      // go to next card or finish
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        toast.success("Review session completed! 🎉");
        setTimeout(() => {
          router.push(`/decks/${deckId}`);
        }, 2000);
      }
    } catch (error) {
      toast.error("Error updating card");
      console.error("Error:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse opacity-20 scale-110"></div>
            <Loader2 className="relative h-16 w-16 animate-spin text-blue-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Loading Flashcards
            </h2>
            <p className="text-slate-600 font-medium">
              Preparing your study session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-12 max-w-lg text-center">
          <div className="mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              No Flashcards Yet
            </h1>
            <p className="text-slate-600 leading-relaxed text-lg">
              This deck is waiting for your first flashcard. Ready to start
              building your knowledge?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8"
            >
              <Link href={`/decks/${deckId}/add-card`}>
                <Zap className="h-5 w-5 mr-2" />
                Add Flashcards
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-200 hover:bg-slate-50 rounded-2xl px-8"
            >
              <Link href={`/decks/${deckId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deck
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active state
  const currentCard = flashcards[currentIndex];
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">No more cards to review</p>
          <Button
            onClick={() => router.push(`/decks/${deckId}`)}
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl"
          >
            Back to Deck
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / flashcards.length) * 100;
  const accuracy =
    sessionStats.reviewed > 0
      ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        {/* Header with Progress */}
        <div className="mb-6 md:mb-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-600 mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">
                  Card{" "}
                  <span className="text-slate-900 font-bold">
                    {currentIndex + 1}
                  </span>{" "}
                  of {flashcards.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
            <div className="relative w-full h-2 md:h-3 bg-slate-200/50 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out rounded-full shadow-sm"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              {sessionStats.reviewed}
            </div>
            <div className="text-sm font-medium text-slate-600">Reviewed</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
              {sessionStats.correct}
            </div>
            <div className="text-sm font-medium text-slate-600">Correct</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-1">
              {sessionStats.incorrect}
            </div>
            <div className="text-sm font-medium text-slate-600">Incorrect</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-1">
              {accuracy}%
            </div>
            <div className="text-sm font-medium text-slate-600">Accuracy</div>
          </div>
        </div>

        {/* Enhanced Flashcard */}
        <div className="relative mb-6 md:mb-8">
          <Card
            className={`cursor-pointer backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden group ${
              isFlipped
                ? "bg-gradient-to-br from-emerald-50/90 to-green-50/90 hover:from-emerald-100/90 hover:to-green-100/90"
                : "bg-gradient-to-br from-blue-50/90 to-indigo-50/90 hover:from-blue-100/90 hover:to-indigo-100/90"
            }`}
            onClick={handleFlip}
          >
            <div
              className={`absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                isFlipped
                  ? "bg-gradient-to-br from-emerald-600/8 via-transparent to-green-600/8"
                  : "bg-gradient-to-br from-blue-600/8 via-transparent to-indigo-600/8"
              }`}
            />

            <CardHeader className="relative z-10 pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
              <CardTitle
                className={`text-center text-lg md:text-xl font-bold flex items-center justify-center space-x-2 transition-colors duration-500 ${
                  isFlipped ? "text-emerald-700" : "text-blue-700"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                    isFlipped
                      ? "bg-emerald-500 shadow-emerald-300"
                      : "bg-blue-500 shadow-blue-300"
                  } shadow-lg`}
                />
                <span className="transition-all duration-300">
                  {isFlipped ? "Answer" : "Question"}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 text-center min-h-[200px] md:min-h-[280px] flex items-center justify-center px-4 md:px-8 pb-6 md:pb-8">
              <div
                key={isFlipped ? "answer" : "question"}
                className={`font-bold leading-relaxed tracking-tight animate-in fade-in duration-500 transition-colors  text-lg sm:text-xl md:text-2xl lg:text-3xl ${
                  isFlipped ? "text-emerald-800" : "text-blue-800"
                }`}
              >
                {currentCard
                  ? isFlipped
                    ? currentCard.back
                    : currentCard.front
                  : "Loading..."}
              </div>
            </CardContent>

            <div
              className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ${
                isFlipped
                  ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
                  : "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
              } shadow-lg`}
            />
          </Card>

          <div className="text-center mt-4 md:mt-6">
            <p
              className={`text-xs md:text-sm font-medium bg-white/50 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2 inline-block transition-all duration-300 ${
                isFlipped ? "text-emerald-600" : "text-blue-600"
              }`}
            >
              Tap card to {isFlipped ? "see question" : "reveal answer"}
            </p>
          </div>
        </div>

        {/* Enhanced Rating Buttons */}
        {isFlipped && (
          <div className="mb-6 md:mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-br from-orange-50 to-red-50 text-orange-700 border-orange-200/50 hover:from-orange-100 hover:to-red-100 hover:border-orange-300 rounded-xl md:rounded-2xl h-12 md:h-16 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleRating("hard")}
              >
                <XCircle className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                <div className="text-left">
                  <div className="font-bold text-sm md:text-base">Hard</div>
                  <div className="text-xs opacity-80 hidden sm:block">
                    Need more practice
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/50 hover:from-emerald-100 hover:to-green-100 hover:border-emerald-300 rounded-xl md:rounded-2xl h-12 md:h-16 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleRating("good")}
              >
                <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                <div className="text-left">
                  <div className="font-bold text-sm md:text-base">Good</div>
                  <div className="text-xs opacity-80 hidden sm:block">
                    Got it right
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 rounded-xl md:rounded-2xl h-12 md:h-16 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleRating("easy")}
              >
                <PartyPopper className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3" />
                <div className="text-left">
                  <div className="font-bold text-sm md:text-base">Easy</div>
                  <div className="text-xs opacity-80 hidden sm:block">
                    Too simple
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl md:rounded-2xl px-6 md:px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            onClick={() => router.push(`/decks/${deckId}`)}
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Exit Review
          </Button>

          {!isFlipped && (
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl md:rounded-2xl px-8 md:px-10 font-bold w-full sm:w-auto"
              onClick={handleFlip}
            >
              <Zap className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Reveal Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
