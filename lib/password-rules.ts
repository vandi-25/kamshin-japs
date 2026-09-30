/** Password limits shared by client forms and the server (no bcrypt import, so it's browser-safe). */
export const PASSWORD_MIN_LENGTH = 8;
/** bcrypt only uses the first 72 bytes; cap input so longer passwords aren't silently truncated. */
export const PASSWORD_MAX_LENGTH = 72;
