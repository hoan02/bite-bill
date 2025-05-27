"use server";

import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { State } from "@/lib/types/state-form";
import { organization } from "@/lib/auth-client";
import { generateCodeFromSlug } from "@/lib/utils/generate-code-from-slug";

export async function createOrg(prevState: State, formData: FormData) {
  const rawFormData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    logo: formData.get("logo") as string | null,
  };

  const joinCode = generateCodeFromSlug(rawFormData.slug);

  try {
    // Gọi API để tạo tổ chức
    await organization.create({
      name: rawFormData.name,
      slug: rawFormData.slug,
      logo: rawFormData.logo || "",
    });

    // Cập nhật joinCode trong database
    await prisma.organization.update({
      where: { slug: rawFormData.slug },
      data: {
        joinCode,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          console.error("API Error: Unauthorized access.");
          return {
            errorMessage: "User is not authorized. Please log in again.",
          };
        case "BAD_REQUEST":
          console.error("API Error: Bad request.");
          return {
            errorMessage:
              "Invalid input. Please check your data and try again.",
          };
        default:
          console.error("API Error: An unexpected error occurred.", error);
          return {
            errorMessage: "Unexpected error occurred. Please try again later.",
          };
      }
    }

    // Log lỗi không xác định và ném lại
    console.error("Unexpected Error:", error);
    throw error;
  }

  // Chuyển hướng người dùng sau khi thành công
  redirect("/dashboard");
}

export async function joinOrg() {}
