# Changelog

All notable changes to Cookie Clicker Companion are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The game-facing `ModVersion` field in `info.txt` tracks the major and minor
parts of the public version (for example `1.0.x` and `1.1.x` map to `ModVersion`
`1` and `1.1`); the game uses it only to detect a changed save format.

## [Unreleased]

## [2.1.0] - 2026-06-29

### Added
- **Garden Breeder** toggle (opt-in) — auto-cross-breeds the Garden to unlock valuable locked
  seeds. It targets the most valuable still-locked seed in turn (Golden clover, then
  Shimmerlily, then Elderwort), planting each step's parents in a checkerboard so the isolated
  empty tiles roll the right mutation, and harvests the result once mature to unlock the seed.
  Free-planting only (Turbo-charged soil), never spends cookies, and hides once the targets are
  unlocked. It is a long, RNG-driven unlock phase, not passive farming. The basic Garden and
  Golden Clover Garden toggles defer to it so they never fight over the plot.
- **Grandmapocalypse bundle** — once the apocalypse is running, the **One Mind** toggle now
  also turns on the wrath-cookie auto-pop a single time (wrath cookies give far more than they
  cost). It re-arms each apocalypse and respects a manual off afterwards.

### Changed
- **Pantheon line-up now follows your play style, not the mode.** It is chosen from the
  golden- and big-cookie auto-click toggles: Golden gods (Selebrak + Vomitrax) when golden
  auto-click is on, CpS gods (Mokalsium + Holobore) when it is off, plus Muridal in the jade
  slot for clicking power when the big-cookie auto-click is on. Holobore is only ever slotted
  while golden auto-click is off, so it never self-unslots.
- **Stock Market rewritten to cost-averaging (DCA).** It tracks a weighted-average buy price
  per good, averages down on dips, and sells the whole position once the price clears that
  average by enough to beat the broker fee — instead of the previous aggressive profile, which
  could hoard illiquid stock at a loss. Broker hiring is now prioritised (each broker cuts the
  fee), and the average buy-in is saved with your game so a reload keeps it.
- **Lucky Reserve now uses raw (un-buffed) CPS.** Previously the reserve was based on buffed
  CPS, so a Frenzy multiplied it ~7× and could exceed the whole bank, freezing every building,
  upgrade and Stock Market purchase for the buff's duration. The reserve is now stable.
- **The panel body scrolls.** Tall panels (many unlocked features) are no longer clipped — the
  body is capped at 85% of the window height with a thin scrollbar, so every row stays
  reachable.

### Fixed
- **Force the Hand of Fate no longer busy-loops on a full-but-too-small magic pool.** Early in
  an ascension the pool can be full yet below the spell's cost; the safe-cast now waits instead
  of re-predicting every tick (which, in dev mode, also flooded the log).

## [2.0.0] - 2026-06-27

### Added
- **Strategy modes** — a preset selector at the top of the panel configures the strategic
  toggles in one move, resolving the tug-of-war between CPS growth and investment:
  - **Grind** (pure CPS growth): auto-buys buildings and upgrades and sets the Radiant
    Appetite dragon aura, while keeping the Stock Market, offices and Lucky Reserve off so
    every cookie funds growth.
  - **Investor** (max income): adds the Lucky Reserve, an aggressive Stock Market (with
    offices and brokers) and the idle Pantheon line-up on top of the auto-buy.
  - **Manual**: the previous behaviour — every toggle independent, the preset touches
    nothing.

  The modes are presets, not locks: after applying one, every toggle stays adjustable by
  hand, and editing a strategic toggle drops the selector back to Manual. The active mode is
  saved with your Cookie Clicker save (old saves load as Manual). The mode names are shown
  in English in every language; the selector caption and tooltip are localized.
- **Golden Clover Garden** toggle (opt-in): fills and maintains the Garden with Golden clover
  for a large permanent boost to golden cookie frequency (+3% per mature tile) — potentially
  the mod's biggest passive income lever, since golden cookies dominate income. It requires
  the Turbo-charged soil upgrade (free planting) and the Golden clover seed unlocked, never
  spends cookies, and stays hidden until both are available. The basic Garden toggle defers
  to it so the two never conflict. Use Clay soil for an extra +25%.

### Changed
- **Auto Buy Buildings now has a patience floor.** Instead of always buying the best
  *affordable* building, it skips one whose profitability is below 5% of the best available
  and lets the bank build toward a worthwhile purchase instead — so cookies are no longer
  frittered on near-worthless cheap buildings while a far better one is only a tick or two
  away. The Stock Market's buildings-first deferral mirrors this decision exactly.
- The Stock Market now trades according to the active mode: **Investor** uses an aggressive
  profile (buys closer to the mean price, takes larger positions and takes profit sooner),
  while Manual and Grind keep the conservative v1.6.0 profile — so turning the market on
  outside Investor behaves exactly as before.
- The Stock Market's take-profit is now anchored to the buy-in price (sell once the price
  clears the purchase price by a margin), with a downturn safeguard above a minimum gain,
  instead of waiting for a falling trend. The Bank minigame ticks only once a minute and its
  trends last tens of minutes to hours, so this reliably realises gains over long idle play
  rather than letting positions sit unsold.
- Added the strategy selector caption and tooltip in all 12 languages.

## [1.6.0] - 2026-06-27

### Added
- New **Minigames** panel section with three automations:
  - **Stock Market** — trades the Bank minigame: buys a stock below its mean price on an
    uptrend and sells the whole stock on a downturn once it beats your buy-in. Building and
    upgrade auto-buy keep priority over the shared cookie pool, so the market only invests
    the leftover surplus above the Lucky Reserve.
  - **Garden** — harvests mature plants just before they wither and replants the same
    species for passive farm income; immortal plants are left untouched.
  - **Pantheon** — slots a set-and-forget idle line-up (Mokalsium in diamond, Jeremy in
    ruby) by spending real worship swaps. The jade slot is deliberately left empty: the
    only strong idle god for it, Holobore, un-slots itself and drains every swap the
    instant a golden cookie is clicked — which the auto-clicker does constantly.
- **Dragon Aura** toggle (opt-in): sets the primary aura to Radiant Appetite (×2 cookie
  production) once it is selectable at dragon level 19, paying the real building-sacrifice
  cost once, exactly as the in-game menu does.
- **Market Offices** toggle (opt-in): upgrades the Bank's offices for more stock storage
  (bigger trades) by sacrificing cursors, gated behind the Cursor building's sugar-lump level.
- The Stock Market now also hires **brokers** from the surplus to cut its trading overhead.

### Changed
- **Auto Buy Buildings keeps growing instead of stalling.** When the top-ratio building is one
  you already own but can't afford yet, it now buys the best *affordable* building so your CPS
  keeps rising; it only saves up when the top target is a brand-new building unlock (worth the
  wait for the new building and its upgrade line).
- The **Lucky Reserve** tooltip now states it is a deliberate savings mode that pauses buying
  until the reserve is reached, not a passive bonus.
- **Force the Hand of Fate is now safe-cast.** The Spell toggle predicts the outcome from
  the game's seed (the same "scrying" the community FtHoF Planner uses) and only casts when
  a golden cookie is guaranteed, skipping predicted backfires (wrath cookies). On a
  predicted backfire it burns one cheap Conjure to advance the seed instead of stalling.
- Tooltips and notifications updated in all 12 languages for the new toggles and the
  changed spell behaviour.
- README: documented the new features, expanded the "Is this cheating?" disclaimer
  (minigame achievements unlock on their own, the Pantheon and Dragon Aura pay their real
  costs, and Force the Hand of Fate uses RNG foreknowledge), and added a Credits &
  resources section linking the community sources that informed these features.

### Removed
- Removed the standalone **Conjure Baked Goods** toggle. Now that Force the Hand of Fate is
  a risk-free safe-cast, it already casts Conjure on predicted backfires, so a separate
  Conjure toggle was redundant. Conjure is still available through the game's own Grimoire.

### Fixed
- Auto-buy synergy scoring used the synergy's *total* boost across all owned units, which
  over-weighted a building the more of it you owned and skewed comparisons between building
  types. It now uses the correct marginal (per-unit) synergy gain. Added a guard against a
  divide-by-zero when CPS is still 0 at the very start of a run.
- The Stock Market's "buildings first" deferral now mirrors the auto-buy's real decision, so
  it no longer drains the cookie bank while the auto-buy is buying affordable buildings. While
  saving for a brand-new building it puts the idle surplus to work instead of hoarding it.

## [1.5.0] - 2026-06-26

### Added
- Threshold-aware profitability. The auto-buy and the store panel now also value how
  close a building is to its next tier milestone (the ×2 upgrade unlocked at 1, 5, 25,
  50, 100, 150, …). Each building is scored as the higher of its per-unit ratio and the
  amortised cost of reaching that milestone plus its ×2 upgrade, so Auto Buy Buildings
  commits to a nearby milestone when it pays off and ignores distant ones, where the ×2
  would be diluted across too many costly units.

### Changed
- The Auto Buy Buildings tooltip was rewritten (in all 12 languages) to describe the
  milestone-aware targeting and the fact that it saves up for the best building rather
  than spending on lesser ones.

### Fixed
- Strict upgrade priority no longer freezes building purchases for unaffordable
  upgrades. Buildings are now deferred only when an eligible upgrade is purchasable
  *this tick*; an out-of-reach upgrade in the store used to halt all building buys
  (and therefore milestone progress) while cookies sat idle saving for it. This was
  the real cause behind Auto Buy Buildings appearing to stall completely.

## [1.4.0] - 2026-06-25

### Added
- Auto Buy is now two independent toggles: **Auto Buy Buildings** and **Auto Buy
  Upgrades**. When both are on, upgrades take strict priority: the mod will not buy a
  building while any eligible upgrade is still in the store.

### Changed
- The Lucky Reserve tooltip now shows the amount currently reserved (CPS × 6000),
  refreshed live while you hover it.
- Removed the "Enable all" / "Disable all" buttons to keep full per-toggle control.

### Fixed
- "One mind" is no longer auto-bought unless its own toggle is on (the upgrade auto-buy
  could previously trigger it).

## [1.3.0] - 2026-06-25

### Added
- Toggles whose game system is not unlocked yet (Dragon, Spells, Sugar Lumps,
  Wrath/Wrinklers, Fortune, One Mind) are now hidden until the game unlocks them, and
  reappear automatically. An empty panel section is hidden too.
- **Dragon Sacrifice** toggle, shown only while Dragon is enabled: an opt-in that lets
  the dragon auto-level pay the sacrifice levels (5-26) by sacrificing 100 buildings
  each. Off by default, so the dragon never sacrifices buildings unless you choose to.

### Fixed
- Dragon auto-level no longer sacrifices buildings. Krumblor levels 5-26 are paid by
  sacrificing 100 buildings each, which the game does silently with no confirmation;
  the mod now only levels the dragon when the next level is paid in cookies and leaves
  the sacrifice levels to a deliberate manual choice.

### Changed
- The two spells (Force the Hand of Fate, Conjure Baked Goods) now have their own
  "Spells" section in the panel, separate from "Automation".

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

[Unreleased]: https://github.com/Fyrins/cookie-clicker-companion/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v2.0.0
[1.6.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.6.0
[1.5.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.5.0
[1.4.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.4.0
[1.3.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.3.0
[1.2.1]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.2.1
[1.2.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.2.0
[1.1.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.1.0
[1.0.0]: https://github.com/Fyrins/cookie-clicker-companion/releases/tag/v1.0.0
