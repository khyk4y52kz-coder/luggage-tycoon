export const metadata = {
  title: "Bag Business Tycoon",
  description: "Craft bags, sell them, upgrade your workshop, and build a brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}