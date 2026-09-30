import bcrypt from "bcryptjs";

/** bcrypt cost factor. 12 ≈ 200–300ms per hash on a Vercel function: slow for attackers, fine for login. */
const BCRYPT_ROUNDS = 12;

export const PASSWORD_MIN_LENGTH = 8;
/** bcrypt only uses the first 72 bytes; cap input so longer passwords aren't silently truncated. */
export const PASSWORD_MAX_LENGTH = 72;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
