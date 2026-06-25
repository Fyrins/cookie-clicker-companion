# Changelog

All notable changes to Cookie Clicker Companion are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The game-facing `ModVersion` field in `info.txt` tracks the major and minor
parts of the public version (for example `1.0.x` and `1.1.x` map to `ModVersion`
`1` and `1.1`); the game uses it only to detect a changed save format.

## [Unreleased]

## [1.2.1] - 2026-06-25

### Changed
- The Spell and Conjure Baked Goods tooltips now warn that both spells draw from the
  same magic pool, so enabling them at the same time is counter-productive.

## [1.2.0] - 2026-06-25

### Added
- **Sugar Lumps auto-harvest**: new toggle that collects a sugar lump as soon as it is
  ripe, when the gain is a guaranteed +1.
- **Conjure Baked Goods**: new toggle that casts the Grimoire's Conjure Baked Goods
  spell whenever enough magic is available, alongside the existing Force the Hand of
  Fate toggle.
- **Lucky Reserve**: new toggle that makes Auto Buy keep about CPS × 6000 in the bank so
  Golden "Lucky!" cookies pay out their full capped amount; only the surplus is spent.

### Changed
- Store ratios are now recomputed about four times per second instead of every frame,
  reducing CPU use with no visible difference.

## [1.1.0] - 2026-06-25

### Added
- Store ratios now follow the 1 / 10 / 100 bulk selector: the displayed CPS/price
  ratio is scaled to the cost of a full bulk purchase, so it matches the bulk price
  the game shows. The colour ranking is unchanged, and Auto Buy still purchases one
  unit at a time at the best marginal ratio.

## [1.0.0] - 2026-06-25

First public release.

### Added
- "Companion" automation panel with independent toggles, draggable and collapsible.
- Click automation: golden cookies and reindeer, wrath cookies, and the big cookie.
- Profitability-aware Auto Buy: buys the building with the best CPS/price ratio
  (synergies included) and every affordable upgrade, while skipping the
  irreversible Elder / Grandmapocalypse upgrades.
- Wrinkler collection, automatic spell casting (Force the Hand of Fate), fortune
  collection from the news ticker, and dragon levelling up to the final level.
- Colour-coded CPS/price ratios shown on each building tile in the store, with
  three customizable colours.
- 12 languages with automatic detection and English fallback (EN, FR, DE, NL, CS,
  PL, IT, ES, PT-BR, JA, ZH-CN, RU).
- Settings persisted with the Cookie Clicker save file. Progression values are never
  altered (no resource hacking); see the README's "Is this cheating?" section for how
  automation affects achievements.

[Unreleased]: https://github.com/Fyrins/cookie-clicker-companion/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.2.1
[1.2.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.2.0
[1.1.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.1.0
[1.0.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.0.0
