"use client";
import {Menu, X} from "lucide-react";
import {usePathname} from "next/navigation";
import React, {useState} from "react";
import SellFilter from "./SellFilter";
import JobsFilter from "./JobsFilter";

export default function PostsFilter() {
  const [filterState, setFilterState] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div
        className={` xmd:hidden max-xmd:flex items-center max-xmd::w-full xmd:w-[600px] max-xmd:fixed z-10 max-xmd:top-20 max-xmd:pb-2 max-xmd:gap-3  max-xmd:px-8 max-xmd:left-0`}
      >
        <div
          className="flex items-center gap-2 max-xmd:bg-popover max-xmd:px-3 max-xmd:py-2 cursor-pointer transition-all duration-300 hover:bg-secondary"
          onClick={() => {
            setFilterState(true);
          }}
        >
          <Menu />
          Filter
        </div>
      </div>
      <div
        className={`${
          filterState ? "block translate-x-[250px]" : "opacity-0 translate-x-0"
        } xmd:hidden transition-all duration-300 fixed z-[200] top-3 bg-popover p-2 rounded-full cursor-pointer hover:bg-secondary`}
        onClick={() => {
          setFilterState(false);
        }}
      >
        <X />
      </div>
      <div
        className={`${
          filterState ? "max-xmd:translate-x-0" : "max-xmd:-translate-x-full"
        } w-[250px] h-[calc(100svh-80px)] overflow-auto rounded-lg sticky top-[80px] shrink-0 bg-popover max-xmd:fixed max-xmd:left-0 max-xmd:top-0 max-xmd:h-full max-xmd:z-[100] max-xmd:rounded-l-none max-xmd:p-2 transition-all duration-300`}
      >
        {pathname.startsWith("/buy-sell") ? (
          <div>
            <SellFilter />
          </div>
        ) : (
          <div>
            <JobsFilter />
          </div>
        )}
      </div>
    </>
  );
}
