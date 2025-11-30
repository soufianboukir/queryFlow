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
import { FolderPen } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTitle } from "@/hooks/use-history";

export function RenameHistory({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [titleInput, setTitleInput] = useState(title || "");
  const updateMutation = useUpdateTitle();

  const handleEdit = async () => {
    if (titleInput.trim().toLowerCase() === "") return;

    updateMutation.mutate(
      { id, title: titleInput },
      {
        onSuccess: (data: { message?: string; title?: string }) => {
          toast.success(data.message || "Title updated successfully");
          setTitleInput("");

          const closeBtn = document.querySelector(
            "[data-delete-dialog-close]",
          ) as HTMLButtonElement | null;
          closeBtn?.click();
        },
        onError: () => {
          toast.error("An error occurred. Try again");
        },
      }
    );
  };

  const valid = titleInput.trim().length > 0;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center gap-2 cursor-pointer">
          <FolderPen className="text-muted-foreground" />
          <span>Rename</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit title</DialogTitle>
          <DialogDescription>
            Type your new title and press edit.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Your title"
          onKeyDown={(e) => e.stopPropagation()}
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="secondary" data-delete-dialog-close>
              Close
            </Button>
          </DialogClose>

          <Button
            disabled={!valid || updateMutation.isPending}
            onClick={handleEdit}
            className="cursor-pointer"
          >
            {updateMutation.isPending ? "Editing..." : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
