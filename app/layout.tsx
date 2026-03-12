import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { PageLoader } from "@/components/ui/page-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.glotomotif.my.id'),
  title: {
    default: 'Glotomotif – Jual Beli Mobil Bekas Terpercaya',
    template: '%s | Glotomotif',
  },
  description:
    'Glotomotif adalah platform jual beli mobil bekas terpercaya di Indonesia. Lebih dari 500 unit tersedia, lulus inspeksi 150 titik, garansi mesin & transmisi 1 tahun.',
  keywords: [
    'jual beli mobil bekas',
    'mobil bekas terpercaya',
    'beli mobil bekas',
    'jual mobil',
    'tukar tambah mobil',
    'glotomotif',
    'marketplace mobil',
  ],
  authors: [{ name: 'Glotomotif' }],
  creator: 'Glotomotif',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://www.glotomotif.my.id',
    siteName: 'Glotomotif',
    title: 'Glotomotif – Jual Beli Mobil Bekas Terpercaya',
    description:
      'Platform jual beli mobil bekas terpercaya di Indonesia. Lulus inspeksi 150 titik, garansi 1 tahun.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Glotomotif – Jual Beli Mobil Bekas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glotomotif – Jual Beli Mobil Bekas Terpercaya',
    description:
      'Platform jual beli mobil bekas terpercaya di Indonesia. Lulus inspeksi 150 titik, garansi 1 tahun.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.glotomotif.my.id',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="hsl(var(--primary))"
          height={3}
          showSpinner={false}
          speed={200}
          easing="ease"
          shadow={false}
        />
        <PageLoader />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
