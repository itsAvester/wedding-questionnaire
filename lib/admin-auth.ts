import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "wedding_admin";

function secret() {
  return process.env.ADMIN_COOKIE_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function createAdminToken() {
  return createHmac("sha256", secret()).update("wedding-admin-v1").digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token || !secret()) return false;

  const expected = createAdminToken();
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export const adminCookieName = COOKIE_NAME;
