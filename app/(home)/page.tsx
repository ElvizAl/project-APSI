import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";

export const metadata: Metadata = {
  title: 'Beranda – Temukan Mobil Impian Anda',
  description:
    'Temukan ribuan pilihan mobil bekas berkualitas di Glotomotif. Lulus inspeksi 150 titik, garansi mesin 1 tahun, proses beli mudah.',
  alternates: { canonical: 'https://www.glotomotif.my.id' },
  openGraph: {
    title: 'Glotomotif – Temukan Mobil Impian Anda',
    description: 'Marketplace mobil bekas terpercaya. 500+ unit tersedia, garansi 1 tahun.',
    url: 'https://www.glotomotif.my.id',
  },
};

export default function Home() {
  return (
    <div>
      <HeroCarousel />
    </div>
  );
}
