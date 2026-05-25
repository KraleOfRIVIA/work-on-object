import { prisma } from "@/lib/prisma";

export async function GET() {
  const workTypes = await prisma.workType.findMany({
    orderBy: { name: "asc" },
  });

  return Response.json({ workTypes });
}
