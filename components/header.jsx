import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { LayoutDashboard, PenBox } from "lucide-react"
import { checkUser } from "@/lib/checkUser"
import HeaderMobileMenu from "./header-mobile-menu"

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

          <HeaderMobileMenu />
        </div>
      </nav>
    </div>
  )
}

export default Header