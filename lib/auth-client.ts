import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
} = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: env.BETTER_AUTH_URL,

});