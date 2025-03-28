// app/layout.tsx

export const metadata = {
  title: "My Application",
  description: "An example Next.js application with layouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global Header */}
        <header style={{ padding: "1rem", backgroundColor: "#2D2E3B", color: "#FFFFFF" }}>
          <h1>videodubber-replica</h1>
        </header>

        {/* Main Content */}
        <main style={{ minHeight: "80vh" }}>{children}</main>

        {/* Global Footer */}
        <footer style={{ padding: "1rem", backgroundColor: "#1A1B1E", color: "#FFFFFF" }}>
          <p>&copy; 2025 My Application</p>
        </footer>
      </body>
    </html>
  );
}
