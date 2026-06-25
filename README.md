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
| **Auto Buy** | Buys the most profitable building (CPS/price ratio + synergies) and every affordable upgrade |
| **Wrinklers** | Pops all wrinklers once they all reach final stage, collecting their cookies |
| **Sugar Lumps** | Harvests a sugar lump automatically once it is ripe, for a guaranteed gain |
| **Spell** | Casts Force the Hand of Fate when the Grimoire is fully charged |
| **Conjure Baked Goods** | Casts Conjure Baked Goods whenever enough Grimoire magic is available |
| **Fortune** | Clicks fortune messages in the news ticker to collect rewards |
| **Dragon** | Levels up Krumblor automatically, using only cookie-paid levels by default |
| **Dragon Sacrifice** | Opt-in (shown while Dragon is on): also levels the sacrifice levels, which cost buildings |
| **One Mind** | Allows Auto Buy to purchase the "One Mind" upgrade (Grandmapocalypse path) |
| **Lucky Reserve** | Keeps about CPS × 6000 banked so Golden "Lucky!" cookies pay their maximum |

The panel is draggable and collapsible, and each feature toggles independently. Every toggle stays hidden until its in-game system is unlocked (the dragon, the Grimoire spells, sugar lumps, and so on) and appears automatically as you progress, so you only ever see what you can actually use. Settings are saved with your Cookie Clicker save file.

A colour-coded CPS/price ratio is displayed on each building tile in the store to help identify the most profitable purchase at a glance.

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
- **Not for leaderboards or records.** Competitive and vanilla play forbid third-party
  automation. Use this for a relaxed or idle playthrough, not for a ranked run.

In short: it keeps your save legitimate to the game, but it does the playing for you.
Use it because it is convenient, not to claim achievements you did not earn.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the version history. Downloads are on the [Releases](https://github.com/Fyrins/cookie-clicker-companion/releases) page.

## License

MIT — see [LICENSE](LICENSE)
