"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Login from "./o-auth-button";

export function AuthRequiredDialog() {

  return (
    <Dialog open={true}>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to use the chat feature.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">🔹 Why login is needed?</h3>
            <p>
              Logging in ensures your chat history is saved, secure, and only accessible by you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">🔹 How to login?</h3>
            <p>
              Click the <b>Sign in with google</b> button and authenticate with your google account to start chatting.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Login />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
