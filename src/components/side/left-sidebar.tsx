"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { GearIcon, HomeIcon, RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

const LeftSidebar: React.FC = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: HomeIcon,
        label: "홈화면",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: GearIcon,
        label: "설정",
        active: pathname === "/setting",
        href: "/setting",
      },
    ],
    [pathname]
  );

  return (
    <div className="h-screen flex flex-col gap-y-2 border-r bg-slate-200 dark:bg-slate-900 w-[64px] py-4">
      {/* 아이콘 */}
      <section className="flex items-center justify-center group w-full aspect-1">
        <RocketIcon className="dark:text-slate-400 transition duration-300 dark:group-hover:text-slate-200 group-hover:animate-spin text-2xl" />
      </section>

      {/* 사이 간격을 다 채우는 빈 박스 */}
      <div className="flex-1"></div>

      {/* route / darkmodetoggle */}
      <section className="flex flex-col">
        {routes.map((item: any) => {
          return (
            <TooltipProvider key={item.label}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "w-[64px] transform hover:-translate-y-[2px] transition duration-300 aspect-square flex items-center justify-center hover:bg-border",
                      item.active &&
                        "text-primary hover:text-primary dark:hover:text-primary"
                    )}
                  >
                    <item.icon width={24} height={24} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </section>

      <div className="px-2 my-1">
        <Separator className="bg-slate-300 dark:bg-slate-700" />
      </div>

      <section className="flex items-center justify-center">
        <div className="">
          <ModeToggle />
        </div>
      </section>
    </div>
  );
};

export default LeftSidebar;
