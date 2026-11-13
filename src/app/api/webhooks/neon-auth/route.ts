import { createPublicKey, verify as verifySignature, type JsonWebKey } from 'node:crypto';

import { db } from '@/lib/db';
import { users } from '@/schema/pos';

export const runtime = 'nodejs';

const MAX_TIMESTAMP_AGE_MS = 5 * 60 * 1000;
const MAX_BODY_BYTES = 256 * 1024;

type NeonWebhookJwk = JsonWebKey & {
  kid?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function getSigningKey(kid: string) {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL || `${baseUrl}/.well-known/jwks.json`;

  if (!baseUrl || !jwksUrl) {
    throw new Error('NEON_AUTH_BASE_URL or NEON_AUTH_JWKS_URL is not configured');
  }

  
  const response = await fetch(jwksUrl, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Neon JWKS request failed with status ${response.status}`);
  }

  const jwks: unknown = await response.json();

  if (!isRecord(jwks) || !Array.isArray(jwks.keys)) {
    throw new Error('Neon JWKS response has an invalid format');
  }

  const jwk = jwks.keys.find(
    (key): key is NeonWebhookJwk =>
      isRecord(key) &&
      key.kid === kid &&
      key.kty === 'OKP' &&
      key.crv === 'Ed25519' &&
      typeof key.x === 'string'
  );

  return jwk ? createPublicKey({ key: jwk, format: 'jwk' }) : null;
}

async function isValidNeonSignature(
  body: Buffer,
  signature: string,
  kid: string,
  timestamp: string
): Promise<boolean> {
  const parts = signature.split('.');

  if (parts.length !== 3 || !parts[0] || parts[1] !== '' || !parts[2]) {
    return false;
  }

  let protectedHeader: unknown;

  try {
    protectedHeader = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  } catch {
    return false;
  }

  if (
    !isRecord(protectedHeader) ||
    protectedHeader.alg !== 'EdDSA' ||
    protectedHeader.kid !== kid
  ) {
    return false;
  }

  const publicKey = await getSigningKey(kid);

  if (!publicKey) {
    return false;
  }

  const payloadB64 = body.toString('base64url');
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, 'utf8').toString('base64url');
  const signingInput = `${parts[0]}.${signaturePayloadB64}`;

  return verifySignature(
    null,
    Buffer.from(signingInput, 'utf8'),
    publicKey,
    Buffer.from(parts[2], 'base64url')
  );
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-neon-signature');
  const kid = request.headers.get('x-neon-signature-kid');
  const timestamp = request.headers.get('x-neon-timestamp');
  const eventType = request.headers.get('x-neon-event-type');
  const eventId = request.headers.get('x-neon-event-id');

  if (!signature || !kid || !timestamp || !eventType || !eventId) {
    return Response.json({ error: 'Missing required Neon webhook headers' }, { status: 400 });
  }

  const timestampMs = Number(timestamp);

  if (
    !Number.isSafeInteger(timestampMs) ||
    Math.abs(Date.now() - timestampMs) > MAX_TIMESTAMP_AGE_MS
  ) {
    return Response.json({ error: 'Webhook timestamp is invalid or expired' }, { status: 401 });
  }

  const body = Buffer.from(await request.arrayBuffer());

  if (body.byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Webhook payload is too large' }, { status: 413 });
  }

  let signatureIsValid: boolean;

  try {
    signatureIsValid = await isValidNeonSignature(body, signature, kid, timestamp);
  } catch (error) {
    console.error('Failed to verify Neon webhook signature:', error);
    return Response.json({ error: 'Unable to verify webhook signature' }, { status: 502 });
  }

  if (!signatureIsValid) {
    return Response.json({ error: 'Invalid Neon webhook signature' }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body.toString('utf8'));
  } catch {
    return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (
    !isRecord(payload) ||
    payload.event_id !== eventId ||
    payload.event_type !== eventType
  ) {
    return Response.json({ error: 'Webhook headers do not match the payload' }, { status: 400 });
  }

  if (eventType !== 'user.created') {
    return Response.json({ received: true, ignored: true });
  }

  const user = payload.user;

  if (
    !isRecord(user) ||
    typeof user.id !== 'string' ||
    typeof user.email !== 'string'
  ) {
    return Response.json({ error: 'Webhook user is missing required fields' }, { status: 400 });
  }

  try {
    await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        name: typeof user.name === 'string' ? user.name : null,
        avatarUrl: typeof user.image === 'string' ? user.image : null,
        phoneNumber: typeof user.phone_number === 'string' ? user.phone_number : null,
        createdAt: parseDate(user.created_at),
        updatedAt: parseDate(user.updated_at),
      })
      .onConflictDoNothing({ target: users.id });
  } catch (error) {
    console.error(`Failed to persist Neon user-created event ${eventId}:`, error);
    return Response.json({ error: 'Unable to create user profile' }, { status: 500 });
  }

  return Response.json({ received: true });
}
