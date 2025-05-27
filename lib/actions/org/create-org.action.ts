"use server";
import { organization } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { State } from "@/lib/types/state-form";
import { generateCodeFromSlug } from "@/lib/utils/generate-code-from-slug";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const createOrgFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  logo: z.any().optional(),
});

export default async function createOrg(prevState: State, formData: FormData) {
  const createOrgFormData = Object.fromEntries(formData);
  const validatedCreateOrgFormData =
    createOrgFormSchema.safeParse(createOrgFormData);

  const joinCode = generateCodeFromSlug(createOrgFormData);

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
