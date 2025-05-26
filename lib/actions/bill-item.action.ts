"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addBillItem(billId: string, formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "1", 10);
  const unitPrice = parseInt(formData.get("unitPrice")?.toString() || "0", 10);

  if (!name || isNaN(quantity) || isNaN(unitPrice)) {
    throw new Error("Invalid bill item data");
  }

  const total = quantity * unitPrice;

  const item = await prisma.billItem.create({
    data: {
      name,
      quantity,
      unitPrice,
      total,
      billId,
    },
  });

  revalidatePath(`/bills/${billId}`);
  return item;
}

export async function deleteBillItem(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.billItem.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found");

  await prisma.billItem.delete({ where: { id } });
  revalidatePath(`/bills/${item.billId}`);
}
