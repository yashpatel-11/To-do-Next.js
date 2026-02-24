import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-6"
      style={{ backgroundImage: "url('/todo-bg.svg')" }}
    >
      <div className="text-center max-w-xl rounded-2xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur">
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
          Stay focused, organized, and calm
        </h1>

        <p className="text-slate-600 mb-8">
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
            className="px-6 py-2 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-white/80 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
