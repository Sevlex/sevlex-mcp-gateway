---
version: 1.0.0
name: Sevlex-Design-System
description: >-
  The official design specification for Sevlex — The Layer 7 Zero-Trust Security Fabric
  for AI Coding Agents. Modeled after the elite developer-craft standards of Linear, Resend,
  and Cursor from awesome-design-md. Built on a pure-black near-infinite canvas (#000000),
  charcoal elevated surfaces (#0C0D11, #12141A), hairline translucent borders
  (rgba(255,255,255,0.08)), and the signature high-voltage Sevlex Emerald (#34D59A)
  used exclusively as the operational pulse.

colors:
  # The Core Canvas
  canvas: "#000000"
  canvas-subtle: "#07080A"
  canvas-elevated: "#0C0D11"

  # Panels & Surfaces
  surface-card: "#0E1014"
  surface-card-hover: "#14161C"
  surface-interactive: "#181A22"

  # Hairlines & Borders
  hairline: "rgba(255, 255, 255, 0.08)"
  hairline-strong: "rgba(255, 255, 255, 0.16)"
  hairline-subtle: "rgba(255, 255, 255, 0.04)"
  border-dark: "#242628"

  # Chromatic Accents (The Security Voltage)
  primary: "#34D59A" # Sevlex Emerald (Interception, safety, live status)
  primary-glow: "rgba(52, 213, 154, 0.12)"
  primary-border: "rgba(52, 213, 154, 0.3)"
  
  # Semantic Accents
  accent-blue: "#38BDF8"    # Ingress / Client wire (Cursor/Claude stdio)
  accent-amber: "#F59E0B"   # Velocity / Circuit breaker / 429 warnings
  accent-purple: "#A855F7"  # Merkle Ledger / Cryptographic proofs
  accent-red: "#F87171"     # Quarantine / Blocked DDL attacks

  # Ink & Typography
  ink-white: "#FFFFFF"
  ink-primary: "#F3F4F6"
  ink-muted: "#94979E"
  ink-subtle: "#797D86"
  ink-faint: "#4E5158"

  # Light Mode Mappings (WCAG AA Compliant)
  light-canvas: "#FFFFFF"
  light-surface: "#F8FAFC"
  light-border: "#E2E8F0"
  light-ink: "#0F172A"
  light-muted: "#475569"

typography:
  font-sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace"
  
  scale:
    display-hero:
      fontSize: "4.25rem" # 68px
      fontWeight: 500
      lineHeight: 1.06
      letterSpacing: "-0.035em"
    headline-section:
      fontSize: "2.5rem" # 40px
      fontWeight: 500
      lineHeight: 1.15
      letterSpacing: "-0.025em"
    title-card:
      fontSize: "1rem" # 16px
      fontWeight: 600
      lineHeight: 1.3
      letterSpacing: "-0.01em"
    body:
      fontSize: "0.875rem" # 14px
      fontWeight: 400
      lineHeight: 1.6
    mono-badge:
      fontSize: "0.6875rem" # 11px
      fontWeight: 500
      letterSpacing: "0.05em"
      textTransform: "uppercase"

geometry:
  radius-pill: "9999px" # Buttons, interactive pills, install bars
  radius-card: "16px"   # Bento cards, architecture containers
  radius-panel: "24px"  # Large interactive simulator & bento containers
  radius-badge: "6px"   # Status chips, code tags

rules:
  - "NEVER use arbitrary bright colors decoratively. Color only represents active data states (Emerald = safe/active, Red = blocked attack, Blue = ingress, Purple = Merkle)."
  - "Hairline borders must be translucent rgba(255,255,255,0.08) in dark mode, never thick solid grays."
  - "Display headlines must feature measured negative letter-spacing (tracking-tight) for magazine-grade developer precision."
  - "All wire protocols, CLI commands, latencies (<0.42ms), and hashes must be rendered in crisp monospace font."
  - "Brand logos must use official vector SVGs or clean transparent PNGs, displayed inside subtle container tiles."
  - "Interactive cards must have subtle hover states (border illumination or 4% surface shift), never heavy 3D drop shadows."
---
