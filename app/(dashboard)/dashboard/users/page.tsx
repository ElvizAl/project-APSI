import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { UserListClient } from "@/components/dashboard/users/user-list-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Kelola Pengguna",
  description: "Manajemen pengguna platform Glotomotif.",
  robots: { index: false, follow: false },
};

import { Prisma } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const search = typeof params.search === "string" ? params.search : "";
  const take = 10;
  const skip = (page - 1) * take;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <UserListClient
      initialUsers={users}
      currentUserId={session?.user?.id}
      totalPages={Math.ceil(total / take)}
      currentPage={page}
      searchQuery={search}
    />
  );
}
