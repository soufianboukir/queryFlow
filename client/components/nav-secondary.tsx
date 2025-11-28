import React from "react";
import { GithubIcon, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HelpDialog } from "./help";
import { TeamDialog } from "./team";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: React.ReactNode;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="flex flex-col gap-3">
            <a className="flex gap-2 items-center ml-1.5" href="https://github.com/soufianboukir/queryFlow" target="_blank">
              <GithubIcon size={15}/>
              <span>Github</span>
            </a>

            <HelpDialog />

            <TeamDialog />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
