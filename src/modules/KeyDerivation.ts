import * as argon2 from 'argon2-browser';
import { ARGON2_PARAMS, securityLog } from '@/utils/security';
// Import the Wasm file URL explicitly for Vite compatibility
import argon2WasmUrl from 'argon2-browser/dist/argon2.wasm?url';

/**
 * Derives a 256-bit key using Argon2id.
 * @param secret The password or email string.
 * @param salt The salt (Uint8Array).
 * @returns A CryptoKey object suitable for AES operations.
 */
export async function deriveKeyArgon2id(
  secret: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  securityLog('Starting Argon2id key derivation.');

  // Convert secret string to Uint8Array
  const secretBuffer = new TextEncoder().encode(secret);

  // Argon2id hashing
  const result = await argon2.hash({
    pass: secretBuffer,
    salt: salt,
    time: ARGON2_PARAMS.iterations,
    mem: ARGON2_PARAMS.memory,
    parallelism: ARGON2_PARAMS.parallelism,
    hashLen: ARGON2_PARAMS.hashLen,
    type: ARGON2_PARAMS.type,
    // Explicitly set the path to the Wasm file using the imported URL
    distPath: argon2WasmUrl.substring(0, argon2WasmUrl.lastIndexOf('/')),
  });

  // The hash is the raw key material (ArrayBuffer)
  const rawKeyMaterial = result.hash;

  // Import the raw key material into a CryptoKey object for SubtleCrypto
  // Set extractable: true so we can export the raw key material for HKDF concatenation
  const key = await crypto.subtle.importKey(
    'raw',
    rawKeyMaterial,
    { name: 'AES-GCM' },
    true, // MUST be extractable for HKDF combination
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey', 'deriveKey', 'deriveBits'],
  );

  securityLog('Argon2id key derivation successful.');
  return key;
}