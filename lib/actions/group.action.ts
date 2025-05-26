"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createGroup(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();

  if (!name) throw new Error("Group name is required");

  const group = await prisma.group.create({
    data: {
      name,
      description: description || null,
      ownerId: user.id,
      joinKey: nanoid(8),
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/groups");
  return group;
}

export async function joinGroupByKey(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const key = formData.get("key")?.toString();
  if (!key) throw new Error("Group key is required");

  const group = await prisma.group.findUnique({ where: { joinKey: key } });
  if (!group) throw new Error("Group not found");

  const isAlreadyMember = await prisma.groupMember.findFirst({
    where: {
      groupId: group.id,
      userId: user.id,
    },
  });

  if (isAlreadyMember) throw new Error("Already joined this group");

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId: user.id,
      role: "MEMBER",
    },
  });

  revalidatePath("/groups");
  return group;
}

export async function updateGroup(id: string, formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.group.findUnique({ where: { id } });
  if (!group || group.ownerId !== user.id) throw new Error("No permission");

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();

  await prisma.group.update({
    where: { id },
    data: {
      name: name || group.name,
      description: description || group.description,
    },
  });

  revalidatePath(`/groups/${id}`);
}

export async function deleteGroup(id: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.group.findUnique({ where: { id } });
  if (!group || group.ownerId !== user.id) throw new Error("No permission");

  await prisma.group.delete({ where: { id } });

  revalidatePath("/groups");
}
