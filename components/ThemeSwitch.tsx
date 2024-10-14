"use client";

import * as React from "react";
import {Computer, Moon, MoonIcon, Sun, SunIcon} from "lucide-react";
import {useTheme} from "next-themes";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface props {
  menu?: boolean;
  className?: any;
}

export function ThemeSwitch({menu, className}: props) {
  const {theme, setTheme} = useTheme();

  return (
    <div className={className}>
      {!menu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="max-sm:w-[30px] max-sm:h-[30px]"
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
            align="end"
            className="space-y-1"
          >
            <DropdownMenuItem
              className={`${
                theme == "light" && "bg-muted"
              } flex items-center gap-3`}
              onClick={() => {
                setTheme("light");
              }}
            >
              <SunIcon />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${
                theme == "dark" && "bg-muted"
              } flex items-center gap-3`}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${
                theme == "system" && "bg-muted"
              } flex items-center gap-3`}
              onClick={() => setTheme("system")}
            >
              <Computer />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuItem
            className={`${
              theme == "light" && "bg-muted"
            } flex items-center gap-3`}
            onClick={() => {
              setTheme("light");
            }}
          >
            <SunIcon />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${
              theme == "dark" && "bg-muted"
            } flex items-center gap-3`}
            onClick={() => setTheme("dark")}
          >
            <MoonIcon />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${
              theme == "system" && "bg-muted"
            } flex items-center gap-3`}
            onClick={() => setTheme("system")}
          >
            <Computer />
            System
          </DropdownMenuItem>
        </>
      )}
    </div>
  );
}
