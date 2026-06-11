# Security Policy

## Supported versions

Only the latest published version of `@castui/cast-ui` receives security
fixes. The package has zero runtime dependencies, which keeps the supply
chain surface small.

## Reporting a vulnerability

Please report vulnerabilities privately via
[GitHub Security Advisories](https://github.com/Connagh/cast-ui/security/advisories/new)
— do not open a public issue for security problems.

Include what you can of: the affected version, a description of the issue,
and steps to reproduce. You should receive an acknowledgement within a few
days. Once a fix is published, the advisory will be disclosed and credited
unless you prefer otherwise.

## Scope notes

- The published npm package contains only compiled output (`dist/`),
  `README.md`, and `LICENSE` — no build scripts, no install hooks.
- Releases are published from CI with
  [npm provenance](https://docs.npmjs.com/generating-provenance-statements),
  so every version is traceable to the workflow run and commit that built it.
- The `cast-sync` Figma plugin requests no network access
  (`networkAccess.allowedDomains: ["none"]`).
