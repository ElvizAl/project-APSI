"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyEmailSchema, type VerifyEmailInput } from "@/lib/auth-schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { AppLogoIcon } from "@/components/icons"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState as useReactState } from "react"

export default function VerifyOtpClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""

  const [resendLoading, setResendLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useReactState(60)

  const canResend = countdown <= 0

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: VerifyEmailInput) {
    if (!emailParam) {
      toast.error("Email tidak ditemukan. Kembali ke halaman lupa password.")
      return
    }
    setIsLoading(true)
    // Validate the OTP before moving to next step
    const { data: result, error } = await authClient.emailOtp.checkVerificationOtp({
      email: emailParam,
      otp: data.code,
      type: "forget-password",
    })

    if (error) {
      toast.error(error.message || "Kode OTP tidak valid")
      form.setError("root", { message: error.message || "Kode OTP tidak valid" })
      setIsLoading(false)
      return
    }

    // OTP is valid → go to the reset password page
    router.push(`/auth/reset-password?email=${encodeURIComponent(emailParam)}&otp=${encodeURIComponent(data.code)}`)
  }

  async function handleResend() {
    if (!emailParam) {
      toast.error("Tidak ada email untuk mengirim ulang kode.")
      return
    }
    setResendLoading(true)
    setCountdown(60)
    await authClient.emailOtp.requestPasswordReset({ email: emailParam }, {
      onSuccess: () => {
        toast.success("Kode OTP telah dikirim ulang!")
        setResendLoading(false)
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
        setCountdown(0)
        setResendLoading(false)
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
              &ldquo;Satu langkah lagi untuk memulihkan akses akun Anda.&rdquo;
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
            <h1 className="text-2xl font-semibold tracking-tight">Masukkan Kode OTP</h1>
            <p className="text-sm text-muted-foreground">
              Kode OTP telah dikirimkan ke{" "}
              <br /><span className="font-medium text-foreground">{emailParam || "email Anda"}</span>
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="block text-sm text-center">Kode Verifikasi</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="w-full justify-center">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage className="text-center" />
                      {form.formState.errors.root && (
                        <p className="text-center text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
                      )}
                    </FormItem>
                  )}
                />

                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                  {isLoading ? "Memeriksa..." : "Verifikasi Kode"}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
              Tidak menerima kode?{" "}
              <Button
                variant="link"
                className="px-0 font-normal hover:text-primary"
                onClick={(e) => {
                  e.preventDefault()
                  handleResend()
                }}
                disabled={!canResend || resendLoading}
              >
                {resendLoading ? "Mengirim..." : canResend ? "Kirim Ulang" : `Kirim ulang dalam ${countdown}d`}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
