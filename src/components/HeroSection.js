// components/HeroSection.js
"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function HeroSection() {
  const router = useRouter();

  
  return (
    <section className="relative  text-black py-16 md:py-24 lg:py-32 w-full " >
      <div className="container mx-auto px-6 md:flex md:items-center">
        {/* Left Side - Text */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Connect & Collaborate Across Disciplines
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Discover peers based on skills and interests, collaborate on projects, and expand your network.
          </p>
          <RegisterLink postLoginRedirectURL="/callback">
            <Button size="lg" >
              Get Started
            </Button>
          </RegisterLink>
        </div>

        {/* Right Side - Illustration */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <Image
            src="/image_processing20210822-26049-166mo30.jpg" 
            alt="Collaboration illustration"
            width={500}
            height={500}
            priority
            className="rounded-xl shadow-lg  w-[608px]"
          />
          {/* <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        >
          <source src="original-17abb2ebe4ade27f7228485c09ad38fb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        </div>
      </div>

      
    </section>
  );
}
  