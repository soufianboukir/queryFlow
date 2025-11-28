"use client";

import { SquarePlus } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { FeedbackDialogMailto } from "./feedback-dialog";

export function NavMain() {
  return (
    <SidebarMenu className="flex flex-col gap-3 ml-2">
      <SidebarMenuItem>
        <Link href={"/"} className="flex gap-2 items-center">
          <SquarePlus size={15} />
          <span>New chat</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <FeedbackDialogMailto />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
