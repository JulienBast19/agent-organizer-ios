/* -------------------------------------------------------------------------
   Ecuador Rural Land Explorer — research dataset
   -------------------------------------------------------------------------
   Every record below comes from a real, publicly advertised listing found via
   web search in September 2026. Nothing here is invented.

   IMPORTANT LIMITATIONS, STATED UP FRONT:
   - The research environment blocked direct page fetches, so listing detail
     was harvested from search-engine result content rather than by opening
     each page. Treat price and availability as "last advertised", not
     "confirmed live today". Re-verify before acting on any of it.
   - No listing published exact coordinates. Every lat/lng below is an
     APPROXIMATE placement at the named town, valley or sector, so the marker
     shows the area, not the parcel boundary. `coordPrecision` says so on
     every record.
   - Fields that the listing did not state are "Unknown". They are never
     filled with a guess.
   - `verified` = stated in the listing or a cited source.
     `assumed`  = inferred from geography, satellite/terrain knowledge of the
                  area, or regional statistics. Always labelled as such.
   ------------------------------------------------------------------------- */

window.RESEARCH_META = {
  compiled: "2026-09-09",
  method:
    "Multi-query web search across Ecuadorian portals (Plusvalía, BienesOnLine, Mitula, " +
    "Trovit, iCasas, FazWaz, MercadoLibre EC, Doomos, ArriendaYVende) and expat-facing " +
    "agencies (MLS-Ecuador/Propertyshelf, Abundant Living, InstaCasa, Mandango, Huilco, " +
    "Tierras Realty, LatinCarib, Viviun).",
  fetchLimitation:
    "Direct page fetching was blocked by the network policy in this environment. Listing " +
    "details were read out of search-result content. Prices and availability must be " +
    "re-verified with the agent before any decision.",
  legalNote:
    "Foreigners hold the same ownership rights as Ecuadorians, but land within 50 km of " +
    "the Peruvian or Colombian border sits in a military security zone and needs special " +
    "permission. Southern Loja and Zamora-Chinchipe properties should be checked against " +
    "that line before anything else.",
  safetyNote:
    "Ecuador's homicide rate hit a record 50.9 per 100,000 in 2025, then fell about 11% " +
    "through 2026. Violence is heavily concentrated: five coastal provinces (Guayas, " +
    "Manabí, El Oro, Los Ríos, Esmeraldas) account for roughly 88% of murders. Azuay, " +
    "Loja, Imbabura, Tungurahua, Cañar and Napo sit far below the national average. " +
    "The US advisory holds Ecuador at Level 2 overall, with Do-Not-Travel zones in " +
    "parts of Guayaquil, Durán, Quevedo, Huaquillas/Arenillas and Esmeraldas city " +
    "and north. Regional statistics never establish that one specific parcel is safe."
};

window.SCORING_NOTES = {
  value:
    "Price per hectare against what comparable rural land in that region is advertised " +
    "for, adjusted for what is included (house, water rights, plantings). Listings with " +
    "no published price are left unrated rather than guessed.",
  safety:
    "Provincial and cantonal violence levels, travel-advisory status, and isolation risk " +
    "for a foreign owner living on remote land. Never a statement about the parcel itself.",
  accessibility:
    "Road surface, likely 4x4 need, distance to a useful town, and travel time to a city " +
    "with an airport.",
  nature:
    "Remoteness, dominance of forest/agriculture in the surroundings, and how close the " +
    "parcel sits to neighbours, main roads, dense settlement or commercial development.",
  utilities:
    "Electricity, water supply and rights, any existing building, and access-road standard."
};

window.PROPERTIES = [

/* ===================== CORE MATCHES: 2–5 ha ===================== */

{
  id: "yangana-fruit-forest",
  category: "match",
  name: "Yangana Fruit Forest — 2.8 ha",
  price: 105000,
  areaHa: 2.8,
  province: "Loja",
  nearestTown: "Yangana",
  lat: -4.3603, lng: -79.1739,
  coordPrecision: "Approximate — Yangana town centre. Parcel is 14 km along the highway from Vilcabamba; exact plot not published.",
  source: "https://realestate.instacasa.biz/100k-to-150k/",
  sourceName: "InstaCasa Real Estate (ref P0041)",
  sourceKind: "index",
  sourceNote:
    "Agency index page, not a per-property page. Find ref P0041 in the $100K-$150K band.",
  description:
    "2.8 hectares described by the agent as an idyllic mature fruit forest with year-round " +
    "water running through it, 14 km by highway from downtown Vilcabamba. Sits in the upper " +
    "Vilcabamba valley on the approach to Podocarpus National Park.",
  access: "On the paved Vilcabamba–Yangana highway corridor, 14 km from Vilcabamba. Final approach track not described.",
  fourByFour: "Unlikely to be required for the highway leg; final access Unknown",
  electricity: "unknown",
  electricityNote: "Not stated. Grid runs along the Yangana highway, so a connection is plausible, but this is an assumption.",
  water: "yes",
  waterNote: "Year-round water running through the property (stated in listing).",
  house: "no",
  houseNote: "No building mentioned.",
  plantings: "Mature fruit forest (verified in listing).",
  forest: "Fruit forest plus surrounding valley woodland (partly assumed).",
  waterFeature: "Year-round watercourse crossing the land (verified).",
  distTown: "Yangana village a few minutes; Vilcabamba 14 km, roughly 20 minutes.",
  distCity: "Loja city and Ciudad de Catamayo airport approx. 60–75 km, about 1.5–2 hours.",
  surroundings:
    "ASSUMED from regional knowledge: the Yangana valley is thinly settled smallholder " +
    "country, forest and pasture, backed by the Podocarpus range. Houses are strung along " +
    "the highway rather than clustered, so highway-adjacent parcels have some passing " +
    "traffic while land set back is quiet. VERIFIED: 14 km from the nearest real town.",
  scores: { value: 5, safety: 8, accessibility: 7, nature: 8, utilities: 5 },
  scoreNotes: {
    value: "$37,500/ha is mid-to-high for rural Loja, but a mature fruit forest and year-round water are real assets.",
    safety: "Loja is one of Ecuador's calmest provinces and carries no travel-advisory zone. Check the 50 km border rule for Yangana.",
    accessibility: "Paved highway corridor, sensible distance to Vilcabamba, but two hours from an airport.",
    nature: "Upper valley near a national park, low settlement density. Highway proximity is the one caveat.",
    utilities: "Water is confirmed; power, road standard and buildings are all unstated."
  }
},

{
  id: "sacapo-mountain-river",
  category: "match",
  name: "Sacapo Mountain & River Land — 3.8 ha",
  price: 90000,
  areaHa: 3.8,
  province: "Loja",
  nearestTown: "San Pedro de Vilcabamba",
  lat: -4.2200, lng: -79.1950,
  coordPrecision: "Approximate — Sacapo sector, San Pedro valley. Exact plot not published.",
  source: "https://realestate.instacasa.biz/50k-100k/",
  sourceName: "InstaCasa Real Estate (ref P0045)",
  sourceKind: "index",
  sourceNote:
    "Agency index page, not a per-property page. Find ref P0045 in the $50K-$100K band.",
  description:
    "3.8 hectares in the Sacapo sector of the San Pedro valley, marketed as 'where mountain " +
    "views meet stunning river' and described by the agent as unique, tranquil and very " +
    "private mountainside. About a 10 minute drive from downtown Vilcabamba. The vendor " +
    "lives nearby.",
  access: "Roughly 10 minutes' drive from Vilcabamba via the San Pedro / Sacapo road. Surface not stated.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "yes",
  waterNote: "River frontage stated; rights and potable supply not described.",
  house: "no",
  houseNote: "No building mentioned.",
  plantings: "Unknown",
  forest: "ASSUMED: mountainside scrub and woodland typical of the San Pedro valley slopes.",
  waterFeature: "River (verified in listing).",
  distTown: "Vilcabamba approx. 10 minutes by car.",
  distCity: "Loja approx. 45–60 minutes; Catamayo airport approx. 1.5 hours.",
  surroundings:
    "VERIFIED: agent describes it as very private mountainside. ASSUMED: the San Pedro " +
    "valley is farmland and scattered fincas rather than dense housing, with settlement " +
    "concentrated in the valley floor near San Pedro village; mountainside parcels above " +
    "the road are noticeably more isolated than valley-bottom ones.",
  scores: { value: 7, safety: 8, accessibility: 7, nature: 8, utilities: 4 },
  scoreNotes: {
    value: "$23,684/ha with river frontage is good for the Vilcabamba area, where flat land runs far higher.",
    safety: "Loja province, close enough to Vilcabamba's established foreign community to have neighbours who notice.",
    accessibility: "Ten minutes to a town with services; road surface unconfirmed.",
    nature: "Private mountainside with a river, backed by slopes rather than settlement.",
    utilities: "Nothing but the river is confirmed. Assume you are building services from scratch."
  }
},

{
  id: "huilco-sacapo-25",
  category: "match",
  name: "Sacapo Finca with Services — 2.5 ha",
  price: 110000,
  areaHa: 2.5,
  province: "Loja",
  nearestTown: "San Pedro de Vilcabamba",
  lat: -4.2180, lng: -79.1980,
  coordPrecision: "Approximate — Sacapo sector, San Pedro valley.",
  source: "https://huilcorealestate.com/properties/2-5-hectares-sacapo-area-vilcabamba/",
  sourceName: "Huilco Real Estate",
  sourceKind: "listing",
  description:
    "2.5 hectare finca in the Sacapo area near Vilcabamba, listed with electricity, mountain " +
    "spring water and separate irrigation water already in place. The most service-ready " +
    "small parcel found in the Vilcabamba valley.",
  access: "Sacapo sector road from the Vilcabamba–San Pedro route. Surface not stated.",
  fourByFour: "Unknown",
  electricity: "yes",
  electricityNote: "Electricity listed among the property's utilities (verified in listing).",
  water: "yes",
  waterNote: "Mountain spring water plus irrigation water rights (verified in listing).",
  house: "unknown",
  houseNote: "No building described in the summary.",
  plantings: "Unknown",
  forest: "ASSUMED: valley-side vegetation; not described.",
  waterFeature: "Mountain spring source (verified).",
  distTown: "Vilcabamba approx. 10–15 minutes.",
  distCity: "Loja approx. 1 hour; Catamayo airport approx. 1.5 hours.",
  surroundings:
    "ASSUMED: Sacapo is a working smallholding sector, so expect scattered neighbouring " +
    "fincas rather than isolation. Nothing industrial or urban within reach. VERIFIED: " +
    "utilities already present implies the parcel is on a serviced lane, which usually " +
    "means neighbours are not far.",
  scores: { value: 4, safety: 8, accessibility: 7, nature: 7, utilities: 8 },
  scoreNotes: {
    value: "$44,000/ha is expensive per hectare, though power and two water sources carry real cost savings.",
    safety: "Same low-crime Loja profile, with the added comfort of a serviced, populated sector.",
    accessibility: "Close to Vilcabamba; road standard unconfirmed.",
    nature: "Attractive valley setting, but a serviced lane means neighbours nearby.",
    utilities: "The strongest utilities profile in the dataset: grid power, spring water and irrigation rights."
  }
},

{
  id: "mandango-5ha-vilcabamba",
  category: "match",
  name: "Vilcabamba Riverside Flat — 5 ha",
  price: null,
  areaHa: 5.0,
  province: "Loja",
  nearestTown: "Vilcabamba",
  lat: -4.2560, lng: -79.2100,
  coordPrecision: "Approximate — within 10 minutes of Vilcabamba centre; sector not named in the listing summary.",
  source: "https://mandangorealestate.com/property/5-hectare-property-in-vilcabamba-just-10-minutes-from-downtown/",
  sourceName: "Mandango Real Estate",
  sourceKind: "listing",
  description:
    "5 hectares split by the road: 2 hectares above it, semi-flat with slight slopes and " +
    "good house sites, and 3 hectares along the river that are completely flat with several " +
    "building spaces. Water rights from a mountain spring, an irrigation canal crossing " +
    "three hectares, electricity already available, and soil described as fertile for " +
    "vegetables and fruit.",
  access: "Well-maintained paved road, explicitly no 4x4 needed, 10 minutes from downtown Vilcabamba (verified in listing).",
  fourByFour: "No (stated in listing)",
  electricity: "yes",
  electricityNote: "Electricity already available (verified in listing).",
  water: "yes",
  waterNote: "Mountain spring water rights, easy potable connection, plus an irrigation canal across 3 ha (verified).",
  house: "no",
  houseNote: "Building sites described, no existing house mentioned.",
  plantings: "Fertile soil described as suited to vegetables and fruit; no established orchard mentioned.",
  forest: "Unknown — described as semi-flat and flat land, not forest.",
  waterFeature: "River along the lower three hectares, plus an irrigation canal and spring (verified).",
  distTown: "Vilcabamba 10 minutes by paved road.",
  distCity: "Loja approx. 45–60 minutes; Catamayo airport approx. 1.5 hours.",
  surroundings:
    "VERIFIED: the road bisects the property, which caps how private it can be. ASSUMED: " +
    "land this close to Vilcabamba on a paved road sits among other fincas and houses; " +
    "this is the least isolated of the Loja options, and the flat riverside strip is the " +
    "kind of land that gets built on nearby.",
  scores: { value: null, safety: 8, accessibility: 9, nature: 6, utilities: 9 },
  scoreNotes: {
    value: "No price published. Left unrated rather than guessed — ask the agent before comparing it to the others.",
    safety: "Close to Vilcabamba town and its established expat community; Loja's violence levels are low.",
    accessibility: "The best access in the set: paved road, explicitly no 4x4, 10 minutes to town.",
    nature: "Genuinely pretty riverside land, but a road through the middle and a near-town location cost it privacy.",
    utilities: "Power, spring water rights, potable connection and an irrigation canal all confirmed."
  }
},

{
  id: "mandango-3ha-riverfront",
  category: "match",
  name: "Vilcabamba Riverfront Estate Land — 3 ha",
  price: 600000,
  areaHa: 3.0,
  province: "Loja",
  nearestTown: "Vilcabamba",
  lat: -4.2600, lng: -79.2180,
  coordPrecision: "Approximate — within 10 minutes of Vilcabamba centre.",
  source: "https://mandangorealestate.com/property/7-4-acres-3-hectares-riverfront-property-vilcabamba/",
  sourceName: "Mandango Real Estate",
  sourceKind: "listing",
  description:
    "3 hectares (7.4 acres) of riverfront land 10 minutes from Vilcabamba, listed with " +
    "electricity, drinking water, river access and an irrigation canal. Priced as a premium " +
    "estate parcel rather than as raw land.",
  access: "10 minutes from Vilcabamba. Road surface not stated but the location implies a maintained route.",
  fourByFour: "Unknown, probably not required",
  electricity: "yes",
  electricityNote: "Listed among utilities (verified).",
  water: "yes",
  waterNote: "Drinking water and irrigation canal (verified).",
  house: "unknown",
  houseNote: "Not described in the listing summary.",
  plantings: "Unknown",
  forest: "Unknown",
  waterFeature: "River frontage and irrigation canal (verified).",
  distTown: "Vilcabamba 10 minutes.",
  distCity: "Loja approx. 1 hour; Catamayo airport approx. 1.5 hours.",
  surroundings:
    "ASSUMED: premium riverfront near Vilcabamba is exactly the land that attracts " +
    "neighbouring development, so expect houses within sight. Nothing industrial nearby.",
  scores: { value: 1, safety: 8, accessibility: 9, nature: 6, utilities: 9 },
  scoreNotes: {
    value: "$200,000/ha is roughly eight times the going rate for comparable Loja acreage. Included only for completeness.",
    safety: "Low-crime province, near town.",
    accessibility: "Excellent — minutes from Vilcabamba services.",
    nature: "River frontage is genuine, isolation is not.",
    utilities: "Fully serviced."
  }
},

{
  id: "chinguilimaca-la-cria",
  category: "match",
  name: "Chinguilimaca / La Cría Spring-Fed Finca — approx. 3.5 ha",
  price: null,
  areaHa: 3.5,
  province: "Loja",
  nearestTown: "Malacatos (30 min)",
  lat: -4.3000, lng: -79.3500,
  coordPrecision: "Approximate and low confidence — placed between Malacatos and Gonzanamá from the listing's travel times. 'La Cría' is a hamlet, not a mapped town.",
  source: "https://www.abecuador.com/land-for-sale-chinguilimaca",
  sourceName: "Abundant Living Ecuador",
  sourceKind: "listing",
  description:
    "About 3.5 hectares (nearly 9 acres) in a remote, rural, warm area the agent calls " +
    "'La Cría'. Plenty of flat land, unlimited water piped in from a pure local spring, " +
    "rich productive soil and long views. A small rustic but liveable house gives you " +
    "somewhere to stay while you build. Currently growing papaya, citrus and sugar cane.",
  access: "About 30 minutes to Malacatos and an hour to Gonzanamá. Road surface not stated; the 'remote' framing suggests unpaved sections.",
  fourByFour: "Unknown — likely advisable given the remote framing",
  electricity: "unknown",
  electricityNote: "Not stated. A liveable house exists, which hints at some supply, but that is an assumption.",
  water: "yes",
  waterNote: "Unlimited piped spring water (verified in listing).",
  house: "yes",
  houseNote: "Small rustic house, liveable, suitable as a temporary dwelling (verified).",
  plantings: "Papaya, extensive citrus, sugar cane and more (verified).",
  forest: "Unknown — described as productive land with flat sections.",
  waterFeature: "Local spring feeding the piped supply (verified).",
  distTown: "Malacatos approx. 30 minutes; Gonzanamá approx. 1 hour.",
  distCity: "Loja approx. 1.5 hours; Catamayo airport approx. 2 hours.",
  surroundings:
    "VERIFIED: the agent's own description is 'remote, rural'. ASSUMED: the country between " +
    "Malacatos and Gonzanamá is dry-warm smallholder land with very sparse settlement and " +
    "no commercial development. This is likely one of the most private parcels here, at " +
    "the cost of a long drive to anything.",
  scores: { value: null, safety: 7, accessibility: 5, nature: 9, utilities: 6 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Low-crime province, but genuine remoteness raises isolation risk: slow emergency response, no near neighbours.",
    accessibility: "Half an hour to the nearest small town, 1.5 hours to a city, road quality unconfirmed.",
    nature: "Remote warm valley, working spring, minimal surrounding development. Strongest privacy profile in the set.",
    utilities: "Spring water and a liveable rustic house are real. Power is unconfirmed."
  }
},

{
  id: "malacatos-productive-2ha",
  category: "match",
  name: "Chiquil Productive Hillside — 2 ha",
  price: 160000,
  areaHa: 2.0,
  province: "Loja",
  nearestTown: "Chiquil (30 min from Malacatos)",
  lat: -4.2500, lng: -79.3000,
  coordPrecision: "Approximate and low confidence — Chiquil is a small community roughly 30 minutes from Malacatos; the hamlet is not precisely mapped.",
  source: "https://mls-ecuador.com/en/real-estate/properties-for-sale-rent-loja-vilcabamba/ll2100204",
  sourceName: "MLS-Ecuador ref LL2100204 / Abundant Living Ecuador",
  sourceKind: "listing",
  description:
    "Two hectares in the small community of Chiquil, about 30 minutes from Malacatos. Mostly " +
    "flat and cultivated, nestled on a hill with wide views of the mountains around the valley. " +
    "Fruit trees including mango, avocado and hundreds of bananas; the rest under cassava, " +
    "white carrots and sweet potatoes. Soil described as fertile and almost stone-free. There " +
    "is a flat spot ready to build on, and two tilapia ponds towards the upper part.",
  access: "About 30 minutes from Malacatos. Surface not stated.",
  fourByFour: "Unknown, probably not required",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Two tilapia ponds are on the land, but no irrigation right or potable supply is described.",
  house: "no",
  houseNote: "A flat spot ready for building is described; no existing house.",
  plantings: "Mango, avocado, hundreds of bananas, cassava, white carrots and sweet potatoes (verified).",
  forest: "No — cultivated hillside and flat ground.",
  waterFeature: "Two tilapia ponds towards the upper part of the property (verified).",
  distTown: "Malacatos approx. 30 minutes.",
  distCity: "Loja approx. 45 minutes; Catamayo airport approx. 1.25 hours.",
  surroundings:
    "VERIFIED: sits on a hill in a small community 30 minutes out from Malacatos, with " +
    "mountain views across the valley. ASSUMED: Chiquil is a scattered farming hamlet, so " +
    "expect a handful of working neighbours rather than isolation, and no commercial or " +
    "industrial development anywhere near.",
  scores: { value: 2, safety: 8, accessibility: 6, nature: 6, utilities: 6 },
  scoreNotes: {
    value: "$80,000/ha. Priced as a producing income asset, not as retreat land.",
    safety: "Low-crime province, small farming community rather than an isolated parcel.",
    accessibility: "Half an hour from Malacatos on an unspecified surface, then the paved corridor onward.",
    nature: "Hillside with valley views and no development pressure, but the land itself is farmed rather than wild.",
    utilities: "Two ponds, fertile cultivated ground and a prepared building spot; power and water rights unconfirmed."
  }
},

{
  id: "loja-malacatos-road-5ha",
  category: "match",
  name: "Loja–Malacatos Road Land with Views — 5 ha",
  price: 97999,
  areaHa: 5.0,
  province: "Loja",
  nearestTown: "Malacatos",
  lat: -4.1500, lng: -79.2300,
  coordPrecision: "Approximate — placed on the Loja–Malacatos road corridor between the two towns. Sector not named.",
  source: "https://www.fazwaz.com.ec/en/land-for-sale/ecuador/loja",
  sourceName: "FazWaz Ecuador (Loja land listings)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 5 ha parcel with views at $97,999 negotiable. Results rotate, so it may need a size or price filter.",
  description:
    "5 hectares with views advertised along the Loja–Malacatos road at $97,999, negotiable. " +
    "One of the few parcels at the top of the target size range with a published price.",
  access: "On the paved Loja–Malacatos highway corridor.",
  fourByFour: "No, for the road frontage at least",
  electricity: "unknown",
  electricityNote: "Not stated, though highway frontage makes a grid connection likely. Assumption, not fact.",
  water: "unknown",
  waterNote: "Not stated.",
  house: "unknown",
  houseNote: "Not described.",
  plantings: "Unknown",
  forest: "Unknown",
  waterFeature: "Unknown",
  distTown: "Malacatos and Loja both within roughly 20–30 minutes.",
  distCity: "Loja city approx. 25 minutes; Catamayo airport approx. 1 hour.",
  surroundings:
    "ASSUMED: the road between Loja and Malacatos climbs through open hill country with " +
    "scattered farms. Highway frontage means traffic noise and easy public visibility, " +
    "which cuts directly against the privacy goal even though the wider landscape is rural.",
  scores: { value: 8, safety: 8, accessibility: 8, nature: 5, utilities: 4 },
  scoreNotes: {
    value: "$19,600/ha for five hectares near a provincial capital is well below the Vilcabamba-area rate.",
    safety: "Close to Loja city, low-crime province, not isolated.",
    accessibility: "Highway frontage, closest of any core match to an airport.",
    nature: "Rural setting undercut by sitting on a main road. Verify how far the land runs back from it.",
    utilities: "Nothing confirmed."
  }
},

{
  id: "yunguilla-4ha",
  category: "match",
  name: "Yunguilla Valley Hillside with Water Rights — 4 ha",
  price: 35000,
  areaHa: 4.0,
  province: "Azuay",
  nearestTown: "Santa Isabel / El Ramal",
  lat: -3.2600, lng: -79.3200,
  coordPrecision: "Approximate — placed near El Ramal on the Cuenca–Girón–Pasaje road, per the listing's reference point.",
  source: "https://www.plusvalia.com/venta/terrenos/azuay/santa-isabel/q-yunguilla",
  sourceName: "Plusvalía (Santa Isabel / Yunguilla)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 4 ha parcel with two water rights at $35,000, 10 minutes from El Ramal. Also advertised through ACBIR Azuay.",
  description:
    "4 hectares on the Cuenca–Girón–Pasaje road about 10 minutes from El Ramal: 1 hectare " +
    "of usable flat land and 3 hectares of hillside, with two water rights. Advertised at " +
    "$35,000 with documentation in order, suited to agriculture, nursery or ecotourism.",
  access: "About 10 minutes off the paved Cuenca–Girón–Pasaje trunk road.",
  fourByFour: "Unknown — hillside access may need clearance",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "yes",
  waterNote: "Two water rights included (verified in listing).",
  house: "no",
  houseNote: "None mentioned.",
  plantings: "None specified; marketed for agriculture, nursery or ecotourism.",
  forest: "ASSUMED: three hectares of hillside in the Yunguilla valley are typically dry scrub and secondary growth, not closed forest.",
  waterFeature: "Water rights implied by canal or spring; the source is not described.",
  distTown: "El Ramal approx. 10 minutes; Santa Isabel approx. 20–30 minutes.",
  distCity: "Cuenca approx. 1.5 hours, with an airport in the city.",
  surroundings:
    "ASSUMED: the Yunguilla valley is a warm-climate weekend-house region for Cuenca, so " +
    "development is scattered but real and growing, concentrated along the valley floor " +
    "and the trunk road. Hillside land above the road is markedly quieter. Verify how far " +
    "the parcel sits from the highway before assuming privacy.",
  scores: { value: 9, safety: 8, accessibility: 7, nature: 6, utilities: 6 },
  scoreNotes: {
    value: "$8,750/ha is the strongest value in the dataset, and it includes two water rights.",
    safety: "Azuay records Ecuador's lowest violence levels; Cuenca's homicide rate ran around 1.4 per 100,000 in early 2025 and the province cut homicides by more than half over the year.",
    accessibility: "Ten minutes off a paved trunk road, 1.5 hours to Cuenca and its airport.",
    nature: "Only 1 ha is usable flat land; the rest is hillside. Yunguilla is a popular second-home valley, so surroundings are mixed rural and developed.",
    utilities: "Two water rights confirmed; power unconfirmed."
  }
},

{
  id: "mindo-rio-frontage",
  category: "match",
  name: "Río Mindo Frontage Finca — 2 ha",
  price: 125000,
  areaHa: 2.0,
  province: "Pichincha",
  nearestTown: "Mindo",
  lat: -0.0500, lng: -78.7750,
  coordPrecision: "Approximate — Mindo town; the parcel is stated as 1.5 km from town.",
  source: "https://inmovillasol.ec/inmuebles/terreno-en-mindo/",
  sourceName: "InmovillaSol (agent Mónica Luzuriaga)",
  sourceKind: "listing",
  description:
    "2 hectare finca 1.5 km from Mindo with 200 metres of frontage onto the Río Mindo, " +
    "advertised with spectacular views and marketed for cabins or a small lodge. The listing " +
    "states basic services are present and the price is negotiable.",
  access: "1.5 km from Mindo village, which sits on a paved spur off the Calacalí–La Independencia road.",
  fourByFour: "Unknown, probably not required",
  electricity: "yes",
  electricityNote: "Listing states basic services, water and electricity, are present (verified).",
  water: "yes",
  waterNote: "200 m of river frontage (verified). Potable supply not described.",
  house: "no",
  houseNote: "Marketed as a development site for cabins.",
  plantings: "Unknown",
  forest: "ASSUMED: Mindo sits inside the Chocó Andino cloud forest; riverside parcels there typically carry secondary forest and bamboo.",
  waterFeature: "Río Mindo, 200 m of frontage (verified).",
  distTown: "Mindo 1.5 km, a few minutes.",
  distCity: "Quito approx. 2 to 2.5 hours; Mariscal Sucre airport approx. 2.5–3 hours.",
  surroundings:
    "VERIFIED: only 1.5 km from a tourist village. ASSUMED: Mindo's immediate surroundings " +
    "are cloud forest interspersed with lodges, cabins and small farms. Genuinely beautiful " +
    "and biodiverse, but the near-town belt is actively developing for tourism, and " +
    "neighbouring lodges are a realistic prospect.",
  scores: { value: 3, safety: 7, accessibility: 8, nature: 6, utilities: 6 },
  scoreNotes: {
    value: "$62,500/ha reflects Mindo's tourism premium; nearby land 8 km out has been advertised near $10,000/ha.",
    safety: "Pichincha records more crime than the southern sierra provinces, but Mindo itself is a calm tourism village with steady foreign traffic.",
    accessibility: "Minutes from a village with services, a couple of hours from Quito's airport.",
    nature: "Superb cloud-forest region, but this parcel trades isolation for river frontage next to town.",
    utilities: "River frontage confirmed; everything else assumed from proximity to the village."
  }
},

{
  id: "puerto-quito-3ha-house",
  category: "match",
  name: "Puerto Quito River Finca with House — 3 ha",
  price: null,
  areaHa: 3.0,
  province: "Pichincha",
  nearestTown: "Puerto Quito",
  lat: 0.1200, lng: -79.2650,
  coordPrecision: "Approximate — Puerto Quito town centre; sector not named.",
  source: "https://casas.trovit.com.ec/finca-puerto-quito",
  sourceName: "Trovit Ecuador (Puerto Quito fincas)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 30,000 m2 finca with a 250 m2 four-bedroom house and river frontage.",
  description:
    "30,000 m² finca with fruit trees and a clear-water river, near the main road, with a " +
    "250 m² house of four bedrooms, three bathrooms, living and dining rooms, kitchen, " +
    "four balconies, parking, storage and security. The most substantial existing building " +
    "on any parcel in the target size range.",
  access: "Near the main road through Puerto Quito, on the paved Quito–Esmeraldas lowland corridor.",
  fourByFour: "Unknown, probably not required",
  electricity: "unknown",
  electricityNote: "A 250 m² finished house strongly implies grid power, but the listing does not state it.",
  water: "yes",
  waterNote: "Crystalline river on the property (verified). Potable supply not described.",
  house: "yes",
  houseNote: "250 m² house, 4 bedrooms, 3 bathrooms, balconies, parking, storage (verified).",
  plantings: "Fruit trees (verified).",
  forest: "Unknown — lowland tropical, likely a mix of planted and secondary growth.",
  waterFeature: "Clear-water river on the land (verified).",
  distTown: "Puerto Quito minutes away.",
  distCity: "Quito approx. 2.5–3 hours by the Calacalí road; Santo Domingo approx. 1.5 hours.",
  surroundings:
    "ASSUMED: the Puerto Quito lowlands are working agricultural country — cacao, palm and " +
    "pasture — with settlement strung along the main road. Warm, green and rural, but not " +
    "wilderness, and main-road proximity means traffic. VERIFIED: near the main road, per " +
    "the listing itself.",
  scores: { value: null, safety: 6, accessibility: 7, nature: 6, utilities: 8 },
  scoreNotes: {
    value: "Price not published in a form that can be trusted; area listings ranged wildly. Unrated.",
    safety: "North-west Pichincha lowlands sit between calmer highlands and higher-risk coastal provinces. Moderate.",
    accessibility: "Good road access, but a long drive to Quito and its airport.",
    nature: "Green and riverine, though surrounded by commercial agriculture rather than forest.",
    utilities: "A large finished house with services is a substantial head start."
  }
},

{
  id: "intag-garcia-moreno-5ha",
  category: "match",
  name: "Intag Cloud Forest Parcel, García Moreno — 5 ha",
  price: 28000,
  areaHa: 5.0,
  province: "Imbabura",
  nearestTown: "García Moreno (Intag)",
  lat: 0.2833, lng: -78.6500,
  coordPrecision: "Approximate and low confidence — García Moreno parish, Intag region. The parish is large and the sector is not named.",
  source: "https://casas.trovit.com.ec/terreno-otavalo",
  sourceName: "Trovit Ecuador (Otavalo / Intag listings)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 5 ha parcel in Garcia Moreno parish at $28,000 negotiable. A separate Garcia Moreno listing advertises 5 ha of coffee plus 5 ha of pasture, so confirm which parcel carries this price before relying on the value score.",
  description:
    "5 hectares in the Intag region, García Moreno parish, roughly three hours from Otavalo, " +
    "advertised at $28,000 negotiable. Deep in the Intag cloud-forest valleys west of " +
    "Cotacachi.",
  access: "About three hours from Otavalo on mountain roads. Surface not stated.",
  fourByFour: "Likely advisable — ASSUMED from the Intag road network, not stated in the listing",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Not stated. Intag is water-rich, but this parcel's rights are unconfirmed.",
  house: "no",
  houseNote: "None mentioned.",
  plantings: "Unknown",
  forest: "ASSUMED: García Moreno parish holds extensive primary and secondary cloud forest; nearby listings in Intag advertise 75 ha of natural forest with rivers and waterfalls.",
  waterFeature: "Unknown for this parcel; the region is dense with rivers, streams and waterfalls.",
  distTown: "García Moreno village nearby; Otavalo approx. 3 hours; Cotacachi approx. 2.5 hours.",
  distCity: "Quito approx. 5 hours; Ibarra approx. 3.5 hours.",
  surroundings:
    "ASSUMED: Intag is among the least developed accessible regions in the northern " +
    "highlands — steep cloud forest, scattered smallholdings, tiny villages, no urban " +
    "development. IMPORTANT CAVEAT, VERIFIED from regional reporting: Intag has been the " +
    "site of a long-running and sometimes tense conflict over copper mining concessions " +
    "around Junín and Llurimagua in this same parish. That is a social and land-use risk " +
    "worth investigating specifically before buying here.",
  scores: { value: 9, safety: 7, accessibility: 4, nature: 9, utilities: 3 },
  scoreNotes: {
    value: "$5,600/ha is the lowest in the dataset by a wide margin.",
    safety: "Imbabura's violent-crime levels are low, but the Intag mining dispute creates a different kind of risk: contested land use, protest activity and community friction.",
    accessibility: "Three hours to Otavalo on mountain roads is the weakest access here. Assume 4x4 and slow going in rain.",
    nature: "As natural and unpopulated as anything in this dataset. Cloud forest, rivers, waterfalls, almost no built infrastructure.",
    utilities: "Nothing confirmed. Assume fully off-grid."
  }
},

{
  id: "saraguro-cacao-36",
  category: "match",
  name: "Saraguro Cacao Finca with Spring — 3.6 ha",
  price: null,
  areaHa: 3.6,
  province: "Loja",
  nearestTown: "Saraguro",
  lat: -3.6206, lng: -79.2381,
  coordPrecision: "Approximate — Saraguro town; the listing places the parcel in the wider Saraguro area.",
  source: "https://casas.mitula.ec/casas/terrenos-saraguro",
  sourceName: "Mitula Ecuador (Saraguro listings, agent OWNERS Inmobiliarios)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Agent shown as OWNERS Inmobiliarios Asociados. Look for 3.6 ha with 1 ha of national cacao and a spring.",
  description:
    "3.6 hectares with one hectare planted in national cacao, a water spring inside the " +
    "property boundary, additional fruit trees and easy access.",
  access: "Described as easy access; surface and distance from the paved road not stated.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "yes",
  waterNote: "A spring inside the property boundary (verified in listing).",
  house: "unknown",
  houseNote: "Not described.",
  plantings: "1 ha national cacao plus fruit trees (verified).",
  forest: "Unknown",
  waterFeature: "On-property spring (verified).",
  distTown: "Saraguro nearby; distance not specified.",
  distCity: "Loja approx. 1.5–2 hours; Cuenca approx. 2.5 hours.",
  surroundings:
    "ASSUMED: the Saraguro area is indigenous smallholder farmland with dispersed housing, " +
    "high páramo above and subtropical valleys below. Cacao-growing altitude implies a " +
    "warm valley on the eastern or western flank rather than the cold town plateau. " +
    "Quiet, agricultural, very little commercial development.",
  scores: { value: null, safety: 8, accessibility: 6, nature: 7, utilities: 5 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Loja province, rural indigenous farming community, low violent crime.",
    accessibility: "On the Loja–Cuenca corridor but well off the main tourist routes; hours from either city.",
    nature: "Working agricultural landscape with real natural surroundings, dispersed neighbours.",
    utilities: "An on-property spring and an established cacao planting; power and buildings unconfirmed."
  }
},

{
  id: "guamayacu-bolivar-35",
  category: "match",
  name: "Guamayacu Subtropical Cacao Finca — 3.5 ha",
  price: null,
  areaHa: 3.5,
  province: "Bolívar",
  nearestTown: "San Miguel de Bolívar",
  lat: -1.7000, lng: -79.0500,
  coordPrecision: "Approximate and low confidence — Guamayacu sector, San Miguel de Bolívar canton.",
  source: "https://www.fazwaz.com.ec/terreno-parcela-en-venta/ecuador/bolivar",
  sourceName: "FazWaz Ecuador (Bolívar land listings)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 3.5 ha producing finca in the Guamayacu sector.",
  description:
    "3.5 hectares in production in the Guamayacu sector of Bolívar province, subtropical " +
    "climate, growing cacao and tropical fruit.",
  access: "Not stated.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Not stated.",
  house: "unknown",
  houseNote: "Not described.",
  plantings: "Cacao and tropical fruit in production (verified).",
  forest: "Unknown",
  waterFeature: "Unknown",
  distTown: "San Miguel de Bolívar; distance not specified.",
  distCity: "Guaranda approx. 1 hour; Guayaquil approx. 3–4 hours; Quito approx. 5 hours.",
  surroundings:
    "ASSUMED: the western flank of Bolívar province is a steep, green, thinly populated " +
    "subtropical farming belt with dispersed settlements and very little tourism or " +
    "commercial development. Little published information exists on this specific sector.",
  scores: { value: null, safety: 6, accessibility: 5, nature: 7, utilities: 4 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Bolívar is a quieter interior province, but it borders higher-risk lowland areas and there is little granular data. Moderate, with genuine uncertainty.",
    accessibility: "Off the main corridors; hours from any airport.",
    nature: "Green subtropical farming country, sparse settlement, but forest cover on the parcel is unconfirmed.",
    utilities: "Nothing confirmed beyond the fact that the land is in production."
  }
},

{
  id: "pangua-cotopaxi-21",
  category: "match",
  name: "Pangua Agro-Productive Finca — 2.13 ha",
  price: null,
  areaHa: 2.13,
  province: "Cotopaxi",
  nearestTown: "El Corazón / Moraspungo (Pangua)",
  lat: -1.1500, lng: -79.2000,
  coordPrecision: "Approximate and low confidence — Román Campaña parish, Recinto San Miguel, Pangua canton.",
  source: "https://www.bienesonline.ec/buscar-fincas-de-venta-en-cotopaxi.php",
  sourceName: "BienesOnLine Ecuador (Cotopaxi fincas)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 21,315 m2 agro-productive finca in Recinto San Miguel, Roman Campana parish.",
  description:
    "Agro-productive finca of 21,315 m² in Recinto San Miguel, Román Campaña parish, " +
    "Pangua canton, on the subtropical western slope of Cotopaxi province.",
  access: "Not stated.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Not stated.",
  house: "unknown",
  houseNote: "Not described.",
  plantings: "Described as agro-productive; crops not named.",
  forest: "Unknown",
  waterFeature: "Unknown",
  distTown: "El Corazón and Moraspungo are the canton's towns; distance not specified.",
  distCity: "Quevedo approx. 1.5 hours; Latacunga approx. 3 hours; Quito approx. 4.5 hours.",
  surroundings:
    "ASSUMED: Pangua's subtropical west slope is banana, cacao and pasture country with " +
    "dispersed recintos. Green and rural with essentially no urban development, but the " +
    "landscape is farmed rather than forested, and it sits closer to the higher-crime " +
    "Los Ríos lowlands than the sierra parcels do.",
  scores: { value: null, safety: 6, accessibility: 5, nature: 6, utilities: 3 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Cotopaxi as a whole is moderate, but Pangua sits on the fringe of the Los Ríos lowlands, where violence is far higher. Verify locally.",
    accessibility: "Remote canton, long drives to any city with an airport.",
    nature: "Rural and green, but agricultural rather than wild, and the parcel's own vegetation is undescribed.",
    utilities: "Nothing confirmed."
  }
},

{
  id: "quininde-4ha-cacao",
  category: "match",
  name: "Quinindé Cacao Finca with Two Springs — 4 ha",
  price: null,
  areaHa: 4.0,
  province: "Esmeraldas",
  nearestTown: "Quinindé (Rosa Zárate)",
  lat: 0.3167, lng: -79.4667,
  coordPrecision: "Approximate — Quinindé town centre; sector not named.",
  source: "https://casas.trovit.com.ec/finca-quininde",
  sourceName: "Trovit Ecuador (Quinindé fincas)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for 4 ha of cacao and fruit trees with two springs and a two-bedroom house.",
  description:
    "4 hectares planted with cacao and fruit trees, its own water from two springs, and a " +
    "house of two bedrooms and one full bathroom. Listed in a zone described as touristic " +
    "with main-road access. Comparable Quinindé farmland has been advertised around " +
    "$4,500 per hectare.",
  access: "Main-road access stated; surface not described.",
  fourByFour: "Unknown, probably not required",
  electricity: "unknown",
  electricityNote: "Not stated, though a house on a main road makes a connection likely. Assumption.",
  water: "yes",
  waterNote: "Two springs supplying the property (verified in listing).",
  house: "yes",
  houseNote: "House with 2 bedrooms and 1 full bathroom (verified).",
  plantings: "Cacao and fruit trees (verified).",
  forest: "Unknown",
  waterFeature: "Two springs (verified).",
  distTown: "Quinindé (Rosa Zárate); distance not specified.",
  distCity: "Santo Domingo approx. 1.5 hours; Esmeraldas city approx. 2 hours; Quito approx. 4 hours.",
  surroundings:
    "ASSUMED: the Quinindé basin is intensive African-palm, cacao and pasture country, " +
    "with palm plantations and processing infrastructure common. That is agricultural " +
    "rather than natural surroundings and it cuts against the brief.",
  scores: { value: null, safety: 3, accessibility: 6, nature: 6, utilities: 7 },
  scoreNotes: {
    value: "No price for this specific parcel. Regional comparables near $4,500/ha suggest strong value, but that is a regional figure, not this listing's price.",
    safety: "The main concern in this dataset. Esmeraldas is among the five coastal provinces accounting for roughly 88% of Ecuador's murders, and the US advisory marks Esmeraldas city and everything north of it Do Not Travel. Quinindé sits inland and south of that zone, but the provincial picture is serious.",
    accessibility: "Main-road access and a reasonable run to Santo Domingo.",
    nature: "Green and watered, but surrounded by industrial-scale palm and cacao agriculture.",
    utilities: "Two springs and a small liveable house."
  }
},

{
  id: "pacoche-manta-44",
  category: "match",
  name: "Pacoche Humid Forest Land, El Aromo — 4.4 ha",
  price: 198000,
  areaHa: 4.4,
  province: "Manabí",
  nearestTown: "Manta / El Aromo",
  lat: -1.0500, lng: -80.8000,
  coordPrecision: "Approximate — Pacoche / El Aromo area south-west of Manta.",
  source: "https://casas.trovit.com.ec/finca-manabi",
  sourceName: "Trovit Ecuador (Manabí fincas)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for the 4.4 ha parcel in the Pacoche humid forest at El Aromo.",
  description:
    "4.4 hectares in the humid forest of Pacoche, El Aromo, in Manta canton, advertised at " +
    "$198,000 and marketed as the lungs of Manta. About 25 minutes from Manta, near Playa " +
    "Liguiqui and Playa San Lorenzo. Pacoche is a genuine coastal cloud-forest pocket and a " +
    "designated wildlife refuge area, unusual on Ecuador's dry coast.",
  access: "Off the coastal road south-west of Manta. Surface not stated.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Not stated. Pacoche is fog-fed humid forest; on-site water rights are unconfirmed.",
  house: "unknown",
  houseNote: "Not described.",
  plantings: "Unknown",
  forest: "Humid forest, stated in the listing and consistent with the Pacoche refuge (verified).",
  waterFeature: "Unknown",
  distTown: "Manta approx. 25 minutes (stated in listing).",
  distCity: "Manta has a national airport within roughly 45 minutes.",
  surroundings:
    "VERIFIED: the parcel is in the Pacoche humid forest belt, a protected-area landscape. " +
    "ASSUMED: surroundings are forest and small farms, though the El Aromo corridor has " +
    "seen refinery and infrastructure proposals over the years, and Manta is a large port " +
    "city within an hour. Check the conservation status and any building restrictions " +
    "attaching to land inside or adjoining the refuge.",
  scores: { value: 3, safety: 4, accessibility: 7, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "$45,000/ha is high for Manabí, priced on the rarity of coastal humid forest.",
    safety: "Manabí is one of the five provinces carrying the bulk of Ecuador's homicides. Manta has improved sharply under military governance since June, with a reported 66% fall in intentional homicides, but the baseline is high.",
    accessibility: "Closest of all matches to a commercial airport.",
    nature: "Real cloud forest on the coast, a rare landscape, with a protected refuge adjoining.",
    utilities: "Nothing confirmed; assume off-grid, and confirm what a protected designation permits."
  }
},

{
  id: "spondylus-dry-forest",
  category: "match",
  name: "Ruta del Spondylus Dry Forest Parcels — from 3 ha",
  price: null,
  areaHa: 3.0,
  province: "Manabí",
  nearestTown: "Ruta del Spondylus coast",
  lat: -1.5500, lng: -80.7500,
  coordPrecision: "Approximate and low confidence — the listing describes a 56 ha holding along the Ruta del Spondylus without naming the sector.",
  source: "https://www.viviun.com/ecuador-farms-and-land-for-sale",
  sourceName: "Viviun (Ecuador farms and land)",
  sourceKind: "index",
  sourceNote:
    "Aggregator index page. Look for the 56 ha native dry forest holding sold in parcels from 3 ha.",
  description:
    "A 56 hectare block of native dry tropical forest along the Ruta del Spondylus in " +
    "Manabí, being sold in parcels from 3 hectares upward. Mostly west-facing with Pacific " +
    "Ocean views.",
  access: "Along the coastal Ruta del Spondylus corridor; internal access not described.",
  fourByFour: "Unknown",
  electricity: "unknown",
  electricityNote: "Not stated.",
  water: "unknown",
  waterNote: "Not stated. Dry tropical forest means seasonal water scarcity is a real design constraint.",
  house: "no",
  houseNote: "Raw parcels.",
  plantings: "None — native forest.",
  forest: "Native dry tropical forest (verified in listing).",
  waterFeature: "Unknown; unlikely to be year-round in this ecosystem.",
  distTown: "Not specified; the Ruta del Spondylus strings together Puerto López, Machalilla and Salango.",
  distCity: "Manta airport roughly 1.5–2.5 hours depending on the sector.",
  surroundings:
    "VERIFIED: native dry forest with ocean views. ASSUMED: the coastal strip has scattered " +
    "villages and tourism, but the hills behind it are thinly settled. The parcel's " +
    "position relative to the coast road is the deciding factor for privacy and cannot be " +
    "determined from the listing.",
  scores: { value: null, safety: 4, accessibility: 6, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "Price per parcel not published. Unrated.",
    safety: "Manabí carries a high provincial homicide burden; the small coastal villages are calmer than the cities but the province is not low-risk.",
    accessibility: "Coastal corridor access, a long drive to an airport from most of the route.",
    nature: "Intact native dry forest with ocean views and low surrounding development.",
    utilities: "Raw land, and dry-forest water supply is the key unknown to resolve."
  }
},

/* ===================== NEAR MATCHES (outside 2–5 ha) ===================== */

{
  id: "nm-vilcabamba-17",
  category: "near",
  name: "Vilcabamba Private Mountainside — 1.7 ha",
  price: 95000,
  areaHa: 1.7,
  province: "Loja",
  nearestTown: "Vilcabamba",
  lat: -4.2700, lng: -79.2300,
  coordPrecision: "Approximate — Vilcabamba area; sector not named.",
  source: "https://realestate.instacasa.biz/50k-100k/",
  sourceName: "InstaCasa Real Estate (ref P0031)",
  sourceKind: "index",
  sourceNote:
    "Agency index page. Find ref P0031 in the $50K-$100K band.",
  description:
    "1.7 hectares of mountainside with both flat and ridge building areas, described as " +
    "spectacular views and very private. Just under the 2 ha floor.",
  access: "Not stated.", fourByFour: "Unknown",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "unknown", waterNote: "Not stated.",
  house: "no", houseNote: "Building areas described, no house.",
  plantings: "Unknown", forest: "Unknown",
  waterFeature: "Unknown",
  distTown: "Vilcabamba nearby.", distCity: "Loja approx. 1 hour.",
  surroundings: "VERIFIED: agent describes it as very private with ridge and flat sections. ASSUMED: typical Vilcabamba valley slopes, scattered fincas.",
  scores: { value: 4, safety: 8, accessibility: 7, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "$55,882/ha, and 0.3 ha short of the brief.",
    safety: "Low-crime province near an established expat town.",
    accessibility: "Close to Vilcabamba; road standard unstated.",
    nature: "Private mountainside with ridge views.",
    utilities: "Nothing confirmed."
  }
},

{
  id: "nm-masanamaca-15",
  category: "near",
  name: "Masanamaca Flat Riverfront Orchard — 1.5 ha",
  price: 158000,
  areaHa: 1.5,
  province: "Loja",
  nearestTown: "Masanamaca (13 min from Vilcabamba)",
  lat: -4.3000, lng: -79.2000,
  coordPrecision: "Approximate — Masanamaca sector.",
  source: "https://latincarib.com/real-estate/riverfront-land-close-vilcabamba/",
  sourceName: "LatinCarib",
  sourceKind: "index",
  sourceNote:
    "Agency article listing several Vilcabamba riverfront parcels. Find the 1.5 ha Masanamaca orchard at $158,000.",
  description:
    "1.5 hectares of completely flat land bordered by the Masanamaca River, with more than " +
    "500 mature organically cultivated fruit trees, 13 minutes from Vilcabamba.",
  access: "13 minutes from Vilcabamba on the main southern highway corridor.", fourByFour: "Unknown, probably not required",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "yes", waterNote: "River frontage (verified).",
  house: "no", houseNote: "None mentioned.",
  plantings: "Over 500 mature organically cultivated fruit trees (verified).",
  forest: "Unknown",
  waterFeature: "Masanamaca River frontage (verified).",
  distTown: "Vilcabamba 13 minutes.", distCity: "Loja approx. 1 hour.",
  surroundings: "ASSUMED: Masanamaca is a small roadside settlement in the valley south of Vilcabamba; flat riverside land there sits among other smallholdings.",
  scores: { value: 2, safety: 8, accessibility: 8, nature: 6, utilities: 5 },
  scoreNotes: {
    value: "$105,000/ha. The established organic orchard is the justification, but it is expensive land.",
    safety: "Low-crime province, populated valley.",
    accessibility: "Highway corridor, close to town.",
    nature: "Riverfront and orchard, but flat valley land among neighbours.",
    utilities: "River and mature plantings; services unconfirmed."
  }
},

{
  id: "nm-landangui-08",
  category: "near",
  name: "Landangui Riverfront — 0.8 ha",
  price: 135000,
  areaHa: 0.8,
  province: "Loja",
  nearestTown: "Landangui (10 km from Vilcabamba)",
  lat: -4.2000, lng: -79.2500,
  coordPrecision: "Approximate — Landangui sector.",
  source: "https://realestate.instacasa.biz/100k-to-150k/",
  sourceName: "InstaCasa Real Estate (ref P0044)",
  sourceKind: "index",
  sourceNote:
    "Agency index page. Find ref P0044 in the $100K-$150K band.",
  description: "8,000 m² marketed as 'unique riverfront magic' at Landangui, 10 km from Vilcabamba.",
  access: "10 km from Vilcabamba on the Malacatos corridor.", fourByFour: "Unknown, probably not required",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "yes", waterNote: "Riverfront (verified).",
  house: "unknown", houseNote: "Not described.",
  plantings: "Unknown", forest: "Unknown",
  waterFeature: "River frontage (verified).",
  distTown: "Vilcabamba 10 km.", distCity: "Loja approx. 45 minutes.",
  surroundings: "ASSUMED: Landangui is a valley-floor hamlet on the main road; expect neighbours.",
  scores: { value: 1, safety: 8, accessibility: 8, nature: 5, utilities: 4 },
  scoreNotes: {
    value: "$168,750/ha and far below the size brief.",
    safety: "Low-crime valley.",
    accessibility: "Main corridor.",
    nature: "River is genuine, isolation is not.",
    utilities: "Unconfirmed."
  }
},

{
  id: "nm-san-torum-1",
  category: "near",
  name: "'End of the World' Riverside — 1 ha",
  price: 135000,
  areaHa: 1.0,
  province: "Loja",
  nearestTown: "San Torum (12 km from Vilcabamba)",
  lat: -4.2900, lng: -79.2000,
  coordPrecision: "Approximate and low confidence — 'San Torum' is not a standard mapped place name; placed 12 km from Vilcabamba per the listing.",
  source: "https://realestate.instacasa.biz/100k-to-150k/",
  sourceName: "InstaCasa Real Estate (ref P0033)",
  sourceKind: "index",
  sourceNote:
    "Agency index page. Find ref P0033 in the $100K-$150K band.",
  description: "One hectare riverside parcel marketed as the 'End of the World Property', 12 km from Vilcabamba centre.",
  access: "12 km from Vilcabamba. Surface not stated.", fourByFour: "Unknown",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "yes", waterNote: "Riverside (verified).",
  house: "unknown", houseNote: "Not described.",
  plantings: "Unknown", forest: "Unknown",
  waterFeature: "River (verified).",
  distTown: "Vilcabamba 12 km.", distCity: "Loja approx. 1 hour.",
  surroundings: "VERIFIED: the marketing name implies a road-end position. ASSUMED: high privacy, low development.",
  scores: { value: 1, safety: 7, accessibility: 6, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "$135,000/ha for a single hectare.",
    safety: "Low-crime province; a road-end location raises isolation risk.",
    accessibility: "12 km on unspecified roads.",
    nature: "Road-end riverside land should be quiet and private.",
    utilities: "Unconfirmed."
  }
},

{
  id: "nm-yangana-offgrid-6",
  category: "near",
  name: "Yangana Off-Grid Riverfront & Stream — 6 ha",
  price: null,
  areaHa: 6.0,
  province: "Loja",
  nearestTown: "Yangana",
  lat: -4.3650, lng: -79.1800,
  coordPrecision: "Approximate — Yangana area, mountains above the village.",
  source: "https://mls-ecuador.com/en/real-estate/properties-for-sale-rent-loja-vilcabamba/ll2200008",
  sourceName: "MLS-Ecuador (ref LL2200008)",
  sourceKind: "listing",
  description:
    "6 hectares in the mountains of Yangana with fruit trees, flat building areas, a clean " +
    "water stream and river frontage. Marketed explicitly for off-grid living.",
  access: "Not stated; the off-grid framing implies rough access.", fourByFour: "Likely — ASSUMED",
  electricity: "no", electricityNote: "Marketed as off-grid land (verified framing).",
  water: "yes", waterNote: "Clean-water stream and river frontage (verified).",
  house: "no", houseNote: "Flat building areas described.",
  plantings: "Fruit trees (verified).",
  forest: "ASSUMED: mountain vegetation on the Podocarpus flank.",
  waterFeature: "Stream and river (verified).",
  distTown: "Yangana village; Vilcabamba approx. 20 minutes beyond.",
  distCity: "Loja approx. 1.5–2 hours.",
  surroundings: "VERIFIED: mountains above Yangana, marketed as off-grid. ASSUMED: very low settlement density, forest and pasture.",
  scores: { value: null, safety: 7, accessibility: 5, nature: 9, utilities: 4 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Low-crime province; off-grid isolation is the real risk factor. Check the 50 km border zone.",
    accessibility: "Mountain access above Yangana, likely rough.",
    nature: "Off-grid mountain land with two water sources and fruit trees. Excellent on the brief apart from size.",
    utilities: "Water and plantings yes, power explicitly not."
  }
},

{
  id: "nm-yangana-64",
  category: "near",
  name: "Yangana Hillside — 6.4 ha",
  price: null,
  areaHa: 6.4,
  province: "Loja",
  nearestTown: "Yangana",
  lat: -4.3550, lng: -79.1700,
  coordPrecision: "Approximate — Yangana parish.",
  source: "https://mandangorealestate.com/property/property-for-sale-in-yangana-loja-6-4-hectares-15-8-acres/",
  sourceName: "Mandango Real Estate",
  sourceKind: "listing",
  description: "6.4 hectares (15.8 acres) in Yangana parish, Loja.",
  access: "Not stated.", fourByFour: "Unknown",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "unknown", waterNote: "Not stated.",
  house: "unknown", houseNote: "Not described.",
  plantings: "Unknown", forest: "Unknown", waterFeature: "Unknown",
  distTown: "Yangana village.", distCity: "Loja approx. 1.5–2 hours.",
  surroundings: "ASSUMED: sparsely settled Yangana valley, forest and pasture on the Podocarpus flank.",
  scores: { value: null, safety: 7, accessibility: 6, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "No price in the listing summary. Unrated.",
    safety: "Low-crime province, remote parish.",
    accessibility: "Yangana is on the paved highway; parcel access unconfirmed.",
    nature: "Attractive, thinly settled upper valley.",
    utilities: "Nothing confirmed."
  }
},

{
  id: "nm-quinara-634",
  category: "near",
  name: "Quinara Off-Grid Farm with Micro-Hydro — 6.34 ha",
  price: null,
  areaHa: 6.34,
  province: "Loja",
  nearestTown: "Quinara",
  lat: -4.3167, lng: -79.2333,
  coordPrecision: "Approximate — outside Quinara village.",
  source: "https://mls-ecuador.com/en/land-listings/ll1700076",
  sourceName: "MLS-Ecuador ref LL1700076",
  sourceKind: "listing",
  description:
    "6.34 hectares outside Quinara, about 25 minutes from Vilcabamba, with a pure river " +
    "running the length of the land and no flood risk, pure drinking water, a small rustic " +
    "house, hundreds of mature heritage fruit trees and a working micro-hydro plant sized " +
    "for even a large home. Listed as Neverland Farm, land the Palta once used for ritual.",
  access: "Not stated.", fourByFour: "Unknown",
  electricity: "yes", electricityNote: "Functioning micro-hydro plant on the property (verified in listing).",
  water: "yes", waterNote: "Pure drinking water and a river along the full length of the land (verified).",
  house: "yes", houseNote: "Small rustic house on the land (verified in listing).",
  plantings: "Hundreds of mature heritage fruit trees (verified).",
  forest: "Unknown",
  waterFeature: "River running the length of the property (verified).",
  distTown: "Quinara village; Vilcabamba approx. 25 minutes.",
  distCity: "Loja approx. 1.5 hours.",
  surroundings: "ASSUMED: Quinara is a small, quiet valley settlement south of Vilcabamba with low development.",
  scores: { value: null, safety: 7, accessibility: 6, nature: 8, utilities: 9 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Low-crime province, small rural village.",
    accessibility: "About 25 minutes from Vilcabamba; parcel road unconfirmed.",
    nature: "A river along the entire length of the land, a mature orchard and a quiet valley.",
    utilities: "A working micro-hydro plant plus drinking water is the best infrastructure found anywhere in this research."
  }
},

{
  id: "nm-mindo-8ha",
  category: "near",
  name: "Mindo Area Cloud Forest — 8 ha",
  price: 80000,
  areaHa: 8.0,
  province: "Pichincha",
  nearestTown: "Mindo",
  lat: -0.0400, lng: -78.8000,
  coordPrecision: "Approximate — Mindo tourist zone; sector not named.",
  source: "https://casas.mitula.ec/casas/terrenos-mindo",
  sourceName: "Mitula Ecuador (Mindo land listings)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for 8 ha in the Mindo tourist zone at $10,000 per hectare.",
  description: "8 hectares in the Mindo tourist zone advertised at $10,000 per hectare, $80,000 total.",
  access: "Mindo area; not further specified.", fourByFour: "Unknown",
  electricity: "unknown", electricityNote: "Not stated.",
  water: "unknown", waterNote: "Not stated.",
  house: "unknown", houseNote: "Not described.",
  plantings: "Unknown",
  forest: "ASSUMED: Chocó Andino cloud forest, the dominant cover around Mindo.",
  waterFeature: "Unknown",
  distTown: "Mindo nearby.", distCity: "Quito approx. 2–2.5 hours.",
  surroundings: "ASSUMED: cloud forest with scattered lodges and smallholdings; quieter the further from the village.",
  scores: { value: 8, safety: 7, accessibility: 7, nature: 8, utilities: 3 },
  scoreNotes: {
    value: "$10,000/ha in the Mindo zone is a sixth of the near-town riverfront rate.",
    safety: "Calm tourism village in a province with higher overall crime.",
    accessibility: "Reasonable, though the sector is unnamed.",
    nature: "Cloud forest, low development away from the village core.",
    utilities: "Nothing confirmed."
  }
},

{
  id: "nm-nangulvi-75",
  category: "near",
  name: "Nangulví Riverside Project Land — 7.5 ha",
  price: null,
  areaHa: 7.5,
  province: "Imbabura",
  nearestTown: "Nangulví (Intag)",
  lat: 0.3667, lng: -78.5333,
  coordPrecision: "Approximate — Nangulví, on the Río Intag.",
  source: "https://casas.trovit.com.ec/finca-imbabura",
  sourceName: "Trovit Ecuador (Imbabura fincas)",
  sourceKind: "search",
  sourceNote:
    "Portal search results, not a per-property page. Look for 7.5 ha with an unfinished tourism project by the Rio Intag near Nangulvi.",
  description:
    "7.5 hectares in Intag with an unfinished tourism project, near Nangulví and its hot " +
    "springs, on the edge of the Río Intag.",
  access: "Intag valley roads from Otavalo/Cotacachi.", fourByFour: "Likely advisable — ASSUMED",
  electricity: "unknown", electricityNote: "Not stated; an unfinished project implies some infrastructure but this is an assumption.",
  water: "yes", waterNote: "On the edge of the Río Intag (verified).",
  house: "yes", houseNote: "Unfinished tourism project structures (verified, condition unknown).",
  plantings: "Unknown",
  forest: "ASSUMED: Intag subtropical valley vegetation.",
  waterFeature: "Río Intag frontage (verified).",
  distTown: "Nangulví nearby; Otavalo approx. 2–2.5 hours.",
  distCity: "Quito approx. 4 hours.",
  surroundings: "ASSUMED: the Nangulví stretch of the Intag valley has more visitor traffic than the rest of Intag because of the hot springs. Still deeply rural. The same regional mining conflict caveat applies.",
  scores: { value: null, safety: 7, accessibility: 5, nature: 8, utilities: 5 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Low provincial violence; the Intag mining dispute is the relevant local risk.",
    accessibility: "Hours of mountain road from Otavalo.",
    nature: "Riverside subtropical valley with very little development.",
    utilities: "Unfinished structures of unknown condition, river frontage."
  }
},

{
  id: "nm-chontal-8ha",
  category: "near",
  name: "La Magdalena / Chontal Two-River Finca — 8 ha",
  price: null,
  areaHa: 8.0,
  province: "Imbabura",
  nearestTown: "Chontal (Cotacachi)",
  lat: 0.2000, lng: -78.7500,
  coordPrecision: "Approximate — La Magdalena / Chontal sector on the Río Guayllabamba.",
  source: "https://www.buscocasita.com/vendo-finca-en-intag-cotacachi-imbabura_52041.html",
  sourceName: "BuscoCasita Ecuador",
  sourceKind: "listing",
  description:
    "8 hectares at La Magdalena, Chontal, with two houses: 4 ha flat, 2 ha semi-flat and " +
    "2 ha of hillside carrying virgin forest. Fronts the Río Guayllabamba and is flanked " +
    "by the Río Verde, with abundant irrigation water. Producing plantain, coffee, citrus, " +
    "guava, cacao, papaya, borojó, avocado and ornamentals.",
  access: "Intag/Chontal valley roads.", fourByFour: "Likely advisable — ASSUMED",
  electricity: "unknown", electricityNote: "Two houses imply supply, but the listing does not state it.",
  water: "yes", waterNote: "Two river frontages plus abundant irrigation water (verified).",
  house: "yes", houseNote: "Two houses (verified; condition not described).",
  plantings: "Plantain, coffee, citrus, guava, cacao, papaya, borojó, avocado, ornamentals (verified).",
  forest: "2 hectares of virgin forest on the hillside (verified in listing).",
  waterFeature: "Río Guayllabamba frontage and Río Verde on the flank (verified).",
  distTown: "Chontal; Otavalo several hours.",
  distCity: "Quito approx. 3–4 hours.",
  surroundings: "ASSUMED: the lower Guayllabamba valley is hot, green and thinly settled, with farms along the river and forest on the slopes.",
  scores: { value: null, safety: 6, accessibility: 5, nature: 8, utilities: 7 },
  scoreNotes: {
    value: "No price published. Unrated.",
    safety: "Rural Imbabura, low violent crime, but a remote river valley with slow emergency access.",
    accessibility: "Long drives on valley roads.",
    nature: "Two rivers, virgin forest, an established food forest and almost no neighbours.",
    utilities: "Two houses, irrigation water and two rivers. Power unconfirmed."
  }
}

];
