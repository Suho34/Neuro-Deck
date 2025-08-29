// app/decks/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewDeckPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create deck");
      }

      const deck = await response.json();
      toast.success("Deck created successfully!");
      router.push(`/decks/${deck._id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create deck");
      console.error("Error creating deck:", error);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create New Deck
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Add a title and description to start your flashcard journey.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Deck Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter deck title"
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this deck is about (optional)"
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
                className="flex-1 rounded-xl border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim()}
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
              >
                {isLoading ? "Creating..." : "Create Deck"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
