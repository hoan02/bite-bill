"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addBillItemShare(itemId: string, formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userId = formData.get("userId")?.toString();
  const amount = parseInt(formData.get("amount")?.toString() || "0", 10);

  if (!userId || isNaN(amount) || amount <= 0) {
    throw new Error("Invalid share data");
  }

  // Check if user already shared this item
  const exists = await prisma.billItemShare.findFirst({
    where: { itemId, userId },
  });

  if (exists) {
    throw new Error("This user already has a share on this item");
  }

  const share = await prisma.billItemShare.create({
    data: {
      itemId,
      userId,
      amount,
    },
  });

  const item = await prisma.billItem.findUnique({ where: { id: itemId } });
  if (item) {
    revalidatePath(`/bills/${item.billId}`);
  }

  return share;
}

export async function removeBillItemShare(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const share = await prisma.billItemShare.findUnique({
    where: { id },
    include: { item: true },
  });

  if (!share) throw new Error("Share not found");

  await prisma.billItemShare.delete({ where: { id } });

  revalidatePath(`/bills/${share.item.billId}`);
}

export async function updateBillItemShare(id: string, amount: number) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (amount <= 0) throw new Error("Amount must be greater than 0");

  const share = await prisma.billItemShare.findUnique({
    where: { id },
    include: { item: true },
  });

  if (!share) throw new Error("Share not found");

  await prisma.billItemShare.update({
    where: { id },
    data: { amount },
  });

  revalidatePath(`/bills/${share.item.billId}`);
}
