---
takeaways:
  - "On September 6, 4,000 of 4,200 BTC (~$320 million) left the federated reserve of the Liquid Network due to a bug in range-proof verification caching in the open-source Elements code."
  - "On September 7, the attackers returned 3,400 BTC, calling themselves \"white hats\" conducting a vulnerability disclosure; roughly 600 BTC have not yet been returned."
  - "The patch for the vulnerable cache was merged into the public Elements branch as early as September 1–3 — meaning the fix was visible in advance to anyone looking for it."
---

**What happened.** On September 6 at 15:53:10 UTC (Liquid block 4,050,336), about 4,000 of the 4,200 BTC held in multisig left the reserve wallet of the Liquid Network federation — a bitcoin [federated sidechain](/en/glossary/#federated-sidechain) run by Blockstream. At the time of the withdrawal, that was about $320 million.

## How it worked technically

The vulnerability wasn't in signature cryptography but in how Liquid nodes cache the verification of a [range proof](/en/glossary/#range-proof) — the mechanism that, in Elements' confidential transactions, confirms that amounts are non-negative without revealing the amounts themselves. The cache defect was fixed in the public Elements branch as early as September 1–3 — meaning anyone reading the open repository had several days to work out what exactly was vulnerable. Every production build in the federation was vulnerable at that point.

## Partial return of funds

On September 7 at 16:09:25 UTC (block 965,950), the attackers returned 3,400 BTC to the Liquid federation's peg wallet. In their statement on X they called themselves "white hats" conducting a vulnerability disclosure and said they would return the funds after the hole was closed with a patch. About 598–600 BTC remained with the attackers at the time of publication; Blockstream refuses to pay a ransom and says it is pursuing recovery by legal means.

## What remains open

An independent review of the security of the entire attack chain and Blockstream's acknowledgment of the vector as final are still ongoing — see the verification log above.
