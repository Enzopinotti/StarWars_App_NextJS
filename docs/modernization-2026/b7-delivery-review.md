# B7 — Delivery, review and deployment portability

## Status

B7 is the final review/merge block.

The final candidate keeps the B0–B6 behavioral and security contracts while making the documented local/CI toolchain compatible with the connected Vercel deployment runtime.

## Pre-merge review

Candidate before deployment-portability repair:

`19e6806c352b6ff348e6a869100c2d7fa021eb14`

Verified against original main `95a8372019faab3306ef1ddd87467959526c37ec`:

- 26 commits ahead;
- 0 commits behind;
- 58 changed files;
- no tracked `.next/`, `node_modules/`, `out/` or `coverage/`;
- disposable B6 dependency-lab workflow absent;
- Pages Router retained;
- Tailwind 3 retained;
- no backend/database/auth/global-state rewrite.

Branch Quality run `35357216951` passed all B2–B6 contracts plus production/full audits.

PR #3 was opened from that exact head. Its pull-request Quality run `35357346242` also passed every permanent gate with zero unresolved review threads.

## Vercel deployment regression

The connected Vercel status exposed one delivery regression that GitHub Actions could not reveal.

Historical status comparison:

- original main `95a8372019faab3306ef1ddd87467959526c37ec`: Vercel success;
- B0 measurement `1410c0c8248c14f30bdfed6079dfd0c80a8c625c`: Vercel success;
- B1 toolchain commit `22a47ca65e1065ecdcedd802c657b229fad5f7ff`: Vercel failure;
- later B5/B6/B7 candidates: Vercel failure.

B1 is where the repository introduced:

- `.npmrc` with `engine-strict=true`;
- Node engine `>=24.20.0 <25`;
- npm engine `>=11.19.0 <12`;
- exact local/CI runtime pins.

The exact local/CI versions are useful, but deployment platforms only guarantee the maintained major line.

B7 therefore separates **reproducibility authority** from **deployment compatibility**:

- `.nvmrc`: exact Node `v24.20.0`;
- `packageManager`: exact npm `11.19.0`;
- GitHub Actions: verifies those exact versions;
- `engines.node`: `24.x`;
- `engines.npm`: `>=11 <12`;
- `engine-strict=true` remains enabled.

This preserves deterministic development/CI while allowing a supported Node 24.x deployment platform to choose its maintained minor/patch release.

## Merge gate

B7 may merge only after the repaired exact head proves:

1. permanent branch Quality success;
2. permanent pull-request Quality success;
3. production audit = 0;
4. complete audit = 0;
5. Vercel status = success;
6. 0 unresolved review threads;
7. PR head still equals the reviewed SHA.

After squash merge, `main` must pass permanent Quality again and the portfolio tracker must be synchronized.
