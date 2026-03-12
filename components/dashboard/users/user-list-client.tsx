"use client";

import { useState, useCallback, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserCog, UserX, UserCheck, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { User } from "@/lib/generated/prisma/client";

interface UserListProps {
  initialUsers: User[];
  currentUserId?: string;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export function UserListClient({ initialUsers, currentUserId, totalPages, currentPage, searchQuery }: UserListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isBanning, setIsBanning] = useState<string | null>(null);
  const [isRoleUpdating, setIsRoleUpdating] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`${pathname}?${createQueryString("search", searchInput)}&page=1`);
    });
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString("page", newPage.toString())}`);
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini secara permanen?")) return;
    setIsDeleting(userId);
    try {
      await authClient.admin.removeUser({ userId });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("Pengguna berhasil dihapus");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus pengguna");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleBan = async (user: User) => {
    const isBanned = user.banned;
    if (!confirm(`Apakah Anda yakin ingin ${isBanned ? 'membuka blokir' : 'memblokir'} pengguna ini?`)) return;

    setIsBanning(user.id);
    try {
      if (isBanned) {
        await authClient.admin.unbanUser({ userId: user.id });
        toast.success("Blokir pengguna berhasil dibuka");
      } else {
        await authClient.admin.banUser({ userId: user.id, banReason: "Melanggar kebijakan" });
        toast.success("Pengguna berhasil diblokir");
      }
      setUsers(users.map(u => u.id === user.id ? { ...u, banned: !isBanned } : u));
    } catch (error: any) {
      toast.error(error.message || `Gagal ${isBanned ? 'membuka blokir' : 'memblokir'} pengguna`);
    } finally {
      setIsBanning(null);
    }
  };

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const betterAuthRole = newRole.toLowerCase() as "user" | "admin";
    if (!confirm(`Apakah Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) return;

    setIsRoleUpdating(user.id);
    try {
      await authClient.admin.setRole({ userId: user.id, role: betterAuthRole });
      toast.success(`Peran pengguna berhasil diubah menjadi ${newRole}`);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah peran pengguna");
    } finally {
      setIsRoleUpdating(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Daftar Pengguna</CardTitle>
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" disabled={isPending}>Cari</Button>
          </form>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status Email</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={user.banned ? "bg-red-50/50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{user.name || "-"}</span>
                      {user.banned && <Badge variant="destructive" className="text-[10px] h-5">Diblokir</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        Terverifikasi
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                        Belum Verifikasi
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                    }).format(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleRole(user)}
                        disabled={isRoleUpdating === user.id || user.id === currentUserId}
                        title={`Ubah ke ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={user.banned ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-amber-500 hover:text-amber-600 hover:bg-amber-50"}
                        onClick={() => handleToggleBan(user)}
                        disabled={isBanning === user.id || user.id === currentUserId}
                        title={user.banned ? "Buka Blokir" : "Blokir Pengguna"}
                      >
                        {user.banned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isDeleting === user.id || user.id === currentUserId}
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <div className="text-sm font-medium">
                Halaman {currentPage} dari {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
