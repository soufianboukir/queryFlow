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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquareShare } from "lucide-react";

export function FeedbackDialogMailto() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const subject = "Feedback for QueryFlow";
  const to = "soufianeboukir0@gmail.com";

  const buildMailto = (to: string, subject: string, body: string) => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    return `mailto:${to}?subject=${s}&body=${b}`;
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const body = `\n\n---\nFeedback from QueryFlow user:\n\n${message.trim()}`;
    const href = buildMailto(to, subject, body);

    window.location.href = href;

    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2 items-center cursor-pointer">
            <MessageSquareShare size={15}/>
            <span>Feedback</span>
          </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            This will open your mail client so you can send feedback directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={subject} className="mt-1" readOnly />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              className="mt-1"
              placeholder="Write your feedback here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSend} disabled={!message.trim()}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
