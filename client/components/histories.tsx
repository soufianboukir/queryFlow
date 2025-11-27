"use client";

import { FolderPen, MoreHorizontal, Share, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

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
import { getHistories } from "@/services/history";

type HistoryItem = {
  id: number;
  url: string;
  title: string;
};

export function Histories() {
  const { isMobile } = useSidebar();

  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          console.error("Authentication token not found.");
          setLoading(false);
          return;
        }

        const response = await getHistories(token)

        if (response.status !== 200) {
          throw new Error(`Failed to fetch histories`);
        }


        if (response.data.histories && Array.isArray(response.data.histories)) {
          setHistories(response.data.histories);
        } else {
          setHistories(response.data);
        }
      } catch (error) {
        console.error("Error fetching chat histories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

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
            <SidebarMenuButton asChild>
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
                <DropdownMenuItem className="cursor-pointer">
                  <Share className="text-muted-foreground" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FolderPen className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2 className="text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
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
