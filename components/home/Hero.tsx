"use client";

import { useRouter } from "next/navigation";
import Button from "../ui/button";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
        Stay focused, organized, and calm
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        A simple to-do app inspired by Microsoft To-Do to help you plan your day
        and manage tasks effectively.
      </p>
    
      <div className="flex gap-4">
        <Button onClick={() => router.push("/auth/register")}>
          Get Started
        </Button>

        <Button
          variant="secondary"
          onClick={() => router.push("/auth/login")}
        >
          Sign In
        </Button>
      </div>
    </section>
  );
};

export default Hero;
