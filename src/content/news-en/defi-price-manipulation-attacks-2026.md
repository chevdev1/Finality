---
takeaways:
  - "Since the start of 2026, TRM Labs has recorded 32 price-manipulation attacks on DeFi lenders — a record for the industry."
  - "The common thread in the attacks is low-liquidity tokens whose price on a local market can be moved by a single well-funded participant."
  - "The attack on Tectonic (Cronos, $75 million) is one of the examples analyzed in the report."
---

## The common pattern

According to analytics firm TRM Labs, most of the 32 incidents are similar in structure: a low-liquidity token is sharply pumped on a single venue that feeds a lending protocol's oracle, and is then used as collateral for a loan at the inflated price. That's exactly how the attack on Tectonic on Cronos worked, where the value of the TONIC token was pumped 100x before a $75 million loan.

## Why the scheme keeps working

Most often the victims are protocols that accept "long-tail" tokens as collateral — assets with low trading volume, including the protocols' own governance tokens — without a price feed weighted by liquidity depth across several venues. Until such protocols change their approach to oracles, 2026 is unlikely to remain the record year for long.
