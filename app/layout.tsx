import "./globals.css";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { AuthProvider } from "../components/auth/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <AuthProvider>
          <Navbar />
          <div className="flex min-h-[calc(100vh-57px)]">
            <Sidebar />
            <main
              className="flex-1 bg-cover bg-center bg-no-repeat p-4 sm:p-6"
              style={{ backgroundImage: "url('/todo-bg.svg')" }}
            >
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
