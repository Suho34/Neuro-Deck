// app/decks/[deckId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  });

  useEffect(() => {
    fetchDeck();
  }, [deckId]);

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}`);
      if (response.ok) {
        const deck = await response.json();
        setFormData({
          title: deck.title,
          description: deck.description || "",
          isPublic: deck.isPublic || false,
        });
      }
    } catch (error) {
      toast.error("Error loading deck");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update deck");
      }

      toast.success("Deck updated successfully!");
      router.push(`/decks/${deckId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update deck");
      console.error("Error updating deck:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  return (
    <Card className="h-auto  flex flex-col justify-between bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      {/* Header matches DeckCard */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <BookOpen size={18} />
            </div>
            <h3 className="font-semibold text-slate-800">Edit Deck</h3>
          </div>
        </div>
      </CardHeader>

      {/* Form content */}
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Deck Title *
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter deck title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what this deck is about"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Footer buttons same alignment as DeckCard */}
          <CardFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/decks/${deckId}`)}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Updating..." : "Update Deck"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
