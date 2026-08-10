# Deployment — AWS S3 + CloudFront (via GitHub Actions)

The Leaf Loans landing page is a **static multi-page site** (frozen Framer HTML — no build step). It deploys to AWS S3 + CloudFront, triggered manually from GitHub Actions.

## How it works
- **Manual only:** Actions → **Deploy** → Run workflow → pick `uat` or `prod` (`.github/workflows/deploy.yml`).
- Workflow: `actions/checkout` → assume the env's **GitHub OIDC role** (no stored keys) → `aws s3 sync . s3://<bucket> --delete` (excludes repo-meta) → `cloudfront create-invalidation`.
- **Clean URLs** (`/pricing`, `/about-us` — no `.html`) are handled by a **CloudFront Function** (`leafloans-cleanurl`) that rewrites `/x` → `/x.html` and `/` → `/index.html`. Unknown paths return 403 (correct for a multi-page site).
- **S3 is private**; only CloudFront can read it via **OAC**.
- **Prod deploys must run from `main`** (the prod OIDC role only trusts `main`).

## Provisioned resources (account 766534057479, region ap-south-1 — done 2026-08-10)
Shared: OAC `E21PO8PE2ZOTDL`; CloudFront Function `leafloans-cleanurl` (`arn:aws:cloudfront::766534057479:function/leafloans-cleanurl`); GitHub OIDC provider `token.actions.githubusercontent.com`. OIDC `sub` uses the org's `@id` format: `repo:Leaf-Loans@276489454/landing-page@1215802337:...`.

**prod**
- S3 bucket: `leafloans-landing-prod` (Block Public Access ON, versioning ON)
- CloudFront: `E2RPK6AR8VTB6Y` → `d27t43pd2hqms1.cloudfront.net` (default cert; aliases + ACM added after cert validates)
- OIDC role: `arn:aws:iam::766534057479:role/leafloans-gha-deploy` (trusts `…:ref:refs/heads/main`)

**uat**
- S3 bucket: `leafloans-landing-uat`
- CloudFront: `EFISRGWDZ6BW` → `d2ieoehcwpegmo.cloudfront.net` (default cert; verified working)
- OIDC role: `arn:aws:iam::766534057479:role/leafloans-gha-deploy-uat` (trusts any ref)

**ACM cert (us-east-1) — `PENDING_VALIDATION`**
`arn:aws:acm:us-east-1:766534057479:certificate/6004ace9-7aa9-4fdb-83b2-8129ae555646` for `leafloans.ai` + `www.leafloans.ai`.
Validation CNAMEs (add at the DNS provider — Neel & Nikhil):
- `_07de280f725c57a235739889ba71d017.leafloans.ai.` → `_42d3caa74c11afb5717bde899aa03aa8.jkddzztszm.acm-validations.aws.`
- `_0ceb31885e5925d86ecb506310056e3a.www.leafloans.ai.` → `_ac48bbe773c37a83eaeca9d58c7dfd54.jkddzztszm.acm-validations.aws.`

## Remaining steps
1. **Verify uat** (done — `d2ieoehcwpegmo.cloudfront.net` serves `/`, `/pricing`, `/about-us`).
2. **First prod deploy:** merge this to `main`, then Actions → Deploy → `prod`.
3. **DNS validation** (Neel & Nikhil): add the two ACM CNAMEs above → cert goes `ISSUED`.
4. **Attach domain to prod** (cert-dependent): once `ISSUED`, add aliases `leafloans.ai` + `www.leafloans.ai` and the ACM cert to distribution `E2RPK6AR8VTB6Y`. (CloudFront rejects attaching a pending cert.)
5. **DNS cutover** (Neel & Nikhil): point `leafloans.ai`/`www` at `d27t43pd2hqms1.cloudfront.net`. Reversible.

## Notes
- Currently the repo also deploys via GitHub Pages (CNAME `www.leafloans.ai`, `.nojekyll`). Once AWS prod is live and DNS cut over, retire the Pages setup to avoid two sources of truth.
- Setup used IAM user `Jatin_Leaf`; ongoing deploys use the OIDC roles (no static keys in GitHub).
