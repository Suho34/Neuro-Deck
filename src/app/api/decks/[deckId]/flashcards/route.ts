// app/api/decks/[deckId]/flashcards/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Flashcard from "@/models/Flashcard";
import Deck from "@/models/Deck";

interface Context {
  params: Promise<{ deckId: string }>;
}

// GET - Get all flashcards for a deck
export async function GET(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deckId } = await context.params;
    await connectDB();

    // Verify user owns the deck
    const deck = await Deck.findOne({ _id: deckId, user: session.user.email });
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const flashcards = await Flashcard.find({
      deckId,
      userId: session.user.email,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(flashcards, { status: 200 });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new flashcard in a deck
export async function POST(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deckId } = await context.params;
    const { front, back } = await request.json();

    if (!front || !back) {
      return NextResponse.json(
        { error: "Front and back text are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user owns the deck
    const deck = await Deck.findOne({ _id: deckId, user: session.user.email });
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const flashcard = await Flashcard.create({
      front,
      back,
      deckId,
      userId: session.user.email,
    });

    // Add flashcard to deck's cards array
    await Deck.findByIdAndUpdate(deckId, {
      $push: { cards: flashcard._id },
    });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
