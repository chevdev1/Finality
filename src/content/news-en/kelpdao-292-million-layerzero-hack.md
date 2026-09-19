---
takeaways:
  - "On April 18, 2026, attackers drained 116,500 rsETH (about $292 million) through the KelpDAO bridge built on the LayerZero cross-chain messaging protocol — the year's largest DeFi exploit."
  - "The attack began with social engineering of a LayerZero Labs developer to steal session keys, followed by a breach of the company's RPC cloud and poisoning of internal nodes, while a DDoS attack on the remaining nodes forced the system to fail over to the compromised ones."
  - "The root cause was a 1-of-1 verification configuration: only one node confirmed cross-chain messages before funds were released. Mandiant, CrowdStrike, and independent researchers link the attack to the North Korean group TraderTraitor (UNC4899)."
---

## Not a smart-contract bug, but an infrastructure breach

KelpDAO is a liquid restaking protocol whose rsETH token uses a LayerZero-based bridge to move between networks. Unlike a typical DeFi exploit, where attackers find a vulnerability directly in smart-contract code, here the bridge's code contained no bug — as OpenZeppelin notes in its incident analysis, "$292 million lost, no bugs found." The attack targeted the infrastructure that verifies messages between chains, not the contract itself.

## Timeline of the attack

The attack began with social engineering of a LayerZero Labs developer — attackers obtained his session keys and used them to break into the company's cloud RPC infrastructure and poison internal nodes. In parallel, they mounted a DDoS attack that knocked out the remaining legitimate RPC nodes, forcing the system to fail over to the already-compromised nodes controlled by the attackers. The bridge's verifier, relying on data from those nodes, authorized the withdrawal of 116,500 rsETH to attacker-controlled addresses.

## Root cause: one verifier instead of several

The key structural problem: the KelpDAO bridge's DVN (Decentralized Verifier Network) configuration was set to 1-of-1 — a single node was responsible for confirming cross-chain messages before funds were released, even though LayerZero had earlier recommended that protocols use multi-verifier schemes precisely to protect against such scenarios. KelpDAO subsequently publicly blamed LayerZero, saying its default settings were the real cause of the disaster; LayerZero, in turn, pointed out that the configuration had been approved by the protocol itself.

## What changed afterward

After the incident, KelpDAO moved rsETH from LayerZero's OFT format to the Chainlink CCIP protocol — that is, it changed the cross-chain infrastructure itself rather than merely fixing the configuration within the old one. Mandiant, CrowdStrike, and independent security researchers link the attack to the North Korean group TraderTraitor (also known as UNC4899) — the same category of attacker that, according to Finality's earlier coverage, accounts for a growing share of major thefts in the crypto industry through compromise of infrastructure and keys rather than exploitation of bugs in code.
