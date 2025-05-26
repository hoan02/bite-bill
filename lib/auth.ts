import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";
import { sendEmail } from "./email";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // disableSignUp: false,
    // requireEmailVerification: true,
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    minPasswordLength: 6,
    // maxPasswordLength: 128,
    // autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      // Send reset password email

      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    // password: {
    //   hash: async (password) => {
    //     // Custom password hashing
    //     return hashedPassword;
    //   },
    //   verify: async ({ hash, password }) => {
    //     // Custom password verification
    //     return isValid;
    //   },
    // },
  },
  socialProviders: {
    // github: {
    //   clientId: env.GITHUB_CLIENT_ID as string,
    //   clientSecret: env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
});

export async function currentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) return null;

  return session.user;
}
