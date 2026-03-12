"use client";

import { useEffect, useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "@/modules/profile/profile.schema";
import { ambilProfilAction, perbaruiProfilAction } from "@/modules/profile/profile.route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  User, Phone, MapPin, Hash, Loader2,
  Pencil, CheckCircle2,
} from "lucide-react";

type Mode = "muat" | "isi" | "lihat" | "ubah";

interface InfoBaris {
  ikon: React.ElementType;
  label: string;
  nilai: string;
}

function InfoBaris({ ikon: Ikon, label, nilai }: InfoBaris) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-zinc-100 last:border-0">
      <div className="mt-0.5 p-2 bg-zinc-100 rounded-lg shrink-0">
        <Ikon className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-zinc-800 mt-0.5 break-words">{nilai}</p>
      </div>
    </div>
  );
}

export function ProfileForm() {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<Mode>("muat");
  const [dataTersimpan, setDataTersimpan] = useState<ProfileSchema | null>(null);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      zipcode: "",
    },
  });

  // Muat profil yang sudah ada saat komponen pertama kali dibuka
  useEffect(() => {
    startTransition(async () => {
      const hasil = await ambilProfilAction();
      if (hasil.data) {
        const data: ProfileSchema = {
          fullName: hasil.data.fullName,
          phone: hasil.data.phone,
          address: hasil.data.address,
          zipcode: hasil.data.zipcode,
        };
        setDataTersimpan(data);
        form.reset(data);
        setMode("lihat"); // Sudah ada data → tampilkan mode lihat
      } else {
        setMode("isi"); // Belum ada profil → tampilkan form kosong
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUbah() {
    setMode("ubah");
  }

  function handleBatal() {
    if (dataTersimpan) {
      form.reset(dataTersimpan);
    }
    setMode("lihat");
  }

  function onSubmit(values: ProfileSchema) {
    startTransition(async () => {
      const hasil = await perbaruiProfilAction(values);
      if (hasil.sukses) {
        setDataTersimpan(values);
        setMode("lihat"); // Kembali ke mode lihat setelah berhasil simpan
        toast.success("Profil berhasil disimpan! 🚗");
      } else {
        toast.error(hasil.error ?? "Terjadi kesalahan");
      }
    });
  }

  // ─── Mode: Memuat data ───────────────────────────────────────────────────
  if (mode === "muat") {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm">Memuat profil...</span>
      </div>
    );
  }

  // ─── Mode: Lihat (profil sudah diisi) ────────────────────────────────────
  if (mode === "lihat" && dataTersimpan) {
    return (
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold">Profil lengkap</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUbah}
            className="rounded-full gap-2 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah Profil
          </Button>
        </div>

        {/* Data */}
        <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 divide-y divide-zinc-100">
          <InfoBaris ikon={User} label="Nama Lengkap" nilai={dataTersimpan.fullName} />
          <InfoBaris ikon={Phone} label="Nomor HP" nilai={dataTersimpan.phone} />
          <InfoBaris ikon={MapPin} label="Alamat Lengkap" nilai={dataTersimpan.address} />
          <InfoBaris ikon={Hash} label="Kode Pos" nilai={dataTersimpan.zipcode} />
        </div>
      </div>
    );
  }

  // ─── Mode: Form (isi pertama kali / sedang ubah) ─────────────────────────
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informasi Pribadi */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Informasi Pribadi</p>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">Nama Lengkap</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      {...field}
                      placeholder="Masukkan nama lengkap Anda"
                      className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:border-primary"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">Nomor HP</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      {...field}
                      placeholder="Contoh: 08123456789"
                      className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:border-primary"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Alamat Pengiriman */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Alamat Pengiriman</p>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">Alamat Lengkap</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                    <Textarea
                      {...field}
                      placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
                      className="pl-10 min-h-[100px] bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:border-primary resize-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">Kode Pos</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      {...field}
                      placeholder="Contoh: 12345"
                      maxLength={5}
                      className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:border-primary max-w-[200px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          {mode === "ubah" && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBatal}
              disabled={isPending}
              className="flex-1 h-11 rounded-full"
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 h-11 rounded-full font-semibold bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Profil"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
