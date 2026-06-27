<p align="center">
  <img src="docs/banner.jpg" alt="Cookie Clicker Companion" width="720">
</p>

# Cookie Clicker Companion

All-in-one automation mod for Cookie Clicker (Steam / PC). It automates repetitive actions (clicking, buying, collecting) without injecting cookies or editing game values. It is an assistance tool that plays for you, so please read [Is this cheating?](#is-this-cheating) before using it.

<p align="center">
  <img src="docs/panel.jpg" alt="Cookie Clicker Companion panel in-game" width="320">
</p>

## Features

| Feature | Description |
|---|---|
| **Golden Cookie** | Auto-clicks golden cookies and reindeer as soon as they appear |
| **Wrath Cookie** | Auto-clicks wrath cookies (red); appears during the Grandmapocalypse |
| **Big Cookie** | Continuously clicks the main cookie at max speed |
| **Auto Buy Buildings** | Targets the most profitable building (CPS/price ratio, synergies, and how close it is to its next ×2 tier milestone), saving up for it rather than spending on lesser buildings |
| **Auto Buy Upgrades** | Buys every affordable store upgrade (excluding the irreversible Grandmapocalypse ones); takes priority over buildings while an upgrade is affordable |
| **Wrinklers** | Pops all wrinklers once they all reach final stage, collecting their cookies |
| **Sugar Lumps** | Harvests a sugar lump automatically once it is ripe, for a guaranteed gain |
| **Spell** | Safe-casts Force the Hand of Fate: predicts the outcome from the game seed and only casts when a golden cookie is guaranteed, skipping predicted backfires (on a predicted backfire it casts a cheap Conjure instead, to reshuffle the draw) |
| **Fortune** | Clicks fortune messages in the news ticker to collect rewards |
| **Dragon** | Levels up Krumblor automatically, using only cookie-paid levels by default |
| **Dragon Sacrifice** | Opt-in (shown while Dragon is on): also levels the sacrifice levels, which cost buildings |
| **Dragon Aura** | Opt-in: sets the primary aura to Radiant Appetite (×2 CPS) at dragon level 19, paying the real building-sacrifice cost once |
| **Stock Market** | Trades the Bank minigame: buys below the mean price on an uptrend, sells on a downturn above your buy-in, and hires brokers to cut fees. Building and upgrade purchases keep priority — it only invests the leftover surplus above the Lucky Reserve |
| **Market Offices** | Opt-in: upgrades the Bank's offices for more stock storage (bigger trades) by sacrificing cursors, gated behind the Cursor building's sugar-lump level |
| **Garden** | Harvests mature plants just before they wither and replants them, for passive farm income (leaves immortal plants alone) |
| **Pantheon** | Slots a set-and-forget idle line-up (Mokalsium + Jeremy), spending real worship swaps |
| **One Mind** | Allows Auto Buy to purchase the "One Mind" upgrade (Grandmapocalypse path) |
| **Lucky Reserve** | Keeps about CPS × 6000 banked so Golden "Lucky!" cookies pay their maximum |

The panel is draggable and collapsible, and each feature toggles independently. Every toggle stays hidden until its in-game system is unlocked (the dragon, the Grimoire spells, sugar lumps, and so on) and appears automatically as you progress, so you only ever see what you can actually use. Settings are saved with your Cookie Clicker save file.

A colour-coded profitability score is displayed on each building tile in the store (CPS/price ratio plus how close the building is to its next ×2 tier milestone) to help identify the best purchase at a glance.

<p align="center">
  <img src="docs/store-ratios.jpg" alt="Colour-coded CPS/price ratios in the building store" width="240">
</p>

## Installation

1. Download or clone this repository
2. Copy the `Cookie Clicker Companion` folder into your Cookie Clicker mods directory:
   - **Steam (Mac):** `~/Library/Application Support/Steam/steamapps/common/Cookie Clicker/Cookie Clicker.app/Contents/Resources/app/mods/local/`
   - **Steam (Windows):** `C:\Program Files (x86)\Steam\steamapps\common\Cookie Clicker\resources\app\mods\local\`
3. Launch Cookie Clicker, go to **Options → Mods**, and open **Manage mods**:

<p align="center">
  <img src="docs/mods-bar.jpg" alt="Mods section in Cookie Clicker options" width="640">
</p>

4. Select **Cookie Clicker Companion** in the list (it loads as a local mod) and make sure it is enabled, then click **Save & Reload**:

<p align="center">
  <img src="docs/mods-manage.jpg" alt="Cookie Clicker Companion selected in the Manage mods window" width="520">
</p>

The required `info.txt` manifest is included in the repository — no manual setup needed.

## Languages

EN · FR · DE · NL · CS · PL · IT · ES · PT-BR · JA · ZH-CN · RU

The mod detects the game language automatically. If the language file is not found, it falls back to English.

## Compatibility

- Cookie Clicker **2.031+** (Steam)
- Works alongside other mods

## Is this cheating?

Yes, in spirit. This mod automates actions you could perform by hand; it plays the
idle parts of the game for you. It does **not** inject cookies or edit game values,
so the game's own checks still consider your save clean. Decide for yourself with the
facts below (all verified against the game's source):

- **No resource hacking.** The mod never changes your cookie count or any progression
  value, so it does not trigger the *Cheated cookies taste awful* shadow achievement.
- **No *Third-party* mark on Steam.** That shadow achievement is only granted on the
  web version of the game; the Steam build never awards it for loading a mod.
- **Steam achievements stay active.** Cookie Clicker keeps earning and syncing its
  normal achievements while the mod is loaded. In practice you can unlock Steam
  achievements with far less effort than intended, which many players consider unfair.
- **Some achievements become unreachable.** Turning on the big-cookie auto-clicker
  permanently rules out *Neverclick* and *True Neverclick*; the auto-buy rules out
  *Hardcore*. The mod also resets the click-speed counter, so it will not grant
  *Uncanny clicker*.
- **Minigame achievements unlock on their own.** The Stock Market, Garden and spell
  automations trigger the *real* in-game actions, so the game legitimately grants their
  achievements (*Buy buy buy*, *Liquid assets*, *Botany enthusiast*, *A wizard is you*,
  …) without you doing the work — same situation as the auto-buy and its building
  achievements. The Stock Market's profits are real cookies the game itself credits.
- **The Pantheon and Dragon Aura pay their real costs.** Rather than bypassing them, the
  mod deliberately spends a real worship swap to slot a god, and sacrifices your highest
  building to switch an aura — exactly what the in-game menus charge. No free shortcuts.
- **Force the Hand of Fate uses RNG foreknowledge.** Its safe-cast reads the game's
  public seed to predict the outcome and only casts on a win (this is "scrying", a known
  community technique — the [FtHoF Planner](https://joseph3079.github.io/FtHoF-Planner-v5/)
  is a public tool that does the same). The game neither forbids nor detects it, and
  nothing is injected, but it is foreknowledge — disclosed here in full.
- **Not for leaderboards or records.** Competitive and vanilla play forbid third-party
  automation. Use this for a relaxed or idle playthrough, not for a ranked run.

In short: it keeps your save legitimate to the game, but it does the playing for you.
Use it because it is convenient, not to claim achievements you did not earn.

## Credits & resources

The automation logic is informed by the Cookie Clicker community's strategy resources.
The [External Resources hub](https://cookieclicker.wiki.gg/wiki/External_Resources) on the
wiki indexes most of them. The ones that directly shaped this mod's features:

- **[FtHoF Planner](https://joseph3079.github.io/FtHoF-Planner-v5/)** — outcome prediction
  for Force the Hand of Fate, the basis for the Spell safe-cast.
- **[Building/Upgrade Calculator](https://coderpatsy.bitbucket.io/cookies/cookies.html)** —
  purchase-efficiency reference behind the Auto Buy profitability score.
- **[Pantheon Setups](https://cookieclicker.wiki.gg/wiki/Pantheon#Setups)** — the idle
  god line-up used by the Pantheon toggle.
- **[Garden minigame guide](https://docs.google.com/document/d/1ahOem9Lsg83gAdAMo6Cujxgcrr4c2JA9Fy8qEzw8E2I/)** —
  plant timing and harvest strategy behind the Garden toggle.

These are third-party resources, not affiliated with this mod or with Cookie Clicker.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the version history. Downloads are on the [Releases](https://github.com/Fyrins/cookie-clicker-companion/releases) page.

## License

MIT — see [LICENSE](LICENSE)
