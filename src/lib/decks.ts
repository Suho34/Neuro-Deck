// lib/decks.ts
import connectDB from "@/lib/mongodb";
import Deck from "@/models/Deck";
import Flashcard from "@/models/Flashcard";

export async function getUserDecks(userEmail: string) {
  try {
    await connectDB();

    // Get decks with flashcard counts and due card counts
    const decks = await Deck.find({ user: userEmail })
      .sort({ createdAt: -1 })
      .lean();

    // Get due card counts for each deck
    const decksWithStats = await Promise.all(
      decks.map(async (deck) => {
        const dueCardsCount = await Flashcard.countDocuments({
          deckId: deck._id,
          userId: userEmail,
          nextReview: { $lte: new Date() },
        });

        const totalCardsCount = await Flashcard.countDocuments({
          deckId: deck._id,
          userId: userEmail,
        });

        return {
          ...deck,
          dueCardsCount,
          totalCardsCount,
          id: deck._id.toString(),
        };
      })
    );

    return decksWithStats;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw new Error("Could not fetch decks");
  }
}
