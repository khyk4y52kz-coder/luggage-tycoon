import "./globals.css";

export const metadata = {
  title: "Bag Business Tycoon",
  description: "Craft bags, sell them, upgrade your workshop, and build a brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}