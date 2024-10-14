import {navLinks} from "@/lib/consts";
import Link from "next/link";
import React from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {usePathname} from "next/navigation";

export default function NavLinks({setNavOpen}: {setNavOpen: any}) {
  const pathname = usePathname();
  return (
    <>
      {navLinks.links.map((item, i) => (
        <div key={i} className="max-md:p-3 ">
          <Link
            href={item.href}
            className={`${
              pathname.includes(item.href) ? "max-md:bg-popover" : ""
            } link max-md:block text-start max-md:w-full max-md:p-3 max-md:hover:bg-popover rounded-lg whitespace-nowrap`}
            onClick={() => {
              setNavOpen(false);
            }}
          >
            {item.title}
          </Link>
        </div>
      ))}
      <div className="max-md:p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 max-md:w-full max-md:p-3">
            Posts <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[100] max-md:w-[calc(100svw-40px)]">
            {navLinks.posts.map((item, i) => (
              <DropdownMenuItem className="p-0" key={i}>
                <Link href={item.href} className="w-full px-2 py-1.5">
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
