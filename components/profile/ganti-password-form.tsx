"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, Pencil, KeyRound } from "lucide-react";

const skemaGantiPassword = z
  .object({
    passwordLama: z
      .string()
      .min(1, "Password lama wajib diisi"),
    passwordBaru: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung minimal 1 huruf kapital")
      .regex(/[0-9]/, "Harus mengandung minimal 1 angka"),
    konfirmasiPassword: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.passwordBaru === data.konfirmasiPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["konfirmasiPassword"],
  });

type SkemaGantiPassword = z.infer<typeof skemaGantiPassword>;

function InputPassword({
  field,
  placeholder,
}: {
  field: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder: string;
}) {
  const [tampil, setTampil] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
      <Input
        {...field}
        type={tampil ? "text" : "password"}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:border-primary"
      />
      <button
        type="button"
        onClick={() => setTampil(!tampil)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
        tabIndex={-1}
      >
        {tampil ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function GantiPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [berhasil, setBerhasil] = useState(false);
  const [mode, setMode] = useState<"lihat" | "ubah">("lihat");

  const form = useForm<SkemaGantiPassword>({
    resolver: zodResolver(skemaGantiPassword),
    defaultValues: {
      passwordLama: "",
      passwordBaru: "",
      konfirmasiPassword: "",
    },
  });

  function handleUbah() {
    setBerhasil(false);
    setMode("ubah");
  }

  function handleBatal() {
    form.reset();
    setMode("lihat");
  }

  function onSubmit(values: SkemaGantiPassword) {
    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: values.passwordLama,
        newPassword: values.passwordBaru,
        revokeOtherSessions: false,
      });

      if (error) {
        // Pesan error Better Auth
        if (error.code === "INVALID_PASSWORD") {
          form.setError("passwordLama", { message: "Password lama salah" });
        } else {
          toast.error(error.message ?? "Gagal mengganti password");
        }
        return;
      }

      form.reset();
      setBerhasil(true);
      setMode("lihat");
      toast.success("Password berhasil diperbarui! 🔐");
    });
  }

  // ─── Mode Lihat ──────────────────────────────────────────────────────────
  if (mode === "lihat") {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          {berhasil ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          ) : (
            <div className="p-2 bg-zinc-100 rounded-lg">
              <KeyRound className="h-4 w-4 text-zinc-500" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-zinc-800">Password</p>
            <p className="text-xs text-zinc-400">
              {berhasil ? "Password berhasil diperbarui" : "••••••••••••"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUbah}
          className="rounded-full gap-2 text-xs shrink-0"
        >
          <Pencil className="h-3.5 w-3.5" />
          Ganti Password
        </Button>
      </div>
    );
  }

  // ─── Mode Form ───────────────────────────────────────────────────────────
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="passwordLama"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-zinc-700">Password Lama</FormLabel>
              <FormControl>
                <InputPassword field={field} placeholder="Masukkan password saat ini" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-px bg-zinc-100" />

        <FormField
          control={form.control}
          name="passwordBaru"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-zinc-700">Password Baru</FormLabel>
              <FormControl>
                <InputPassword field={field} placeholder="Minimal 8 karakter, ada angka & huruf kapital" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="konfirmasiPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-zinc-700">Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <InputPassword field={field} placeholder="Ulangi password baru" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBatal}
            disabled={isPending}
            className="flex-1 h-11 rounded-full"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 h-11 rounded-full font-semibold bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              "Simpan Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
