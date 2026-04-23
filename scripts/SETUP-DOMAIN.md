# Custom domain setup — www.leafloans.ai

This site lives on GitHub Pages from the `main` branch of
`leaf-loans/landing-page`. The `CNAME` file at the repo root tells GitHub to
serve it from `www.leafloans.ai` instead of `leaf-loans.github.io/landing-page/`.

## DNS records to add (at the DNS provider for `leafloans.ai`)

### `www` subdomain (the canonical host) — CNAME

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| CNAME | www  | `leaf-loans.github.io.`  | 3600 |

### Apex (`leafloans.ai`) — A records, redirected to www

GitHub Pages serves the apex via four anycast IPs. Add all four:

| Type | Name | Value             | TTL  |
|------|------|-------------------|------|
| A    | @    | `185.199.108.153` | 3600 |
| A    | @    | `185.199.109.153` | 3600 |
| A    | @    | `185.199.110.153` | 3600 |
| A    | @    | `185.199.111.153` | 3600 |

(If the DNS provider supports ALIAS / ANAME at the apex, use a single
ALIAS `@ → leaf-loans.github.io.` instead. Cloudflare, DNSimple, Route 53
all support this.)

> Note: `www.leafloans.ai` is the canonical host (matches the `CNAME` file
> and every `og:url` / `canonical` / sitemap entry). GitHub Pages will
> 301 the apex `leafloans.ai` to `https://www.leafloans.ai/` automatically
> once both DNS records resolve.

## GitHub side

1. Push the `CNAME` file (already in this commit).
2. In the repo: `Settings → Pages → Custom domain` should auto-fill from the
   CNAME file. Click **Save**.
3. Wait 1–10 minutes for GitHub to provision the Let's Encrypt certificate.
4. Tick **Enforce HTTPS**.

## Verification

```bash
dig +short www.leafloans.ai          # → leaf-loans.github.io
dig +short leafloans.ai              # → 185.199.108.153 (and 3 more)
curl -sI https://www.leafloans.ai/   # → HTTP/2 200
curl -sI https://leafloans.ai/       # → HTTP/2 301 → https://www.leafloans.ai/
```

Also smoke-test the OG image and favicons (these are absolute URLs hard-baked
into the meta tags):

```bash
curl -sI https://www.leafloans.ai/favicon.png            # → 200
curl -sI https://www.leafloans.ai/apple-touch-icon.png   # → 200
curl -sI https://www.leafloans.ai/assets/img/og-image.png # → 200, image/png
```

Then preview the social card in
[Open Graph Preview](https://www.opengraph.xyz/url/https%3A%2F%2Fwww.leafloans.ai%2F).

## What broke / didn't break

- **Favicons:** moved from `/landing-page/favicon.png` to root-relative
  `/favicon.png` so they resolve at the new domain.
- **OG image, canonical, sitemap, robots:** already used absolute
  `https://leafloans.ai/...` URLs, no change needed.
- **All other internal links:** relative (`href="services.html"`), so
  they keep working.
