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
      <body>
        <AuthProvider>
          <Navbar />
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main style={{ flex: 1, padding: "16px" }}>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
