import { createRemoteJWKSet, jwtVerify } from 'jose';

const SESSION_COOKIE = 'bao_session';
const OAUTH_COOKIE = 'bao_oauth';
const SESSION_AGE = 60 * 60 * 24 * 7;
const skinIds = Array.from({ length: 50 }, (_, index) => `skin-${String(index + 1).padStart(2, '0')}`);
const skinAliases = { classic: 'skin-01', strawberry: 'skin-06', matcha: 'skin-11', blueberry: 'skin-16', rainbow: 'skin-21', cloud: 'skin-41' };
const featureIds = [
  'long-steam', 'big-squish', 'coin-purse', 'streak-shield', 'chili-shield',
  'mint-tea', 'berry-watch', 'moon-timer', 'sun-clock', 'jelly-gloves',
  'puffy-palms', 'star-mitts', 'rainbow-mitts', 'copper-apron', 'coin-sprinkle',
  'lucky-napkin', 'golden-crumbs', 'bubble-buddy', 'pillow-promise', 'soft-landing',
  'safety-sprout', 'cooling-fan', 'frosty-tray', 'calm-kitchen', 'snowy-steamer'
];
const maxLevel = 500;
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      if (url.pathname === '/api/auth/config' && request.method === 'GET') {
        return json({ googleConfigured: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.SESSION_SECRET && env.DB) });
      }
      if (url.pathname === '/api/auth/google' && request.method === 'GET') return startGoogleLogin(request, env);
      if (url.pathname === '/api/auth/callback' && request.method === 'GET') return finishGoogleLogin(request, env);
      if (url.pathname === '/api/auth/me' && request.method === 'GET') return currentProfile(request, env);
      if (url.pathname === '/api/auth/logout' && request.method === 'POST') return logout();
      if (url.pathname === '/api/progress' && request.method === 'PUT') return saveProgress(request, env);
      return json({ error: 'Not found' }, 404);
    } catch {
      return json({ error: 'The cloud service could not complete that request.' }, 500);
    }
  }
};

async function startGoogleLogin(request, env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    return Response.redirect(new URL('/?login=setup', request.url), 303);
  }
  const state = randomToken(32);
  const nonce = randomToken(32);
  const verifier = randomToken(48);
  const challenge = base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  const cookie = await signValue({ state, nonce, verifier, expiresAt: Date.now() + 10 * 60 * 1000 }, env.SESSION_SECRET);
  const callback = new URL('/api/auth/callback', request.url).toString();
  const google = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  google.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: callback,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account'
  }).toString();
  return new Response(null, { status: 302, headers: { Location: google.toString(), 'Set-Cookie': cookieHeader(OAUTH_COOKIE, cookie, 600), 'Cache-Control': 'no-store' } });
}

async function finishGoogleLogin(request, env) {
  const url = new URL(request.url);
  const oauthCookie = readCookie(request, OAUTH_COOKIE);
  const pending = oauthCookie ? await verifyValue(oauthCookie, env.SESSION_SECRET) : null;
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  if (!pending || pending.expiresAt < Date.now() || !state || state !== pending.state || !code || url.searchParams.has('error')) {
    return redirectHome(request, 'error');
  }

  const callback = new URL('/api/auth/callback', request.url).toString();
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callback,
      grant_type: 'authorization_code',
      code_verifier: pending.verifier
    })
  });
  if (!tokenResponse.ok) return redirectHome(request, 'error');
  const tokens = await tokenResponse.json();
  if (!tokens.id_token) return redirectHome(request, 'error');

  let identity;
  try {
    const verified = await jwtVerify(tokens.id_token, googleKeys, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: env.GOOGLE_CLIENT_ID,
      requiredClaims: ['sub', 'nonce', 'email', 'email_verified']
    });
    identity = verified.payload;
  } catch {
    return redirectHome(request, 'error');
  }
  if (identity.nonce !== pending.nonce || identity.email_verified !== true || !identity.sub || !identity.email) {
    return redirectHome(request, 'error');
  }

  await env.DB.prepare(`INSERT INTO player_profiles (google_sub, email, display_name, avatar_url, progress_json)
    VALUES (?, ?, ?, ?, '{}')
    ON CONFLICT(google_sub) DO UPDATE SET email = excluded.email, display_name = excluded.display_name, avatar_url = excluded.avatar_url, updated_at = CURRENT_TIMESTAMP`)
    .bind(identity.sub, identity.email, identity.name || identity.given_name || 'Bao Buddy', identity.picture || '')
    .run();

  const session = await signValue({ sub: identity.sub, exp: Math.floor(Date.now() / 1000) + SESSION_AGE }, env.SESSION_SECRET);
  const headers = new Headers({ Location: new URL('/?login=connected', request.url).toString(), 'Cache-Control': 'no-store' });
  headers.append('Set-Cookie', cookieHeader(SESSION_COOKIE, session, SESSION_AGE));
  headers.append('Set-Cookie', clearCookie(OAUTH_COOKIE));
  return new Response(null, { status: 303, headers });
}

async function currentProfile(request, env) {
  const session = await getSession(request, env);
  if (!session) return json({ error: 'Sign-in required' }, 401);
  const row = await env.DB.prepare('SELECT google_sub, email, display_name, avatar_url, progress_json FROM player_profiles WHERE google_sub = ?')
    .bind(session.sub)
    .first();
  if (!row) return json({ error: 'Profile not found' }, 401);
  let progress = null;
  try { progress = JSON.parse(row.progress_json); } catch {}
  return json({ profile: { email: row.email, name: row.display_name, picture: row.avatar_url }, progress });
}

async function saveProgress(request, env) {
  const session = await getSession(request, env);
  if (!session) return json({ error: 'Sign-in required' }, 401);
  const bodyText = await request.text();
  if (new TextEncoder().encode(bodyText).byteLength > 64000) return json({ error: 'Save is too large' }, 413);
  let body;
  try { body = JSON.parse(bodyText); } catch { return json({ error: 'Invalid save data' }, 400); }
  const progress = sanitizeProgress(body.progress);
  if (!progress) return json({ error: 'Invalid save data' }, 400);
  await env.DB.prepare('UPDATE player_profiles SET progress_json = ?, updated_at = CURRENT_TIMESTAMP WHERE google_sub = ?')
    .bind(JSON.stringify(progress), session.sub)
    .run();
  return json({ ok: true });
}

function sanitizeProgress(value) {
  if (!value || typeof value !== 'object' || value.schemaVersion !== 1) return null;
  const number = (input, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(input)) ? Math.floor(Number(input)) : min));
  const list = (items, allowed, limit) => [...new Set(Array.isArray(items) ? items.filter(item => allowed.includes(item)) : [])].slice(0, limit);
  const normalizeSkins = items => [...new Set((Array.isArray(items) ? items : []).map(item => skinAliases[item] || item).filter(item => skinIds.includes(item)))];
  const ownedSkins = normalizeSkins(value.ownedSkins);
  if (!ownedSkins.includes('skin-01')) ownedSkins.unshift('skin-01');
  const ownedFeatures = list(value.ownedFeatures, featureIds, featureIds.length);
  return {
    schemaVersion: 1,
    contentVersion: 3,
    coins: number(value.coins, 0, 100000000),
    diamonds: number(value.diamonds, 0, 1000000),
    bestScore: number(value.bestScore, 0, 100000000),
    unlockedLevel: number(value.unlockedLevel, 1, maxLevel),
    selectedLevel: number(value.selectedLevel, 1, number(value.unlockedLevel, 1, maxLevel)),
    completedLevels: list(value.completedLevels, Array.from({ length: maxLevel }, (_, index) => index + 1), maxLevel),
    ownedSkins,
    selectedSkins: normalizeSkins(value.selectedSkins).filter(id => ownedSkins.includes(id)).slice(0, 5),
    ownedFeatures,
    selectedFeatures: list(value.selectedFeatures, ownedFeatures, 3)
  };
}

async function getSession(request, env) {
  const value = readCookie(request, SESSION_COOKIE);
  const session = value ? await verifyValue(value, env.SESSION_SECRET) : null;
  if (!session || !session.sub || session.exp < Date.now() / 1000) return null;
  return session;
}

async function logout() {
  return new Response(null, { status: 204, headers: { 'Set-Cookie': clearCookie(SESSION_COOKIE), 'Cache-Control': 'no-store' } });
}

function redirectHome(request, status) {
  return new Response(null, { status: 303, headers: { Location: new URL(`/?login=${status}`, request.url).toString(), 'Set-Cookie': clearCookie(OAUTH_COOKIE), 'Cache-Control': 'no-store' } });
}

async function signValue(value, secret) {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify(value)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  return `${payload}.${base64Url(signature)}`;
}

async function verifyValue(value, secret) {
  if (!secret || !value) return null;
  const [payload, supplied] = value.split('.');
  if (!payload || !supplied) return null;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))));
  if (!constantTimeEqual(expected, supplied)) return null;
  try { return JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))); } catch { return null; }
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function randomToken(length) {
  return base64Url(crypto.getRandomValues(new Uint8Array(length)));
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function readCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const prefix = `${name}=`;
  return cookie.split(';').map(value => value.trim()).find(value => value.startsWith(prefix))?.slice(prefix.length) || null;
}

function cookieHeader(name, value, maxAge) {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function clearCookie(name) {
  return `${name}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
