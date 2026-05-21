+++
title = "Apex 2026: Celebrating the Hiero Bounty Winners"
date = 2026-05-21
featured_image = "/images/apex.png"
categories = ["Blog"]
tags = ["Hackathon", "Hedera", "Community", "Apex", "Bounty"]
duration = "4 min read"
abstract = "The Hello Future Apex Hackathon has wrapped, closing out the Hello Future Trilogy. Alongside the main track winners announced by Hedera, three projects took home the Hiero bounty for advancing the open-source tooling that the wider ecosystem builds on."
slug = "apex-2026-hiero-bounty-winners"

[[authors]]
name = "Angelina Ceppaluni"
organization = "Hiero"
image = "/images/profile-hiero.png"
+++

The Hello Future Apex Hackathon 2026 is finally done. Five weeks of building, wrapping up the final chapter of the Hello Future Trilogy. A lot of impressive submissions across five main tracks and a stack of partner bounties for a total prize pool of $250,000.

Hedera has already published the full breakdown of the [main track winners](https://hedera.com/blog/these-are-the-winners-of-the-hello-future-apex-hackathon/), spanning AI & Agents, DeFi & Tokenization, Sustainability, Open Track, and Legacy Builders.

## The Hiero Bounty

Hiero is the open-source project built on the Hedera network. Strong applications on Hedera depend on strong libraries, SDKs, and infrastructure tooling underneath them. The Hiero bounty exists to push that layer forward.

These bounty submissions are an essential plumbing: SDKs in new languages, mirror node clients, framework integrations, and developer ergonomics. The kind of work that quietly makes the next hundred projects easier to build.

Three submissions stood out in this Hackathon.

## 1st Place: Hiero Enterprise JS

**Submitter:** [Jessy Ssebuliba](https://jexsie.com)
**Repo:** [hiero-hackers/hiero-enterprise-js](https://github.com/hiero-hackers/hiero-enterprise-js)

Hiero Enterprise JS is a TypeScript library that makes building Node.js applications on Hiero feel like building any other modern backend. It ports the patterns of the existing Hiero Enterprise Java project into the JavaScript ecosystem, with first-class integrations for the three frameworks that most teams reach for: **Express**, **Fastify**, and **NestJS**.

The package layout reflects that:

- `@hiero-enterprise/core` for data models, services, repositories, config, and errors
- `@hiero-enterprise/express` for Express middleware
- `@hiero-enterprise/fastify` for a Fastify plugin
- `@hiero-enterprise/nest` for a NestJS module with proper dependency injection

Under the hood it exposes managed clients for accounts, files, fungible tokens, NFTs, smart contracts, and topics, along with mirror node repositories for read-side queries. The DX is exactly what enterprise Node developers expect:

```typescript
app.get("/balance", async (req, res) => {
  const balance = await req.hiero.accountClient.getOperatorAccountBalance();
  res.json(balance);
});
```

For the large slice of the Hedera developer community that lives in Node, this lowers the floor significantly. Congratulations to [Jessy](https://jexsie.com) on a thoroughly engineered submission.

## 2nd Place: Rust Hiero Mirror Node Client

**Submitter:** [@gmintu](https://github.com/Gmin2)
**Repo:** [hiero-hackers/rs-hiero-mirror-node](https://github.com/hiero-hackers/rs-hiero-mirror-node)

Rust has been a notable gap in the Hiero tooling story, and **gmintu** picked a high-impact place to start filling it: a typed Rust client for the Hiero Mirror Node REST API.

The library wraps the mirror node endpoints behind an ergonomic async client, with examples covering basic queries, pagination, and tokens:

```rust
let client = MirrorNodeClient::new("https://mainnet.mirrornode.hedera.com");
let account = client.accounts().find_by_id("0.0.2").await?;
```

It ships with both unit and integration tests and is structured to grow alongside the mirror node API surface. For Rust teams building indexers, analytics pipelines, or systems-level integrations on Hedera, this is a meaningful starting point. Great work, **gmintu**.

## 3rd Place: Hiero HCS Replay

**Submitter:** [@kaldun-tech](https://github.com/kaldun-tech)
**Repo:** [kaldun-tech/hiero-hcs-replay](https://github.com/kaldun-tech/hiero-hcs-replay)

Anyone who has tried to load-test a Hedera application knows the gap between synthetic traffic and the real thing. Production HCS topics are bursty and irregular, and uniform traffic generators don't stress systems the same way real workloads do.

**Hiero HCS Replay** closes that gap. It's a Go library that fetches real timing patterns from any public HCS topic via the Mirror Node REST API, then replays them at a configurable speed to drive realistic load tests. Sequential mode reproduces the original sequence exactly; sample mode draws from the same statistical distribution. A 10x speedup lets you compress hours of real traffic into minutes of testing.

```go
data, _ := hcsreplay.FetchTiming(ctx, "0.0.120438", hcsreplay.Mainnet, 1000)
replay := hcsreplay.NewReplay(data, hcsreplay.ModeSample, 10.0)

for i := 0; i < n; i++ {
    time.Sleep(replay.NextDelay())
    // your operation here
}
```

It has zero external dependencies (pure Go standard library, no Hedera SDK required), ships with strong test coverage, and was extracted from a real production benchmarking tool, so it's not just a hackathon prototype. Congratulations to **kaldun-tech** for a submission that will make a lot of other teams' testing more honest.

## What Comes Next

Hiero is open source year-round and there's always more to do.

A few good places to start:

- Browse open issues across the [Hiero org](https://github.com/hiero-ledger) and look for the `good first issue` label
- Read the [contributor docs](../README.md) for the workflow
- Drop into the community Discord channel and tell us what you're working on

Huge thanks to everyone who submitted, the judges who reviewed, and the wider Hedera and Hiero communities that made Apex a fitting close to the trilogy. The bar these projects set is the new baseline. We can't wait to see what gets built on top of them.