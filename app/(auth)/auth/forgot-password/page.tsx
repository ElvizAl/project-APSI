// This page has been refactored: client logic is in forgot-password-client.tsx
// Keeping as-is but wrapping with generateMetadata
"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgetPasswordSchema, type ForgetPasswordInput } from "@/lib/auth-schemas"
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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const emailForm = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onEmailSubmit(data: ForgetPasswordInput) {
    setIsLoading(true)
    await authClient.emailOtp.requestPasswordReset({
      email: data.email,
    }, {
      onRequest: () => {},
      onSuccess: () => {
        toast.success("Kode OTP telah dikirim ke email Anda")
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`)
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Gagal mengirim OTP")
        setIsLoading(false)
      }
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
            <h1 className="text-2xl font-semibold tracking-tight">Lupa Password</h1>
            <p className="text-sm text-muted-foreground">
              Masukkan email Anda untuk menerima kode OTP.
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contoh@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </Button>
              </form>
            </Form>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/sign-in"
              className="flex items-center justify-center underline underline-offset-4 hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
