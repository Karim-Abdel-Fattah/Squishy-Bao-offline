# Squishy Bao Club

Squishy Bao Club is a playful 500-level dumpling game across 25 worlds. Clear each 20-level category for 3 diamonds, beat special stages every ten levels for up to 3 more, open coin-funded surprise boxes, collect 50 skins and 25 features, and equip up to five skins and three features.

Surprise Bao Boxes have 88% common / 12% rare odds (2.2% / 1.2% per skin); Gem Bao Boxes cost 3 diamonds and guarantee one rare skin (10% per rare skin); Feature Boxes award each of 25 features at 4%. Duplicate pulls spend the box currency and award nothing. `ADMIN333` grants a temporary max wallet and all skins for the current page session only.

## Play in a browser

With Python installed, run this from the project folder:

```powershell
py -m http.server 4173
```

Open `http://localhost:4173`. Unsigned guest progress is kept only in the current page and resets on reload. The service worker caches the game for offline play; Google sign-in needs the Cloudflare setup below.

## Android and iOS project

Install Node.js 20 or newer, then run:

```powershell
npm install
npm run android:add
npm run android:sync
npm run android:open
```

Android builds and signed Play Store bundles are produced from Android Studio. For iOS, use macOS with Xcode installed, then run `npm run ios:add`, `npm run ios:sync`, and `npm run ios:open`; configure signing and App Store distribution in Xcode.

Store release still needs platform testing, store artwork and listing details, signing credentials, and developer accounts. The current workspace does not include generated native projects or signed store builds.

## Google sign-in and Cloudflare saves

Guest progress is saved in the browser. Google sign-in and cross-device saves become active after deployment to Cloudflare with a D1 database and Google OAuth credentials.

1. Install dependencies with `npm install`, then authenticate Wrangler with `npx wrangler login`.
2. Create the database with `npm run cloudflare:db:create`. Copy the returned database ID into `database_id` in `wrangler.toml`.
3. Apply the schema with `npm run cloudflare:db:migrate`.
4. Create a Google OAuth 2.0 Web client. Add `https://YOUR_DOMAIN/api/auth/callback` as an authorized redirect URI.
5. Add the OAuth values and a long random session-signing secret using `npx wrangler secret put GOOGLE_CLIENT_ID`, `npx wrangler secret put GOOGLE_CLIENT_SECRET`, and `npx wrangler secret put SESSION_SECRET`.
6. Deploy the website and Worker with `npm run cloudflare:deploy`.

The Worker uses Google authorization-code sign-in with state, nonce, and PKCE; it keeps the session in an HTTP-only secure cookie and stores player profiles in D1. Never put OAuth secrets in browser code. Progress currently comes from the game client, so a public competitive release should move coin purchases and rewards to server-validated transactions before treating the economy as cheat-proof.