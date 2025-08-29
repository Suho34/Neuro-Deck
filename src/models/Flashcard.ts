// models/Flashcard.ts (update this)
import mongoose, { Document, Schema } from "mongoose";

export interface IFlashcard extends Document {
  front: string;
  back: string;
  deckId: mongoose.Types.ObjectId;
  userId: string;
  difficulty: "easy" | "medium" | "hard";
  interval: number; // Days until next review
  easeFactor: number; // How easy the card is (SM-2 algorithm)
  nextReview: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema: Schema = new Schema(
  {
    front: {
      type: String,
      required: [true, "Front text is required"],
      trim: true,
      maxlength: [1000, "Front text cannot be more than 1000 characters"],
    },
    back: {
      type: String,
      required: [true, "Back text is required"],
      trim: true,
      maxlength: [1000, "Back text cannot be more than 1000 characters"],
    },
    deckId: {
      type: Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    interval: {
      type: Number,
      default: 1, // Days until next review
    },
    easeFactor: {
      type: Number,
      default: 2.5, // SM-2 default ease factor
    },
    nextReview: {
      type: Date,
      default: Date.now,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
FlashcardSchema.index({ deckId: 1, userId: 1 });
FlashcardSchema.index({ userId: 1, nextReview: 1 }); // For due cards query

export default mongoose.models.Flashcard ||
  mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);
