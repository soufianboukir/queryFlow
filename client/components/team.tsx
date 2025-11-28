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
import { Users } from "lucide-react";
import Link from "next/link";

export function TeamDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2 items-center ml-1.5 cursor-pointer">
            <Users size={15}/>
            Team
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Our Team</DialogTitle>
          <DialogDescription>
            We are a group of students specializing in artificial intelligence and data science.
            Our work focuses on machine learning, data processing, and building intelligent solutions.
            The team members are:
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm flex gap-2 flex-col ml-5">
            <Link href={'https://soufianboukir.com'} className="hover:text-blue-500 duration-200" target="_blank">Soufian</Link>
            <Link href={'https://www.belalia.info/'} className="hover:text-blue-500 duration-200" target="_blank">Mohamed</Link>
            <Link href={'https://github.com/MouadELouichouani'} className="hover:text-blue-500 duration-200" target="_blank">Mouad</Link>
        </div>
            <DialogDescription>
                We collaborate on projects involving model development, data analysis, and the integration of AI into practical applications. Our objective is to gain advanced technical experience and build projects that strengthen our professional profiles. 
          </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
