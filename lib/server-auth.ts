import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyAuthToken(token);
    const userId = Number(payload.userId);

    if (!Number.isInteger(userId)) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}
