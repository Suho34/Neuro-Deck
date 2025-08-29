// models/Deck.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDeck extends Document {
  title: string;
  description?: string;
  user: string;
  isPublic: boolean;
  cards: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// models/Deck.ts (update the cards field)
const DeckSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    user: {
      type: String,
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Flashcard",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Check if model already exists to prevent OverwriteModelError
export default mongoose.models.Deck ||
  mongoose.model<IDeck>("Deck", DeckSchema);
