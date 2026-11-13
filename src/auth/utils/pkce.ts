// ----------------------------------------------------------------------
// PKCE (RFC 7636) helpers. All crypto comes from the Web Crypto API.
// ----------------------------------------------------------------------

const UNRESERVED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

/** 43 chars is the shortest verifier allowed by RFC 7636. */
const VERIFIER_LENGTH = 64;

function getCrypto(): Crypto {
  const value = globalThis.crypto;

  if (!value?.getRandomValues) {
    throw new Error('Web Crypto is unavailable. A secure context (https or localhost) is required.');
  }

  return value;
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  getCrypto().getRandomValues(bytes);

  return bytes;
}

/** RFC 4648 §5 base64url, without padding. */
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Random string over the RFC 3986 unreserved set (43–128 chars). */
function randomString(length: number): string {
  const bytes = randomBytes(length);
  let result = '';

  for (let index = 0; index < length; index += 1) {
    result += UNRESERVED[bytes[index]! % UNRESERVED.length];
  }

  return result;
}

// ----------------------------------------------------------------------

export function generateCodeVerifier(): string {
  return randomString(VERIFIER_LENGTH);
}

export function generateState(): string {
  return randomString(VERIFIER_LENGTH);
}

export async function createCodeChallenge(verifier: string): Promise<string> {
  const digest = await getCrypto().subtle.digest('SHA-256', new TextEncoder().encode(verifier));

  return base64UrlEncode(new Uint8Array(digest));
}

export type PkceChallenge = {
  verifier: string;
  challenge: string;
  method: 'S256';
};

export async function createPkceChallenge(method: 'S256' = 'S256'): Promise<PkceChallenge> {
  if (method !== 'S256') {
    throw new Error(`Unsupported PKCE method: ${method}. The backend requires S256.`);
  }

  const verifier = generateCodeVerifier();

  return { verifier, challenge: await createCodeChallenge(verifier), method };
}

/** Compares without early exit so the runtime does not leak the mismatch index. */
export function safeEquals(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < a.length; index += 1) {
    if (a.charAt(index) !== b.charAt(index)) {
      mismatch += 1;
    }
  }

  return mismatch === 0;
}