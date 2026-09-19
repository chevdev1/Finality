---
takeaways:
  - "A federated sidechain hands control of the underlying asset to a fixed group of signers (\"functionaries\")."
  - "Security depends entirely on how that group protects its keys and node code, not on signature cryptography as such."
  - "Users trade the base layer's settlement guarantees for faster and more confidential transactions."
---

## The custody model

A federated sidechain like the Liquid Network pegs an asset — here, bitcoin — by locking it with a fixed set of "functionaries" who jointly control a multisig wallet. Assets enter the sidechain only when the federation confirms the corresponding lock on the base network, and leave by the same route.

## Where the risk is concentrated

Because the reserve is held by the federation itself, the whole security model depends not only on how well that group protects its keys but also on the quality of the nodes' own code. The September 6 incident showed a third kind of risk: a bug in how nodes cache data verification — a vulnerability tied directly neither to keys nor to signature cryptography, yet still capable of draining almost the entire reserve.

## Why it isn't the same as a smart-contract bug

Unlike a smart-contract exploit on Ethereum, where a patch can be released quickly and state migrated, compromising a federated sidechain raises the question of trust in the entire group of signers — the patch has to be applied on all of the federation's nodes at the same time, before the bug is exploited again.
