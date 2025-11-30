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
import { Share } from "lucide-react";
import { toast } from "sonner";
import { useUpdateVisibility } from "@/hooks/use-history";

export function ChangeVisibility({
  id,
  hisVisibility,
  setToPublic,
  setUrl,
}: {
  id: string;
  setUrl: (url: string) => void;
  hisVisibility: "public" | "private";
  setToPublic: (toPublic: boolean) => void;
}) {
  const visibility = hisVisibility === "private" ? "public" : "private";
  const updateMutation = useUpdateVisibility();

  const handleEdit = async () => {
    updateMutation.mutate(
      { id, visibility },
      {
        onSuccess: (data: {
          message?: string;
          visibility?: "public" | "private";
          url?: string;
        }) => {
          toast.success(data.message || "Visibility updated successfully");
          if (data.visibility === "public" && data.url) {
            setToPublic(true);
            setUrl(data.url);
          }

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center gap-2 cursor-pointer">
          <Share className="text-muted-foreground" />
          <span>Share</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Visibility</DialogTitle>
          <DialogDescription>
            Are you sure you want to make this chat {visibility}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="secondary" data-delete-dialog-close>
              Close
            </Button>
          </DialogClose>

          <Button
            disabled={updateMutation.isPending}
            onClick={handleEdit}
            className="cursor-pointer"
          >
            {updateMutation.isPending
              ? "Editing..."
              : `Change to ${visibility}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
