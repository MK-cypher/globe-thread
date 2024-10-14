"use client";

// import Cart from "@/components/cart";
import {useUser} from "@/context/userContext";
import Link from "next/link";
import {useState} from "react";
import {ModeToggle} from "./ui/ModeToggle";
import AvatarMenu from "./avatarMenu";
// import Category from "./category";
// import Searchbar from "./searchbar";
import {buttonVariants} from "./ui/button";
import {navLinks} from "@/lib/consts";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

export default function Navbar() {
  const userData = useUser();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className={`${navOpen ? "md:bg-background" : "bg-background"}  fixed w-full z-[100] mb-32 shadow-sm nav-bar`}>
      <div
        className={`${
          navOpen ? "" : "max-md:bg-background"
        } container flex gap-2 items-center py-5 max-md:justify-between `}
      >
        <Logo />
        <div className="w-full max-md:hidden flex justify-end items-center gap-4">
          <NavLinks setNavOpen={setNavOpen} />
        </div>
        <div className="md:hidden flex items-center gap-5">
          <div className="md:hidden flex items-center gap-5">
            {userData ? (
              <div className="md:hidden flex items-center relative z-[100] gap-3">
                <AvatarMenu userData={userData} />
              </div>
            ) : (
              <div className="z-[199]">
                <ModeToggle />
              </div>
            )}
          </div>
          <div
            className="md:hidden max-md:z-50 space-y-2 cursor-pointer transition-all duration-300"
            onClick={() => {
              setNavOpen(!navOpen);
            }}
          >
            <div
              className={`${
                navOpen ? "rotate-45 translate-y-[5px]" : ""
              } w-5 h-0.5 bg-foreground transition-all duration-300`}
            ></div>
            <div className={`${navOpen ? "hidden" : ""} w-7 h-0.5 bg-foreground transition-all duration-300`}></div>
            <div
              className={`${
                navOpen ? "-rotate-45 -translate-y-[5px]" : ""
              } w-5 h-0.5 bg-foreground transition-all duration-300`}
            ></div>
          </div>
        </div>
        <div
          className={`${
            navOpen ? " max-md:right-0 backdrop-blur-sm" : " max-md:-right-full"
          } md:w-fit max-md:w-full gap-5 ml-3 max-md:transition-all max-md:top-0 max-md:duration-300 max-md:fixed max-md:flex-col max-md:z-40 max-md:h-full max-md:justify-start max-md:pt-28 max-md:pl-5 max-md:pr-5 max-md:gap-5 max-md:bg-background/50 flex justify-between items-center`}
        >
          <div className="md:hidden w-full max-md:bg-secondary max-md:rounded-lg">
            <NavLinks setNavOpen={setNavOpen} />
          </div>
          <div className="flex items-center max-md:w-full gap-4 max-md:flex-col max-md:gap-5">
            {userData ? (
              <></>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`${buttonVariants({
                    variant: "secondary",
                  })} max-md:w-full`}
                >
                  Login
                </Link>
                <Link href="/signup" className={`${buttonVariants()} max-md:w-full`}>
                  Sign up
                </Link>
              </>
            )}
            <div className="max-md:hidden">{userData ? <AvatarMenu userData={userData} /> : <ModeToggle />}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
