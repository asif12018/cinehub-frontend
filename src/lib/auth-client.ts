import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "")}/api/v1/auth`,
});