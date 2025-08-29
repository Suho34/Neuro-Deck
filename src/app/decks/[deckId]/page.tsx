// app/decks/[deckId]/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Deck from "@/models/Deck";
import Flashcard from "@/models/Flashcard";
import { Plus, FileQuestion } from "lucide-react";
import { IoMdInformationCircle } from "react-icons/io";
import { PiCardsFill } from "react-icons/pi";
import DeleteDeckButton from "@/components/DeleteDeckButton";

interface PageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const { deckId } = await params;
  let deck = null;
  let flashcards: unknown[] = [];

  try {
    await connectDB();

    // Fetch the deck
    deck = await Deck.findOne({
      _id: deckId,
      user: session.user.email,
    });

    // If deck exists, fetch its flashcards
    if (deck) {
      flashcards = await Flashcard.find({
        deckId: deck._id,
        userId: session.user.email,
      })
        .sort({ createdAt: -1 })
        .lean();
    }
  } catch (error) {
    console.error("Error fetching deck or flashcards:", error);
  }

  if (!deck) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Deck Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The deck you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Type guard function to check if a flashcard has the expected properties
  const isFlashcard = (
    card: unknown
  ): card is {
    _id: { toString: () => string };
    front: string;
    back: string;
    difficulty?: string;
    createdAt: string | Date;
  } => {
    return (
      typeof card === "object" &&
      card !== null &&
      "_id" in card &&
      "front" in card &&
      "back" in card
    );
  };

  // Filter and type-guard the flashcards
  const validFlashcards = flashcards.filter(isFlashcard);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {deck.title}
              </h1>
              {deck.description && (
                <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                  {deck.description}
                </p>
              )}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full bg-rose-400 self-start sm:self-auto"
            >
              <Link href="/dashboard">← Dashboard</Link>
            </Button>
          </div>

          {/* Deck Info */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-gray-800">
              <IoMdInformationCircle className="w-7 h-7 text-gray-700" />
              Deck Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block font-medium text-gray-700">Created</span>
                <p className="text-gray-600 mt-1">
                  {new Date(deck.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block font-medium text-gray-700">
                  Total Cards
                </span>
                <p className="text-gray-600 mt-1">
                  {validFlashcards.length} cards
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Deck Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="rounded-xl bg-amber-300 hover:bg-amber-500"
              >
                <Link href={`/decks/${deckId}/review`}>Start Review</Link>
              </Button>
              <Button
                asChild
                className="bg-indigo-500 hover:bg-indigo-700 rounded-xl"
              >
                <Link href={`/decks/${deckId}/add-card`}>Add Flashcards</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-xl">
                <Link href={`/decks/${deckId}/edit`}>Edit Deck</Link>
              </Button>
              <DeleteDeckButton deckId={deckId} deckTitle={deck.title} />
            </div>
          </section>

          {/* Flashcards Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <PiCardsFill className="w-7 h-7 text-gray-700" />
                Flashcards ({validFlashcards.length})
              </h2>
            </div>

            {validFlashcards.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                {/* Icon container */}
                <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-inner border">
                  <FileQuestion className="w-10 h-10 text-gray-500" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Flashcards Yet
                </h3>

                {/* Description */}
                <p className="text-gray-500 mb-6 max-w-sm">
                  This deck is waiting for its first flashcard. Add a card and
                  start building your study journey today.
                </p>

                {/* CTA */}
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl flex items-center gap-2"
                >
                  <Link
                    href={`/decks/${deckId}/add-card`}
                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5 " />
                    Add Your First Flashcard
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {validFlashcards.slice(0, 4).map((flashcard) => (
                  <div
                    key={flashcard._id.toString()}
                    className="p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Front
                      </h4>
                      <p className="text-gray-900 text-sm mt-1 line-clamp-2">
                        {flashcard.front}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Back
                      </h4>
                      <p className="text-gray-900 text-sm mt-1 line-clamp-2">
                        {flashcard.back}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 border-t pt-3">
                      Created:{" "}
                      {new Date(flashcard.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                {validFlashcards.length > 4 && (
                  <div className="border rounded-xl p-6 text-center bg-gray-50">
                    <p className="text-gray-600 mb-3">
                      + {validFlashcards.length - 4} more flashcards
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-green-400"
                    >
                      <Link href={`/decks/${deckId}/cards`}>
                        View All Flashcards
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Study Progress */}
          {validFlashcards.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                📊 Study Progress
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-blue-50 p-5 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">
                    {validFlashcards.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Cards</div>
                </div>
                <div className="bg-green-50 p-5 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">
                    {
                      validFlashcards.filter(
                        (card) => card.difficulty === "easy"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-700">Easy</div>
                </div>
                <div className="bg-yellow-50 p-5 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-600">
                    {
                      validFlashcards.filter(
                        (card) => card.difficulty === "medium"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-700">Medium</div>
                </div>
                <div className="bg-red-50 p-5 rounded-xl">
                  <div className="text-3xl font-bold text-red-600">
                    {
                      validFlashcards.filter(
                        (card) => card.difficulty === "hard"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-red-700">Hard</div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
