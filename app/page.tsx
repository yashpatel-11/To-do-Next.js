import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          Stay focused, organized, and calm
        </h1>

        <p className="text-gray-600 mb-8">
          A simple and clean to-do application inspired by Microsoft To-Do,
          designed to help you plan your day and manage tasks efficiently.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
