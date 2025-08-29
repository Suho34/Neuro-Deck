// app/study/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, BookOpen, CheckCircle2, Layers } from "lucide-react";

interface Deck {
  id: string;
  title: string;
  dueCardsCount: number;
}

export default function StudyPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDueDecks();
  }, []);

  const fetchDueDecks = async () => {
    try {
      const response = await fetch("/api/decks?due=true", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setDecks(data);
      }
    } catch (error) {
      toast.error("Error loading decks");
    } finally {
      setIsLoading(false);
    }
  };

  const totalDueCards = decks.reduce(
    (sum, deck) => sum + deck.dueCardsCount,
    0
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-lg font-medium">Loading study session...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold tracking-tight">Study Session</h1>
      </div>

      {totalDueCards === 0 ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-600 mb-6">
              You don’t have any cards due for review. Amazing work! 🎉
            </p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Study Overview */}
          <Card className="mb-8 bg-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Study Overview
                </h2>
                <p className="text-blue-700 mt-1">
                  You have{" "}
                  <span className="font-semibold">{totalDueCards}</span> card
                  {totalDueCards !== 1 ? "s" : ""} due across{" "}
                  <span className="font-semibold">{decks.length}</span> deck
                  {decks.length !== 1 ? "s" : ""}.
                </p>
              </div>
              <Button asChild className="md:w-auto w-full">
                <Link href={`/decks/${decks[0].id}/review`}>
                  Start First Deck
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Deck List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="hover:shadow-lg transition-all border border-gray-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {deck.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">{deck.dueCardsCount}</span>{" "}
                    card{deck.dueCardsCount !== 1 ? "s" : ""} due for review
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/decks/${deck.id}/review`}>Start Review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
