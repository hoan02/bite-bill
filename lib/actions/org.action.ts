"use server";

import { APIError } from "better-auth/api";
import { prisma } from "@/lib/prisma";
import { organization } from "@/lib/auth-client";
import { generateCodeFromSlug } from "@/lib/utils/generate-code-from-slug";
import { OrgFormData, orgSchema } from "@/lib/schemas/org";

export async function createOrg(data: OrgFormData) {
  try {
    const { name, slug, description } = data;

    // Validate bằng Zod schema
    const parsed = orgSchema.safeParse({
      name,
      slug,
      description,
      // logo: logoFile?.name ?? "",
    });

    if (!parsed.success) {
      return {
        success: false,
        errorMessage: "Invalid form data",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name: orgName, slug: orgSlug } = parsed.data;
    const joinCode = generateCodeFromSlug(orgSlug!);

    // Gọi API BetterAuth
    const createdOrg = await organization.create({
      name: orgName,
      slug: orgSlug!,
      logo: "", // Chưa xử lý upload logo file, để rỗng
    });

    // Cập nhật joinCode vào DB
    await prisma.organization.update({
      where: { slug: orgSlug },
      data: {
        joinCode,
      },
    });

    return {
      success: true,
      data: createdOrg,
    };

  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return {
            success: false,
            errorMessage: "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.",
          };
        case "BAD_REQUEST":
          return {
            success: false,
            errorMessage: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
          };
        default:
          return {
            success: false,
            errorMessage: "Đã xảy ra lỗi không xác định.",
          };
      }
    }

    console.error("Unexpected error:", error);
    return {
      success: false,
      errorMessage: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
    };
  }
}
