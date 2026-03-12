"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AppLogoIcon } from "@/components/icons"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password harus terdiri dari minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung setidaknya satu huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung setidaknya satu angka"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type NewPasswordInput = z.infer<typeof newPasswordSchema>

export default function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const otpParam = searchParams.get("otp") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: NewPasswordInput) {
    if (!emailParam || !otpParam) {
      toast.error("Data tidak lengkap. Silakan ulangi proses dari awal.")
      return
    }
    setIsLoading(true)
    await authClient.emailOtp.resetPassword({
      email: emailParam,
      otp: otpParam,
      password: data.password,
    }, {
      onSuccess: () => {
        toast.success("Password berhasil diubah! Silakan login.")
        router.push("/auth/sign-in")
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Gagal mengubah password")
        setIsLoading(false)
      },
    })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Left Pane */}
      <div className="relative hidden w-1/2 flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3183&auto=format&fit=crop"
            alt="Luxury Car"
            className="h-full w-full object-cover opacity-40 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>
        
        <div className="relative z-20 flex items-center text-lg font-bold">
          <AppLogoIcon className="mr-2 h-8 fill-current text-white sm:h-10" />
          GLOTOMOTIF
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-2xl font-semibold tracking-tight">
              &ldquo;Platform e-commerce otomotif terlengkap untuk menemukan kendaraan impian Anda.&rdquo;
            </p>
            <footer className="text-sm tracking-wide text-zinc-300">Tim Glotomotif</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center lg:hidden">
              <AppLogoIcon className="h-10 fill-current text-zinc-900 dark:text-zinc-100 sm:h-12" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Buat Password Baru</h1>
            <p className="text-sm text-muted-foreground">
              Masukkan password baru untuk akun{" "}
              <span className="font-medium text-foreground">{emailParam || "Anda"}</span>.
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm">Password Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm">Konfirmasi Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
