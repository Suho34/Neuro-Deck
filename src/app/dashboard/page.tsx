// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeckCard from "@/components/DeckCard";
import { getUserDecks } from "@/lib/decks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  AlertTriangle,
  BookOpen,
  Layers,
  PlayCircle,
} from "lucide-react";
import { FaGraduationCap } from "react-icons/fa";

interface DeckData {
  id: string;
  title: string;
  createdAt: string | Date;
  dueCardsCount: number;
  totalCardsCount: number;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/sign-in");

  let decks: DeckData[] = [];
  let error: string | null = null;
  let totalDueCards = 0;
  let totalCards = 0;

  try {
    decks = await getUserDecks(session.user.email);

    // Calculate totals
    totalDueCards = decks.reduce((sum, deck) => sum + deck.dueCardsCount, 0);
    totalCards = decks.reduce((sum, deck) => sum + deck.totalCardsCount, 0);
  } catch (err) {
    console.error("Error fetching decks:", err);
    error = "Could not fetch decks. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Welcome {session.user.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Here&apos;s a summary of your dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="overflow-x-auto">
            <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 mb-10">
              {/* Total Decks */}
              <Card className="min-w-[250px] bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Total Decks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {decks.length}
                  </div>
                  <div className="text-xs text-slate-500">
                    Active collections
                  </div>
                </CardContent>
              </Card>

              {/* Total Flashcards */}
              <Card className="min-w-[250px] bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    Total Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {totalCards}
                  </div>
                  <div className="text-xs text-slate-500">Cards created</div>
                </CardContent>
              </Card>

              {/* Cards Due */}
              <Link href="/study">
                <Card
                  className={`min-w-[250px] backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    totalDueCards > 0
                      ? "bg-gradient-to-br from-red-50 to-rose-100"
                      : "bg-gradient-to-br from-emerald-50 to-green-100"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className={`text-sm font-semibold uppercase tracking-wide flex items-center gap-2 ${
                        totalDueCards > 0 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          totalDueCards > 0
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      />
                      Cards Due Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-3xl font-bold mb-1 ${
                        totalDueCards > 0 ? "text-red-700" : "text-emerald-700"
                      }`}
                    >
                      {totalDueCards}
                    </div>
                    <div
                      className={`text-xs ${
                        totalDueCards > 0 ? "text-red-500" : "text-emerald-500"
                      }`}
                    >
                      {totalDueCards > 0 ? "Needs attention" : "All caught up!"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                My Learning Decks
              </h2>
              <p className="text-slate-600">
                Manage and study your flashcard collections
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/decks/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Deck
              </Link>
            </Button>
          </div>
        </div>

        {/* Call to Action for Due Cards */}
        {totalDueCards > 0 && (
          <div className="relative rounded-3xl p-10 m-4 text-center shadow-xl backdrop-blur-xl border border-white/20 bg-gradient-to-br from-slate-900/80 via-indigo-900/70 to-purple-900/60 overflow-hidden">
            {/* Floating glow elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-200" />

            <div className="relative z-10">
              {/* Icon with glow ring */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-70 animate-spin-slow"></div>
                <div className="relative w-full h-full rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                🔥 {totalDueCards} Card{totalDueCards !== 1 ? "s" : ""} Waiting
              </h3>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto leading-relaxed">
                Don't let your memory fade. Jump back in and keep building those
                <span className="font-semibold text-white">
                  {" "}
                  strong neural pathways
                </span>
                .
              </p>

              {/* CTA Button */}
              <Button
                asChild
                className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 font-semibold tracking-wide"
              >
                <Link href="/study" className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Start Review
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {decks.length === 0 && !error ? (
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-12 text-center shadow-xl">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Welcome to NeuroDeck!
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Ready to supercharge your learning? Create your first flashcard
                deck and start building knowledge that sticks.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/decks/new" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Deck
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Deck Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <DeckCard deck={deck} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
