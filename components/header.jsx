import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { LayoutDashboard, PenBox, Menu } from "lucide-react"
import { checkUser } from "@/lib/checkUser"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet"

const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
        <Link href='/'>
          <Image
            src={'/logo2.png'}
            alt="finance tracker logo"
            height={60}
            width={200}
            className="h-auto w-32 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <Link href={'/dashboard'} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
              <Button variant='outline'>
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href={'/transaction/create'}>
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant='outline'>Login</Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <SignedIn>
                  <Link href={'/dashboard'} className="w-full">
                    <Button variant='outline' className="w-full justify-start gap-2">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Button>
                  </Link>

                  <Link href={'/transaction/create'} className="w-full">
                    <Button className="w-full justify-start gap-2">
                      <PenBox size={18} />
                      Add Transaction
                    </Button>
                  </Link>
                </SignedIn>

                <SignedOut>
                  <SignInButton forceRedirectUrl="/">
                    <Button variant='outline' className="w-full">Login</Button>
                  </SignInButton>
                  <SignUpButton forceRedirectUrl="/">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  )
}

export default Header