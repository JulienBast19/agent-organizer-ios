# Ecuador Rural Land Explorer

An interactive decision tool for choosing rural land in Ecuador as a private natural
property or retreat. It is built around a map of Ecuador with 28 real, publicly
advertised listings plotted on it, each researched against a fixed set of fields and
scored on five dimensions whose weights you control live.

Open `index.html` in a browser, or serve the folder and publish it with GitHub Pages.
No build step, no package install, no network needed — Leaflet is vendored in
`assets/vendor/leaflet/`. Map tiles are the only thing fetched at runtime.

## The brief this was researched against

- 2–5 hectares (20,000–50,000 m²)
- Undeveloped or lightly developed
- Nature, privacy and low surrounding development weigh heaviest
- Workable vehicle access
- A simple house or cabin is a bonus, not a requirement
- Plantings, forest, water sources and utilities are bonuses
- Not surrounded by dense housing, urban development, major roads or industry

Listings that clearly fail the size test are kept in a separate **Near matches**
group rather than mixed into the ranking.

## What is in the dataset

| | |
|---|---|
| Core matches, 2–5 ha | 18 |
| Near matches, outside 2–5 ha | 10 |
| Provinces covered | Loja, Azuay, Imbabura, Pichincha, Manabí, Esmeraldas, Cotopaxi, Bolívar |
| With a published asking price | 15 |
| Price range of priced listings | $28,000 – $600,000 |

## Honest limits on the research

Read this before trusting any number on the site.

**Every listing is real.** Nothing was invented — not a price, not a feature, not a
coordinate, not an availability claim.

**Prices are last advertised, not confirmed live.** The research environment blocked
direct page fetches, so listing detail was harvested from search-engine result content
rather than by opening each listing page. Re-verify price and availability with the
agent before acting on anything here.

**Links vary in directness, and each one says which kind it is.** Ten properties link
straight to their own listing page. Seven link to an agency's index of properties, where
the entry is one row among several, so the record names the reference number to look for.
Eleven link to a portal's search results, because that is where the property surfaced and
no per-property URL was reachable; portal results rotate, so these may need a filter or
may have gone entirely. The property card labels the link Listing, Agency page or Search
page, and the detail panel spells out what to look for once you are there.

**Coordinates are approximate.** No listing published exact coordinates. Every pin sits
on the named town, valley or sector, and each record says so in its own words. Use the
map to judge a region, never a parcel boundary.

**Unknown means unknown.** Fields the listing did not state are written as "Unknown"
rather than filled with a plausible guess. Where a whole scoring dimension could not be
judged — most often price, because it was not published — the record carries `null`, a
neutral 5 stands in for the overall figure, and the card and detail panel both flag it.

**Verified versus assumed.** Anything stated by the listing or a cited source is tagged
`verified`. Anything inferred from regional geography, satellite-level knowledge of the
area or provincial statistics is tagged `assumed`. The surroundings assessment for every
property separates the two explicitly.

**Safety scores describe areas, not parcels.** A favourable provincial statistic does not
establish that a specific piece of land is safe.

## Scoring

Each property carries five scores from 0 to 10.

| Dimension | Default weight | What it measures |
|---|---|---|
| Nature & privacy | 30% | Remoteness, dominance of forest and agriculture around it, distance to neighbours, main roads, dense settlement and commercial development |
| Price / value | 25% | Price per hectare against regional comparables, adjusted for what is included |
| Safety | 20% | Provincial and cantonal violence levels, travel-advisory status, isolation risk |
| Accessibility | 15% | Road surface, 4×4 need, distance to a useful town, travel time to a city with an airport |
| Utilities / infrastructure | 10% | Electricity, water supply and rights, existing buildings, access-road standard |

Nature & privacy uses the requested band definitions: 10 is highly natural and isolated
with minimal nearby development, 7–9 predominantly natural with limited development,
4–6 mixed rural and developed, 1–3 substantial nearby development, 0 essentially urban.

The overall score is the weighted mean. Move any weight slider and the ranking, the map
markers and the dashboard all recalculate immediately. Raw weights do not have to sum to
100 — they are normalised, and the panel tells you what they normalise to.

## Using the tool

- **Dashboard** across the top: properties found, median price, median price per hectare,
  best value and best nature score, all recomputed from whatever survives your filters.
- **Map** in the centre, satellite by default, with terrain and dark-street layers. Marker
  colour and size both track the overall score. A dashed outline marks a near match.
  Clicking a marker opens a property card.
- **Filters** on the left: price floor and ceiling, area range, price-per-hectare cap,
  minimum overall, nature, safety and accessibility scores, existing house, electricity,
  water, river/stream/spring, province, plus toggles for unpriced listings and near
  matches. Everything updates the map and the ranking as you drag.
- **Ranking** on the right, best match first. Click a card to fly the map to it and open
  the full research record: every field gathered, the surroundings assessment with its
  verified and assumed parts separated, and a score breakdown with the reasoning behind
  each number.

## Before you buy anything in Ecuador

Foreigners hold the same property rights as Ecuadorians, with one restriction that
matters directly here: **land within 50 km of the Peruvian or Colombian border sits in a
military security zone and needs special permission.** Several of the strongest listings
sit in southern Loja near Yangana. Check that line before doing anything else with them.

On safety, the national picture moved sharply in both directions recently: the homicide
rate hit a record 50.9 per 100,000 in 2025, then fell roughly 11% through 2026. The
violence is heavily concentrated — Guayas, Manabí, El Oro, Los Ríos and Esmeraldas
account for around 88% of murders, while Azuay, Loja, Imbabura, Cañar, Tungurahua and
Napo sit far below the national average. The US advisory holds Ecuador at Level 2 overall,
with Do-Not-Travel zones covering parts of Guayaquil, Durán, Quevedo, Huaquillas and
Arenillas, and Esmeraldas city and everything north of it.

## Files

```
index.html                    page structure, dashboard, filter controls
assets/styles.css             all styling
assets/app.js                 scoring, filtering, ranking, map, detail panel
assets/vendor/leaflet/        Leaflet 1.9.4, vendored (BSD-2-Clause)
data/properties.js            the research dataset, with methodology notes at the top
```

`data/properties.js` is the substance of this project. It is plain JavaScript with one
object per property and heavy inline commentary about what is verified and what is not.
Edit it to add listings; the site picks up changes on reload with no build step.
