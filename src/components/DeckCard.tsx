import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BookOpen, Calendar, Layers } from "lucide-react";

interface Deck {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  totalCardsCount?: number;
  dueCardsCount?: number;
  createdAt: string;
}

interface DeckCardProps {
  deck: Deck;
}

export default function DeckCard({ deck }: DeckCardProps) {
  const deckId = deck._id || deck.id;
  const dueCardsCount = deck.dueCardsCount || 0;
  const totalCardsCount = deck.totalCardsCount || 0;

  return (
    <Card className="h-56 flex flex-col justify-between bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <BookOpen size={18} />
            </div>
            <h3 className="font-semibold text-slate-800 line-clamp-1">
              {deck.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-slate-600 line-clamp-3">
          {deck.description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Layers size={14} /> {totalCardsCount} cards
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />{" "}
            {new Date(deck.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/decks/${deckId}`}>View</Link>
          </Button>
          <Button
            size="sm"
            asChild
            variant={dueCardsCount > 0 ? "default" : "outline"}
            className={
              dueCardsCount > 0
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }
          >
            <Link href={`/decks/${deckId}/review`}>
              {dueCardsCount > 0 ? `Review (${dueCardsCount})` : "Study"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
