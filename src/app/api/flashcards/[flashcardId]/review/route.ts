// app/api/flashcards/[flashcardId]/review/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Flashcard from "@/models/Flashcard";

interface Context {
  params: Promise<{ flashcardId: string }>;
}

// SM-2 Spaced Repetition Algorithm
function calculateNextReview(
  rating: "again" | "hard" | "good" | "easy",
  currentCard: any
) {
  let easeFactor = currentCard.easeFactor;
  let interval = currentCard.interval;
  const nextReview = new Date();

  switch (rating) {
    case "again":
      interval = 1; // Review again tomorrow
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case "hard":
      interval = Math.max(1, interval * 1.2);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case "good":
      interval = interval * easeFactor;
      break;
    case "easy":
      interval = interval * easeFactor * 1.3;
      easeFactor = easeFactor + 0.1;
      break;
  }

  // Add days to current date
  nextReview.setDate(nextReview.getDate() + Math.round(interval));

  return {
    interval: Math.round(interval),
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReview,
    reviewCount: currentCard.reviewCount + 1,
    difficulty: rating === "again" ? "hard" : rating,
  };
}

export async function POST(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flashcardId } = await context.params;
    const { rating } = await request.json();

    if (!["again", "hard", "good", "easy"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    await connectDB();

    // Verify user owns the flashcard
    const flashcard = await Flashcard.findOne({
      _id: flashcardId,
      userId: session.user.email,
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    // Calculate new intervals using SM-2 algorithm
    const newValues = calculateNextReview(rating, flashcard);

    // Update the flashcard
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      flashcardId,
      {
        $set: {
          interval: newValues.interval,
          easeFactor: newValues.easeFactor,
          nextReview: newValues.nextReview,
          reviewCount: newValues.reviewCount,
          difficulty: newValues.difficulty,
        },
      },
      { new: true }
    );

    return NextResponse.json(updatedFlashcard, { status: 200 });
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
