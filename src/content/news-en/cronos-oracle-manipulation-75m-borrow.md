---
takeaways:
  - "On August 30, an attacker pumped the price of the TONIC token 100x and borrowed about $75 million against it from the Tectonic lending protocol on Cronos."
  - "Cronos validators halted block production within minutes; by then about $6 million had already been moved out to Ethereum."
  - "The next day the network was restarted with its state rolled back to before the attack — an unusual decision for a major network, which reversed most of the consequences."
---

**What happened.** On August 30, an attacker borrowed about $75 million from Tectonic — the largest lending protocol on Cronos — against collateral with almost no real market behind it. He artificially pushed up the price of Tectonic's own governance token, TONIC, by about 100x, and then used the inflated valuation as collateral to borrow real assets.

## How the oracle allowed it

Lending protocols decide how much a borrower can take by reading the collateral's price from an oracle, and the oracle takes its price from the market. When a token trades in small volume, a single well-funded buyer can move its price with a handful of large trades. That is exactly what happened: Tectonic allowed its own low-liquidity token, TONIC, to be used as collateral for loans, and the attacker took advantage of it before the market or the protocol's oracle could correct the price.

## The network's response

Cronos halted block production within minutes of the attack — by then about $6 million had already left for Ethereum. The next day, validators restarted the network, rolling its state back to the block before the attack, which reversed most of the consequences — a decision rare for networks of this scale that sparked debate about blockchain immutability.

## Context

The attack became one of the examples in TRM Labs' report on the record number of price-manipulation attacks in 2026 — see the related story for more.
