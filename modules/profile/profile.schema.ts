import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^(\+62|0)[0-9]+$/, "Format nomor HP tidak valid (gunakan 08xx atau +628xx)"),
  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
  zipcode: z
    .string()
    .length(5, "Kode pos harus 5 digit")
    .regex(/^[0-9]+$/, "Kode pos harus berupa angka"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
