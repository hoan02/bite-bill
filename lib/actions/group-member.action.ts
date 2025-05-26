"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { env } from "@/env";

export async function getGroupMembers(groupId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!group) throw new Error("Group not found");

  const isMember = group.members.some((m) => m.userId === user.id);
  if (!isMember) throw new Error("You are not in this group");

  return group.members;
}

export async function updateMemberRole(
  memberId: string,
  role: "MEMBER" | "EXPENSE_EDITOR"
) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const member = await prisma.groupMember.findUnique({
    where: { id: memberId },
    include: { group: true },
  });

  if (!member || member.group.ownerId !== user.id)
    throw new Error("No permission");

  await prisma.groupMember.update({
    where: { id: memberId },
    data: { role },
  });

  revalidatePath(`/groups/${member.groupId}`);
}

export async function removeGroupMember(memberId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const member = await prisma.groupMember.findUnique({
    where: { id: memberId },
    include: { group: true },
  });

  if (!member) throw new Error("Member not found");
  if (member.group.ownerId !== user.id && member.userId !== user.id)
    throw new Error("No permission to remove this member");

  await prisma.groupMember.delete({ where: { id: memberId } });

  revalidatePath(`/groups/${member.groupId}`);
}

export async function inviteMemberByEmail(groupId: string, email: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group || group.ownerId !== user.id) throw new Error("No permission");

  const joinUrl = `${env.NEXT_PUBLIC_APP_URL}/groups/join?key=${group.joinKey}`;

  await sendEmail({
    to: email,
    subject: `Invitation to join group "${group.name}" on Bite Bill`,
    text: `
      You've been invited to join the group "${group.name}" on Bite Bill.
      Click here to join: ${joinUrl}
    `,
  });
}
