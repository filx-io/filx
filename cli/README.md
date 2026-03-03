# @filx/cli

Official CLI for [FliX](https://filx.io) — file conversion for AI agents, paid with USDC on Base.

## Install

```bash
npm install -g @filx/cli
```

## Quick Start

```bash
# 1. Create your agent wallet (no private key required)
filx login you@example.com

# 2. Check your wallet
filx whoami && filx balance

# 3. Convert a file
filx prompt "Convert https://example.com/doc.pdf to markdown"
```

## Commands

| Command | Description |
|---------|-------------|
| `filx login <email>` | Create agent wallet via email OTP |
| `filx whoami` | Show wallet address & email |
| `filx balance` | Show USDC & ETH balance on Base |
| `filx prompt "<text>"` | Natural language file conversion |
| `filx prompt --dry-run "<text>"` | Preview cost without paying |
| `filx api-key` | Print API key (for use in scripts) |
| `filx api-key --rotate` | Rotate to a new API key |
| `filx sign-x402 "<header>"` | Sign an x402 PAYMENT-REQUIRED header |

## Use in Scripts

```bash
# Export your key once
export FILX_API_KEY=$(filx api-key)

# Use in Python agents
# KEY = os.environ["FILX_API_KEY"]
```

## How It Works

FliX uses the [x402 payment protocol](https://x402.org). When your agent hits the API:

1. FliX returns **HTTP 402** with a `PAYMENT-REQUIRED` header
2. Your agent wallet (via Privy) signs the payment — no private key in code
3. Agent resubmits with `PAYMENT-SIGNATURE` header
4. FliX verifies on-chain → processes file → returns result

## No Private Keys

Your wallet is secured by [Privy embedded wallets](https://privy.io). Your `FILX_API_KEY` is a rotatable API credential — the underlying private key never touches your code, logs, or environment.

## Links

- [filx.io](https://filx.io) — FliX homepage
- [filx.io/docs](https://filx.io/docs) — API documentation
- [x402.org](https://x402.org) — x402 payment protocol spec
