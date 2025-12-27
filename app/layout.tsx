import SPAHost from "./[[...slug]]/page";
import "./globals.css";

export const metadata = {
  title: "MCP Platform",
  description: "Multi-Agent Control Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <SPAHost/>
      </body>
    </html>
  );
}