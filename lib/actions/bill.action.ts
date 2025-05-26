"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBill(groupId: string, formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  });
  if (!group) throw new Error("Group not found");

  const member = group.members.find((m) => m.userId === user.id);
  if (!member || !["OWNER", "EXPENSE_EDITOR"].includes(member.role)) {
    throw new Error("No permission to add bill");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const totalAmount = parseInt(
    formData.get("totalAmount")?.toString() || "0",
    10
  );

  if (!title || totalAmount <= 0) {
    throw new Error("Invalid bill data");
  }

  const bill = await prisma.bill.create({
    data: {
      title,
      description: description || null,
      totalAmount,
      groupId,
      createdById: user.id,
    },
  });

  revalidatePath(`/groups/${groupId}`);
  return bill;
}

export async function updateBill(id: string, formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: { group: { include: { members: true } } },
  });
  if (!bill || !bill.group) throw new Error("Bill not found");

  const member = bill.group.members.find((m) => m.userId === user.id);
  if (!member || (member.role !== "OWNER" && bill.createdById !== user.id)) {
    throw new Error("No permission to update bill");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const totalAmount = parseInt(
    formData.get("totalAmount")?.toString() || "0",
    10
  );

  await prisma.bill.update({
    where: { id },
    data: {
      title: title || bill.title,
      description: description || bill.description,
      totalAmount: totalAmount > 0 ? totalAmount : bill.totalAmount,
    },
  });

  revalidatePath(`/groups/${bill.groupId}/bills`);
}

export async function deleteBill(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: { group: { include: { members: true } } },
  });
  if (!bill) throw new Error("Bill not found");

  const member = bill.group.members.find((m) => m.userId === user.id);
  if (!member || (member.role !== "OWNER" && bill.createdById !== user.id)) {
    throw new Error("No permission to delete bill");
  }

  await prisma.bill.delete({ where: { id } });

  revalidatePath(`/groups/${bill.groupId}/bills`);
}
