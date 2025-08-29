// app/api/decks/[deckId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Deck from "@/models/Deck";
import Flashcard from "@/models/Flashcard";

interface Context {
  params: Promise<{ deckId: string }>;
}

/**
 * GET /api/decks/[deckId]
 * Get a specific deck
 */
export async function GET(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deckId } = await context.params;
    await connectDB();

    const deck = await Deck.findOne({
      _id: deckId,
      user: session.user.email,
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json(deck, { status: 200 });
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/decks/[deckId]
 * Delete a deck and all its flashcards
 */
export async function DELETE(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deckId } = await context.params;
    await connectDB();

    // Verify user owns the deck
    const deck = await Deck.findOne({
      _id: deckId,
      user: session.user.email,
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Delete all flashcards in this deck
    await Flashcard.deleteMany({
      deckId: deckId,
      userId: session.user.email,
    });

    // Delete the deck itself
    await Deck.findByIdAndDelete(deckId);

    return NextResponse.json(
      { message: "Deck and all its flashcards deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/decks/[deckId]
 * Update a deck (optional but useful)
 */
export async function PUT(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deckId } = await context.params;
    const { title, description, isPublic } = await request.json();

    await connectDB();

    // Verify user owns the deck
    const deck = await Deck.findOne({
      _id: deckId,
      user: session.user.email,
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Update the deck
    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      {
        title: title || deck.title,
        description: description !== undefined ? description : deck.description,
        isPublic: isPublic !== undefined ? isPublic : deck.isPublic,
      },
      { new: true }
    );

    return NextResponse.json(updatedDeck, { status: 200 });
  } catch (error) {
    console.error("Error updating deck:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
