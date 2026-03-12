import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Nama harus terdiri dari minimal 2 karakter'),
  email: z.email('Silakan masukkan alamat email yang valid'),
  password: z.string()
    .min(8, 'Password harus terdiri dari minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung setidaknya satu huruf kapital')
    .regex(/[0-9]/, 'Password harus mengandung setidaknya satu angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email('Silakan masukkan alamat email yang valid'),
  password: z.string().min(1, 'Password harus diisi'),
})

export const forgetPasswordSchema = z.object({
  email: z.string().email('Silakan masukkan alamat email yang valid'),
})

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Kode OTP harus 6 karakter'),
  password: z.string()
    .min(8, 'Password harus terdiri dari minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung setidaknya satu huruf kapital')
    .regex(/[0-9]/, 'Password harus mengandung setidaknya satu angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

export const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Nama depan harus terdiri dari minimal 2 karakter'),
  lastName: z.string().min(2, 'Nama belakang harus terdiri dari minimal 2 karakter'),
  email: z.string().email('Silakan masukkan alamat email yang valid'),
  phone: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini harus diisi'),
  newPassword: z.string()
    .min(8, 'Password harus terdiri dari minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung setidaknya satu huruf kapital')
    .regex(/[0-9]/, 'Password harus mengandung setidaknya satu angka'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Password baru harus berbeda dari password saat ini",
  path: ["newPassword"],
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>
