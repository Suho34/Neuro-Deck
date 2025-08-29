// app/decks/[deckId]/add-card/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    front: "",
    back: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/decks/${deckId}/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create flashcard");
      }

      await response.json();
      toast.success("Flashcard created successfully!");

      // Reset form and stay on page
      setFormData({ front: "", back: "" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create flashcard";
      toast.error(errorMessage);
      console.error("Error creating deck:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Add New Flashcard
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Create a question and answer to expand your deck.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Front */}
            <div className="space-y-2">
              <label
                htmlFor="front"
                className="text-sm font-medium text-gray-700"
              >
                Front (Question) <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="front"
                name="front"
                placeholder="Enter the question or term..."
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none"
                value={formData.front}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={4}
              />
            </div>

            {/* Back */}
            <div className="space-y-2">
              <label
                htmlFor="back"
                className="text-sm font-medium text-gray-700"
              >
                Back (Answer) <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="back"
                name="back"
                placeholder="Enter the answer or definition..."
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none"
                value={formData.back}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/decks/${deckId}`)}
                disabled={isLoading}
                className="flex-1 rounded-xl border-gray-300 hover:bg-gray-100 transition"
              >
                Back to Deck
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || !formData.front.trim() || !formData.back.trim()
                }
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
              >
                {isLoading ? "Creating..." : "Add Flashcard"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormData({ front: "", back: "" })}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
