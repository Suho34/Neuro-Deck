"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteDeckButtonProps {
  deckId: string;
  deckTitle: string;
}

export default function DeleteDeckButton({
  deckId,
  deckTitle,
}: DeleteDeckButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete deck");
      }

      toast.success("Deck deleted successfully");
      router.push("/dashboard");
      router.refresh(); // Refresh the page to update the deck list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete deck");
      console.error("Error deleting deck:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoading ? "Deleting..." : "Delete Deck"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 text-white border border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            This action cannot be undone. This will permanently delete the deck
            &quot;{deckTitle}&quot; and all of its flashcards.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
