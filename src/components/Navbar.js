"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  
  const aboutClick = () => {
    router.push("/about");
  };
  const featureClick = () => {
    router.push("/feature");
  };
  const contactClick = () => {
    router.push("/contact");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="w-full bg-white text-black py-4 border-b-2 border-gray">
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Collab.io
          </Link>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMobileMenu}
          >
            <span className="text-2xl">&#9776;</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="font-bold">
              About
            </Link>
            <Link href="/contact" className="font-bold">
              Contact
            </Link>
            <Link href="/features" className="font-bold">
              Features
            </Link>
            <LoginLink postLoginRedirectURL="/callback">
            <Button
              variant="default"
              className="border-white text-white hover:bg-gray-800"
              
            >
              Login
            </Button>
            </LoginLink>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex justify-end">
          <div className="bg-white w-80 h-full p-6 relative shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-2xl text-gray-700"
              onClick={toggleMobileMenu}
            >
              &times;
            </button>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col mt-12 space-y-6">
              <Link href="/about" className="font-bold text-lg" onClick={aboutClick}>
                About
              </Link>
              <Link href="/contact" className="font-bold text-lg" onClick={contactClick}>
                Contact
              </Link>
              <Link href="/features" className="font-bold text-lg" onClick={featureClick}>
                Features
              </Link>

              {/* Mobile Login Button */}
              <LoginLink postLoginRedirectURL="/callback" >
              <Button
                variant="default"
                className="border-gray-900 text-white bg-gray-800 hover:bg-gray-700 mt-6 flex items-center justify-center"
                onClick={() => {
                  
                  toggleMobileMenu();
                }}
              >
                Login <LuLogIn className="ml-2" />
              </Button>
              </LoginLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
