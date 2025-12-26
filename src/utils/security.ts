// Constants for Argon2id
export const ARGON2_PARAMS = {
  memory: 65536, // 64 MB
  iterations: 3,
  parallelism: 4,
  hashLen: 32, // 256 bits (32 bytes) for key derivation
  type: 2, // Argon2id
};

// Constants for AES-256-GCM
export const AES_KEY_LENGTH = 256; // bits
export const AES_IV_LENGTH = 12; // bytes (96 bits)
export const AES_TAG_LENGTH = 16; // bytes (128 bits)

// Salt length for KDFs
export const SALT_LENGTH = 16; // bytes

/**
 * Generates a cryptographically secure random salt.
 * @param length Length of the salt in bytes.
 * @returns Uint8Array salt.
 */
export function generateSalt(length: number = SALT_LENGTH): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Logs security-relevant events (placeholder for a real logging system).
 */
export function securityLog(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
  console.log(`[SECURITY ${level}] ${new Date().toISOString()}: ${message}`);
}