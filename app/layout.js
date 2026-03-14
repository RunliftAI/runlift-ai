export const metadata = {
  title: "RunLift AI",
  description: "AI hybrid athlete training plan generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}