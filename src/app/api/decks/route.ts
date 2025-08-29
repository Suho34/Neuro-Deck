// app/api/decks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Deck from "@/models/Deck";
import Flashcard from "@/models/Flashcard";

/**
 * GET /api/decks
 * Fetch all decks for the logged-in user with optional due cards filter
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // --- Authorization Guard ---
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Check for due-only filter ---
    const { searchParams } = new URL(request.url);
    const dueOnly = searchParams.get("due") === "true";
    const withStats = searchParams.get("stats") === "true";

    // --- DB Connection ---
    await connectDB();

    // --- Query User Decks ---
    const decks = await Deck.find({ user: session.user.email })
      .sort({ createdAt: -1 }) // newest first
      .lean(); // convert to plain objects

    // --- Add due card counts and other stats if requested ---
    let enhancedDecks = decks;

    if (withStats || dueOnly) {
      enhancedDecks = await Promise.all(
        decks.map(async (deck) => {
          const dueCardsCount = await Flashcard.countDocuments({
            deckId: deck._id,
            userId: session.user.email,
            nextReview: { $lte: new Date() },
          });

          const totalCardsCount = await Flashcard.countDocuments({
            deckId: deck._id,
            userId: session.user.email,
          });

          return {
            ...deck,
            dueCardsCount,
            totalCardsCount,
            id: deck._id.toString(), // Add string ID for convenience
          };
        })
      );
    }

    // --- Filter for due-only if requested ---
    if (dueOnly) {
      enhancedDecks = enhancedDecks.filter((deck) => deck.dueCardsCount > 0);
    }

    return NextResponse.json(enhancedDecks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch decks", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/decks
 * Create a new deck for the logged-in user.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // --- Authorization Guard ---
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Parse Request ---
    const { title, description = "" } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // --- DB Connection ---
    await connectDB();

    // --- Create Deck ---
    const deck = await Deck.create({
      title: title.trim(),
      description: description.trim(),
      user: session.user.email,
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create deck", details: error.message },
      { status: 500 }
    );
  }
}
