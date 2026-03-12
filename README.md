<div align="center">

<img src="assets/logo.png" alt="is-a.dev JSON Generator Logo" width="280" />

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░  JSON GENERATOR  ·  ZERO REJECTED PULL REQS   ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

[![Live Demo](https://img.shields.io/badge/▶%20LIVE%20DEMO-58a6ff?style=for-the-badge&logoColor=white)](https://your-username.github.io/your-repo/)
[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-bc8cff?style=for-the-badge)](./LICENSE)
[![Vanilla JS](https://img.shields.io/badge/VANILLA%20JS-NO%20DEPS-3fb950?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/HOSTED%20ON-GITHUB%20PAGES-30363d?style=for-the-badge&logo=github)](https://pages.github.com/)

</div>

---

## 📟 WHAT IS THIS?

> **A free, single-page browser utility that generates perfectly formatted JSON registration files for the [is-a.dev](https://is-a.dev) free subdomain service.**

The `is-a.dev` project lets developers register free `*.is-a.dev` subdomains by submitting a JSON file via a GitHub pull request. The catch? The CI pipeline is unforgiving — a single misplaced comma, a plain string where an array is required, or a CNAME record sitting next to a TXT record will **instantly reject your PR**.

This tool makes that impossible. Every rule is enforced in real time before you ever touch the clipboard.

---

## 🕹️ FEATURES

```
┌─────────────────────────────────────────────────────────┐
│  ▸ Real-time JSON preview as you type                   │
│  ▸ CI status bar — shows pass/fail before you submit    │
│  ▸ Regex validation per record type (A, AAAA, CNAME…)  │
│  ▸ A & AAAA auto-serialised as arrays (the #1 mistake)  │
│  ▸ CNAME/TXT conflict blocking — physically impossible  │
│    to generate an invalid record combination            │
│  ▸ Multi-value support for A, AAAA, MX, TXT records     │
│  ▸ One-click copy to clipboard                          │
│  ▸ Zero dependencies — pure HTML, CSS, JS               │
│  ▸ No server, no build step, no install                 │
│  ▸ Fully SEO-optimised for GitHub Pages hosting         │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 PROJECT STRUCTURE

```
your-repo/
│
├── index.html        ← HTML shell + SEO meta tags + JSON-LD schema
├── style.css         ← Retro pixel-art theme (VT323 font, hard shadows)
├── script.js         ← All logic: validation, conflict engine, serialiser
├── assets/
│   └── logo.png      ← Pixel-art project logo
└── README.md         ← You are here
```

All three source files are **self-contained and comment-annotated**. No bundler. No `package.json`. Drop them in any static host and they work instantly.

---

## ⚡ QUICK START

### Option A — Use the live tool

Click → **[your-username.github.io/your-repo](https://your-username.github.io/your-repo/)** ← done.

### Option B — Run it locally

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Open index.html in any modern browser — no server required
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### Option C — Fork & self-host on GitHub Pages

```bash
# Fork on GitHub, then enable Pages:
# Settings → Pages → Source: Deploy from branch → main → / (root) → Save
```

Your own copy will be live at `https://your-username.github.io/your-repo/` within ~60 seconds.

---

## 🎮 HOW TO USE

```
 STEP 1        STEP 2          STEP 3          STEP 4
┌──────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│  Fill in  │  │ Click a    │  │ Watch the  │  │  When bar  │
│  owner   │→ │ record     │→ │ CI status  │→ │  turns     │
│  fields  │  │ type (A,   │  │ bar in     │  │  GREEN →   │
│          │  │ CNAME, TXT │  │ real time  │  │  COPY JSON │
│ username │  │  etc.)     │  │            │  │  & submit  │
│  email   │  │            │  │            │  │  your PR!  │
└──────────┘  └────────────┘  └────────────┘  └────────────┘
```

---

## 🗂️ SUPPORTED RECORD TYPES

| Record | JSON Format | Notes |
|--------|-------------|-------|
| `A` | `["ip", "ip"]` | Must be an **array** — even for one IP |
| `AAAA` | `["ipv6"]` | Must be an **array** |
| `CNAME` | `"hostname"` | Plain string. Blocks A / AAAA / MX / TXT |
| `MX` | `["mx.host"]` | Must be an **array** |
| `TXT` | `["value"]` | Must be an **array**. Blocked by CNAME |
| `URL` | `"https://…"` | Plain string redirect |

> ⚠️ **DNS Rule enforced automatically:** A `CNAME` record cannot coexist with `A`, `AAAA`, `MX`, or `TXT` at the same subdomain. The tool disables conflicting buttons the moment you add a CNAME card.

---

## 📋 EXAMPLE OUTPUT

**GitHub Pages setup:**
```json
{
  "description": "My portfolio site",
  "repo": "https://github.com/username/portfolio",
  "owner": {
    "username": "github-username",
    "email": "dev@example.com"
  },
  "records": {
    "CNAME": "username.github.io"
  }
}
```

**Custom VPS with multiple IPs:**
```json
{
  "description": "My VPS",
  "owner": {
    "username": "github-username",
    "email": "dev@example.com"
  },
  "records": {
    "A": ["203.0.113.42", "203.0.113.43"]
  }
}
```

---

## ❌ COMMON MISTAKES THIS TOOL PREVENTS

```
ERROR ──────────────────────────────────────── PREVENTED BY
─────────────────────────────────────────────────────────────
A record as string instead of array           ✅ Auto-array
CNAME combined with TXT record                ✅ Button lock
CNAME combined with A / AAAA / MX             ✅ Button lock
Missing owner.username or owner.email         ✅ Status bar
Trailing commas / missing commas              ✅ JSON.stringify
Invalid IP address format                     ✅ Regex check
Invalid hostname format for CNAME             ✅ Regex check
Invalid URL format for URL record             ✅ Regex check
```

---

## 🔌 CONNECTING TO HOSTING PROVIDERS

<details>
<summary><b>▶ GitHub Pages</b></summary>

```json
"records": {
  "CNAME": "your-username.github.io"
}
```

Then add a `CNAME` file in your GitHub Pages repo containing your full subdomain (e.g. `yourname.is-a.dev`).

</details>

<details>
<summary><b>▶ Vercel</b></summary>

```json
"records": {
  "CNAME": "cname.vercel-dns.com"
}
```

> ⚠️ Vercel's domain verification **TXT record** goes in Vercel's dashboard under **Domains → DNS Records** — NOT in this JSON file. Adding both CNAME and TXT in the same file violates DNS protocol and will instantly fail the CI check.

</details>

<details>
<summary><b>▶ Cloudflare Pages</b></summary>

```json
"records": {
  "CNAME": "your-project.pages.dev"
}
```

</details>

<details>
<summary><b>▶ Custom VPS / Server</b></summary>

```json
"records": {
  "A": ["your.server.ip.address"]
}
```

For IPv6, use `AAAA` instead. Both can be combined (but not alongside a CNAME).

</details>

---

## 🏗️ ARCHITECTURE & SEO

This is a **zero-build static SPA** optimised for GitHub Pages hosting.

```
index.html
├── <head>
│   ├── Canonical URL + Open Graph + Twitter Card tags
│   ├── JSON-LD Schema.org @graph
│   │   ├── SoftwareApplication (free, DeveloperApplication)
│   │   └── FAQPage (synced with below-fold accordion)
│   └── VT323 bitmap font (Google Fonts)
├── <body>
│   ├── Two-column form + live JSON preview  (above fold)
│   └── <details>/<summary> FAQ accordion   (below fold)
│       └── Native HTML5 — zero JS, fully crawlable
└── <script src="script.js">
```

The FAQ section targets long-tail conversational developer search queries and phonetic voice-search variations (including the well-known "Jason file" / "isa dev" speech-to-text misinterpretations) — without disrupting the primary UI.

---

## 🤝 CONTRIBUTING

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/your-improvement

# 3. Edit index.html, style.css, or script.js
# 4. Open index.html locally to verify
# 5. Submit a pull request
```

The codebase is intentionally dependency-free. Please keep it that way — no npm, no bundlers, no frameworks.

---

## 📜 LICENSE

```
MIT License — free to use, modify, and distribute.
```

---

<div align="center">

<img src="assets/logo.png" alt="is-a.dev JSON Generator" width="120" />

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░  built with ♥ for the is-a.dev community         ░
░  stop getting your PRs rejected                   ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**[⬆ back to top](#)**

</div>
