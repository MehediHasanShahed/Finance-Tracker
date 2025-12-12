"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { LayoutDashboard, Menu, PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

const HeaderMobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="px-6">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-4 mt-8">
          <SignedIn>
            <Link
              href={"/dashboard"}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <Button variant="outline" className="w-full justify-start gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </Button>
            </Link>

            <Link
              href={"/transaction/create"}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <Button className="w-full justify-start gap-2">
                <PenBox size={18} />
                Add Transaction
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Login
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/">
              <Button className="w-full" onClick={() => setOpen(false)}>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderMobileMenu;
