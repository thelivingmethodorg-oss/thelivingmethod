import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thelivingmethod.info"),
  title: {
    default: "The Living Method | Wabi-Sabi Wellness in Brooklyn",
    template: "%s | The Living Method",
  },
  description:
    "Explore breathwork, guided meditation, and elemental wellness with The Living Method, a Wabi-Sabi inspired sanctuary in Brooklyn, New York.",
  applicationName: "The Living Method",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Living Method",
    title: "The Living Method | Wabi-Sabi Wellness in Brooklyn",
    description:
      "Explore breathwork, guided meditation, and elemental wellness with The Living Method, a Wabi-Sabi inspired sanctuary in Brooklyn, New York.",
    url: "https://thelivingmethod.info",
  },
  twitter: {
    card: "summary",
    title: "The Living Method | Wabi-Sabi Wellness in Brooklyn",
    description:
      "Explore breathwork, guided meditation, and elemental wellness with The Living Method in Brooklyn, New York.",
  },
  category: "health",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-beige text-charcoal font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "The Living Method",
              url: "https://thelivingmethod.info",
              description:
                "A Wabi-Sabi inspired wellness practice offering breathwork, guided meditation, visualization, and elemental practices.",
              email: "hello@thelivingmethod.nyc",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1086 Myrtle Avenue",
                addressLocality: "Brooklyn",
                addressRegion: "NY",
                addressCountry: "US",
              },
              areaServed: ["Brooklyn", "New York City"],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
