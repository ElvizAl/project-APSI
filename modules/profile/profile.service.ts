import prisma from "@/lib/prisma";
import type { ProfileSchema } from "./profile.schema";

// Ambil profil berdasarkan ID pengguna
export async function ambilProfilPengguna(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

// Buat atau perbarui profil pengguna
export async function simpanProfilPengguna(userId: string, data: ProfileSchema) {
  return prisma.profile.upsert({
    where: { userId },
    update: {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      zipcode: data.zipcode,
    },
    create: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      zipcode: data.zipcode,
    },
  });
}
