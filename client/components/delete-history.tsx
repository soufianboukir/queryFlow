"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteHistory } from "@/hooks/use-history";

export function DeleteHistory({ id }: { id: string }) {
  const [text, setText] = useState("");
  const deleteMutation = useDeleteHistory();

  const handleDelete = async () => {
    if (text.trim().toLowerCase() !== "delete") return;

    deleteMutation.mutate(id, {
      onSuccess: (data: { message?: string }) => {
        toast.success(data.message || "History deleted successfully");
        setText("");

        const closeBtn = document.querySelector(
          "[data-delete-dialog-close]",
        ) as HTMLButtonElement | null;
        closeBtn?.click();
      },
      onError: () => {
        toast.error("An error occurred. Try again");
      },
    });
  };

  const valid = text.toLowerCase() === "delete";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center gap-2 cursor-pointer items-center">
          <Trash2 className="text-red-500" />
          <span className="text-red-500">Delete</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete history</DialogTitle>
          <DialogDescription>
            Type{" "}
            <strong className="dark:text-white/70 text-black/70">delete</strong>{" "}
            to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="delete"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="secondary" data-delete-dialog-close>
              Close
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={!valid || deleteMutation.isPending}
            onClick={handleDelete}
            className="cursor-pointer hover:bg-red-900 duration-150"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
