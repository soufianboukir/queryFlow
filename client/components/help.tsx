"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2 items-center ml-1.5 cursor-pointer">
          <HelpCircle size={15} />
          Help
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            Here you&apos;ll find guidance on how to use QueryFlow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">🔹 What is QueryFlow?</h3>
            <p>
              A web‐based FAQ chatbot for the software & technology domain.
              Users can ask basic technical questions and get answers
              automatically from a curated FAQ dataset.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">🔹 How to rename a chat?</h3>
            <p>
              Open the menu of any history item and select <b>Rename</b>. Enter
              the new title and save.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">🔹 How to change visibility?</h3>
            <p>
              Choose <b>Visibility</b> from the dropdown and set the chat to{" "}
              <b>Public</b> or <b>Private</b>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">🔹 How do I share a chat?</h3>
            <p>
              Use the <b>Share</b> option to copy a link that anyone can open.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">🔹 Still need help?</h3>
            <p>
              You can send feedback or questions using the Feedback button in
              the menu.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
