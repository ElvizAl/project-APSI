'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@/lib/auth-schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons, AppLogoIcon } from '@/components/icons'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const session = authClient.useSession()

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: SignInInput) {
    setIsLoading(true)
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    }, {
      onRequest: () => {
        // toast.info("Signing in...")
      },
      onSuccess: (ctx) => {
        toast.success("Berhasil Login")
        if (ctx.data?.user?.role === "admin") {
          router.push("/dashboard")
          return
        }
        router.push("/profile")
      },
      onError: (ctx) => {
        form.setError('root', {
          message: ctx.error.message,
        })
        toast.error(ctx.error.message)
        setIsLoading(false)
      }
    })
  }

  async function handleSocialSignIn() {
    await authClient.signIn.social({
      provider : "google",
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        toast.success("Signed in with successfully!")
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Left Pane - Automotive Image & Branding */}
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

      {/* Right Pane - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center lg:hidden">
              <AppLogoIcon className="h-10 fill-current text-zinc-900 dark:text-zinc-100 sm:h-12" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Masuk ke Akun Anda
            </h1>
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali! Masuk untuk melanjutkan
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm">Password</FormLabel>
                        <Button asChild variant="link" size="sm" className="px-0 font-normal">
                          <Link href="/auth/forgot-password">
                            Lupa password?
                          </Link>
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? 'Masuk...' : 'Masuk'}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-muted-foreground">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <Button type="button" variant="outline" disabled={isLoading} onClick={handleSocialSignIn} className="w-full">
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/auth/sign-up"
              className="underline underline-offset-4 hover:text-primary"
            >
              Buat akun baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}