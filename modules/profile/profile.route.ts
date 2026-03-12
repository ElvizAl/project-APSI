"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { profileSchema, type ProfileSchema } from "./profile.schema";
import { ambilProfilPengguna, simpanProfilPengguna } from "./profile.service";

// Ambil data profil pengguna yang sedang login
export async function ambilProfilAction() {
  const sesi = await auth.api.getSession({ headers: await headers() });

  if (!sesi) {
    return { error: "Sesi tidak ditemukan, silakan login kembali", data: null };
  }

  try {
    const profil = await ambilProfilPengguna(sesi.user.id);
    return { data: profil, error: null };
  } catch {
    return { error: "Gagal mengambil data profil", data: null };
  }
}

// Simpan atau perbarui profil pengguna
export async function perbaruiProfilAction(formData: ProfileSchema) {
  const sesi = await auth.api.getSession({ headers: await headers() });

  if (!sesi) {
    return { error: "Sesi tidak ditemukan, silakan login kembali", sukses: false };
  }

  const validasi = profileSchema.safeParse(formData);
  if (!validasi.success) {
    const pesanError = validasi.error.issues[0]?.message || "Validasi gagal";
    return { error: pesanError, sukses: false };
  }

  try {
    await simpanProfilPengguna(sesi.user.id, validasi.data);
    return { sukses: true, error: null };
  } catch {
    return { error: "Gagal menyimpan profil, silakan coba lagi", sukses: false };
  }
}
