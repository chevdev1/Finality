---
takeaways:
  - "Starting July 30, attackers drained about 1,816 BTC (~$116 million) from more than 5,200 addresses by exploiting a five-year-old vulnerability in the firmware of Coinkite's Coldcard hardware wallets."
  - "The bug was in firmware version 4.0.1, released in March 2021: when generating a seed phrase, the device bypassed its dedicated hardware randomness chip and used a predictable software substitute instead."
  - "Owners who generated a seed phrase on a Coldcard between March 2021 and the release of the patch are advised to treat it as compromised and move funds to a new seed; this is the third-largest crypto hack of 2026."
---

## A hardware wallet is no guarantee against bad randomness

Coldcard is positioned as one of the most secure hardware wallets on the market — a cold-storage device physically isolated from the internet. That is exactly why this hack is so telling: what was compromised wasn't the fact of offline storage, but the quality of the random numbers from which the seed phrase was generated when the device was initialized. Firmware version 4.0.1, released in March 2021, contained a bug that made the device bypass its dedicated hardware randomness chip and use a predictable software substitute instead — seed phrases generated in that state were vulnerable to brute force.

## Scale and timeline of the attack

Since July 30, attackers have drained about 1,816 BTC (around $116 million at the price at the time of theft) from more than 5,200 addresses in four waves. According to TRM Labs' analysis, the pattern of transactions suggests the attack may be the work not of one group but of several independent attackers exploiting the same known vulnerability in parallel — the company isn't yet attributing the theft to a specific actor.

## What affected users should do

Everyone who generated a seed phrase on a Coldcard device between the release of the vulnerable firmware in March 2021 and the release of the patch is advised to treat that seed phrase as compromised and move funds to a new, freshly generated wallet — regardless of whether that specific seed phrase has already been attacked. Simply updating the firmware doesn't undo the fact that an already-generated key could have been weak.

## Its place in the 2026 picture

This theft is the third-largest crypto hack of 2026, bringing total losses since the start of the year to more than $1.2 billion across 276 incidents. Alongside Finality's earlier analysis showing that key theft has overtaken smart-contract bugs as the main cause of DeFi losses, the Coldcard hack is a rare example where what was compromised was not a person's handling of a key (phishing, social engineering) but the generation of the key itself by a device the user trusted most by definition.
