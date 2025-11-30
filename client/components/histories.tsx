"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DeleteHistory } from "./delete-history";
import { RenameHistory } from "./rename-history";
import { ChangeVisibility } from "./change-visibility";
import { ChatLink } from "./chat-link";
import { useHistories } from "@/hooks/use-history";

type HistoryItem = {
  _id: string;
  url: string;
  title: string;
  visibility: "public" | "private";
};

export function Histories() {
  const { isMobile } = useSidebar();
  const { data, isLoading: loading } = useHistories();
  const [toPublic, setToPublic] = useState(false);
  const [url, setUrl] = useState("");

  // Extract histories from response (handle different response shapes)
  const histories: HistoryItem[] =
    data?.histories && Array.isArray(data.histories)
      ? data.histories
      : Array.isArray(data)
      ? data
      : [];

  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem className="h-8 animate-pulse">
            <SidebarMenuButton>
              <span>Loading history...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (histories.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem className="h-8">
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <span>No chats yet.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {histories.map((item) => (
          <SidebarMenuItem key={item.url} className="h-8">
            <SidebarMenuButton
              asChild
              isActive={"/chat/" + item.url === window.location.pathname}
            >
              <Link href={`/chat/${item.url}`} title={item.title}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-46 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <ChangeVisibility
                    id={item._id}
                    hisVisibility={item.visibility}
                    setUrl={setUrl}
                    setToPublic={setToPublic}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <RenameHistory id={item._id} title={item.title} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <DeleteHistory id={item._id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {toPublic && <ChatLink url={url} />}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
