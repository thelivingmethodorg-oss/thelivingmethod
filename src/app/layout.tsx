import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { revalidatePath } from "next/cache";
import { Refresher } from "cms-renderer/lib/refresher";
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
  title: "The Living Method • Wabi-Sabi Wellness",
  description:
    "Rooted in Wabi-Sabi. Guided by the elements. A sanctuary for those ready to live more fully.",
};

async function revalidate() {
  "use server";
  revalidatePath("/", "layout");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-beige text-charcoal font-sans antialiased">
        {children}
        <Refresher
          websiteId={process.env.NEXT_PUBLIC_PROFOUND_WEBSITE_ID ?? ""}
          cmsUrl={process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cms.dev.tryprofound.com"}
          apiKey={process.env.PROFOUND_API_KEY ?? ""}
          onInvalidate={revalidate}
        />
      </body>
    </html>
  );
}
