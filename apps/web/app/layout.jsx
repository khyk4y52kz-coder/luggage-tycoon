import "@luggage-tycoon/game-ui/styles.css";

export const metadata = {
  title: "The Little Bag Factory",
  description: "Craft bags, sell them, upgrade your workshop, and grow your factory.",
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