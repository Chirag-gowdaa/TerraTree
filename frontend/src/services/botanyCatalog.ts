import { BotanicalDiagnosticProfile } from '../types';

export const BOTANY_CATALOG: Record<string, BotanicalDiagnosticProfile> = {
  combretaceae: {
    family_name: "Combretaceae",
    common_name: "White Combretum & Terminalia Family",
    representative_taxa: [
      "Terminalia tomentosa (Asna / Crocodile Bark Tree)",
      "Terminalia arjuna (Arjun)",
      "Terminalia bellirica (Bahera)",
      "Anogeissus latifolia (Dhaora)"
    ],
    leaf_morphology: "Simple, alternate or sub-opposite, elliptic-oblong with prominent lateral veins extending to margin; distinct foliar glands at petiole apex.",
    bark_stem_anatomy: "Distinctive deeply fissured tessellated bark resembling 'crocodile skin'; thick outer rhytidome providing fire resilience and drought protection.",
    ecological_keystone_role: "Dominant upper canopy emergent in Western Ghats moist deciduous forests; prime carbon storehouse, nesting site for Great Indian Hornbill.",
    ethnobotany_timber: "High-density structural timber resistant to termites; high tannin concentration historically used in herbal cardio-tonics (Arjuna) and natural dyeing.",
    conservation_status: "Vulnerable to selective logging; core indicator of high-canopy climax moist deciduous formations.",
    image_url: "/botany/combretaceae.jpg",
    radar_signature: "Strong cross-pol (VH) volume backscatter due to dense branching architecture and large emergent canopy diameter."
  },
  fabaceae: {
    family_name: "Fabaceae",
    common_name: "Legume & Rosewood Family",
    representative_taxa: [
      "Dalbergia latifolia (Indian Rosewood / Shisham)",
      "Pterocarpus marsupium (Malabar Kino / Venga)",
      "Xylia xylocarpa (Burma Ironwood)",
      "Albizia lebbeck (Siris)"
    ],
    leaf_morphology: "Pinnately compound with alternate leaflets; pulvinate petiole bases exhibiting nyctinastic (sleep) leaf movement.",
    bark_stem_anatomy: "Rough, vertically peeling fibrous bark; dark purplish-brown heartwood with black striations, rich in natural oils and resins.",
    ecological_keystone_role: "Primary biogeochemical regenerator; symbiotic Bradyrhizobium root nodules fix atmospheric nitrogen directly into impoverished lateritic soils.",
    ethnobotany_timber: "World-renowned luxury tonewood and cabinet timber (rosewood); Malabar Kino yields red astringent gum resin used in anti-diabetic Ayurvedic formulations.",
    conservation_status: "CITES Appendix II listed (Dalbergia latifolia); keystone priority in reforestation and assisted natural regeneration.",
    image_url: "/botany/fabaceae.jpg",
    radar_signature: "High polarimetric ratio (VH/VV) reflecting intricate compound canopy structure and micro-foliar scattering."
  },
  lauraceae: {
    family_name: "Lauraceae",
    common_name: "Laurel & Wild Cinnamon Family",
    representative_taxa: [
      "Cinnamomum malabatrum (Malabar Wild Cinnamon)",
      "Litsea glutinosa (Maida Lakdi)",
      "Neolitsea zeylanica (White Cinnamon)",
      "Actinodaphne hookeri"
    ],
    leaf_morphology: "Sub-opposite or spirally clustered, coriaceous (leathery), strongly aromatic with 3 characteristic primary basal veins running lengthwise.",
    bark_stem_anatomy: "Smooth to finely lenticellate brownish-grey bark containing aromatic secretory oil cells, mucilage canals, and volatile terpenes.",
    ecological_keystone_role: "Strict bioclimatic bioindicator of mature, high-humidity semi-evergreen and shola habitats; fleshy cupulate drupes sustain frugivorous hornbills and imperial pigeons.",
    ethnobotany_timber: "Aromatic volatile oils (eugenol, cinnamaldehyde) used in perfumery and antimicrobial medicine; bark paste utilized for sprains and fracture poultices.",
    conservation_status: "Endemic and sensitive to moisture stress; declines sharply in fragmented secondary forest patches.",
    image_url: "/botany/lauraceae.jpg",
    radar_signature: "Pronounced red-edge chlorophyll signature (NDVIre, B5-B7) and high SWIR absorption from dense evergreen foliar hydration."
  },
  malvaceae: {
    family_name: "Malvaceae",
    common_name: "Mallow & Silk Cotton Family",
    representative_taxa: [
      "Bombax ceiba (Red Silk Cotton Tree / Shalmali)",
      "Sterculia urens (Ghost Tree / Karaya)",
      "Kydia calycina",
      "Helicteres isora (East Indian Screw Tree)"
    ],
    leaf_morphology: "Digitate or palmate compound leaves with 5 to 7 leaflets radiating from a common petiole; stellate (star-shaped) pubescent hairs.",
    bark_stem_anatomy: "Massive fluted buttress roots extending meters outward; young trunks armored with hard conical prickles; soft spongy water-storing wood.",
    ecological_keystone_role: "Vital dry-season nectar resource; produces large cup-shaped crimson flowers during leaf-fall, sustaining dozens of bird, bat, and primate species.",
    ethnobotany_timber: "Woody capsules dehiscence releasing silky water-repellent kapok fibers used in insulation and flotation; Karaya gum harvested commercially.",
    conservation_status: "Least Concern, but monumental buttressed specimens indicate centuries-old undisturbed forest corridors.",
    image_url: "/botany/malvaceae.jpg",
    radar_signature: "High SAR VV/VH multi-path bounce from wide spreading buttresses and massive cylindrical trunks."
  },
  rubiaceae: {
    family_name: "Rubiaceae",
    common_name: "Madder & Kaim Family",
    representative_taxa: [
      "Mitragyna parvifolia (Kaim / Kadamb)",
      "Haldina cordifolia (Haldu)",
      "Ixora brachiata (Gorget)",
      "Morinda coreia (Aal)"
    ],
    leaf_morphology: "Simple, opposite decussate leaf arrangement with prominent, diagnostic interpetiolar stipules enclosing young terminal buds.",
    bark_stem_anatomy: "Greyish-black to scaly bark; timber fine-textured, straight-grained, and yellowish-cream, working smoothly without splintering.",
    ecological_keystone_role: "Dominates riparian corridors and mid-canopy strata; spherical inflorescences provide vital nectar for solitary bees and micro-lepidoptera.",
    ethnobotany_timber: "Haldu and Kaim timber is exceptionally prized for architectural wood carving, textile bobbins, and mathematical instrument fabrication.",
    conservation_status: "Locally common; key stabilization taxon along seasonal riverbanks and moist valley troughs in Kali.",
    image_url: "/botany/rubiaceae.jpg",
    radar_signature: "Balanced SAR depolarization and high optical NIR reflectance from broad horizontal leaf orientation."
  },
  rutaceae: {
    family_name: "Rutaceae",
    common_name: "Citrus & Satinwood Family",
    representative_taxa: [
      "Chloroxylon swietenia (East Indian Satinwood)",
      "Aegle marmelos (Bael / Bilva)",
      "Toddalia asiatica (Orange Climber)",
      "Glycosmis pentaphylla"
    ],
    leaf_morphology: "Gland-dotted, aromatic pinnate or trifoliolate foliage; pellucid translucent essential oil cavities visible when held against light.",
    bark_stem_anatomy: "Thick, deeply furrowed yellowish-corky bark; lustrous golden-yellow satinwood with a shimmering ribbon-grain iridescence.",
    ecological_keystone_role: "Obligate larval host plants for Papilionidae swallowtail butterflies (Lime Butterfly, Common Mormon); adapted to rocky, well-drained slopes.",
    ethnobotany_timber: "Historically one of the most expensive fine decorative cabinet woods in the British colonial era; Bael fruits yield sacred digestive mucilage.",
    conservation_status: "IUCN Vulnerable (Chloroxylon swietenia) due to historical overexploitation for decorative veneer.",
    image_url: "/botany/rutaceae.jpg",
    radar_signature: "Moderate VH backscatter with elevated thermal and dry-matter SWIR-2 reflectance."
  },
  "other family": {
    family_name: "Other family (Mixed Western Ghats Canopy)",
    common_name: "Climax Moist Evergreen & Deciduous Matrix",
    representative_taxa: [
      "Syzygium cumini (Jamun / Myrtaceae)",
      "Dipterocarpus indicus (Dhuma / Dipterocarpaceae)",
      "Artocarpus hirsutus (Wild Jack / Moraceae)",
      "Calophyllum polyanthum (Sirpoon / Clusiaceae)"
    ],
    leaf_morphology: "Complex heterogeneous canopy multi-strata displaying drip-tips, thick waxy cuticles, and diverse phenological leaf flushing.",
    bark_stem_anatomy: "Multi-tier stratification from 45m emergent giants with plank buttresses down to dense understory shrub and epiphyte layers.",
    ecological_keystone_role: "Defines the core structural matrix of the Western Ghats global biodiversity hotspot; protects watershed hydrology for peninsular river basins.",
    ethnobotany_timber: "Encompasses wild edible fruits (Jamun, Wild Jack), sacred groves species, and high-density structural bridge timbers.",
    conservation_status: "Western Ghats UNESCO World Heritage protected habitat; highest regional endemism index.",
    image_url: "/botany/other_family.jpg",
    radar_signature: "Maximum composite radar depolarization (VH/VV) and high Shannon optical spectral entropy."
  },
  mangrove: {
    family_name: "Rhizophoraceae & Avicenniaceae (Tidal Mangrove Complex)",
    common_name: "Sundarbans Tidal Halophyte Forest",
    representative_taxa: [
      "Rhizophora mucronata (Red Mangrove / Garjan)",
      "Heritiera fomes (Sundari Tree)",
      "Avicennia marina (Grey Mangrove / Baen)",
      "Bruguiera gymnorhiza (Kankra)",
      "Ceriops decandra (Goran)"
    ],
    leaf_morphology: "Thick, leathery, succulent leaves equipped with specialized epidermal salt-excreting glands and sunken stomata to minimize transpirational water loss.",
    bark_stem_anatomy: "Extensive stilt aerial prop roots and vertical pencil-like pneumatophores (breathing roots) with hypertrophied lenticels protruding above anoxic tidal mud.",
    ecological_keystone_role: "World's most critical 'Blue Carbon' sink, sequestering up to 4-10x more carbon per hectare than terrestrial forests; acts as an indispensable biophysical storm barrier dampening cyclonic surges.",
    ethnobotany_timber: "Sundari tree timber (Heritiera fomes) yields dense, rot-proof hardwood used in boatbuilding; mangrove flowers sustain wild Sunderban honey harvesting.",
    conservation_status: "UNESCO World Heritage Site & Ramsar Wetland; Heritiera fomes classified as Endangered (IUCN).",
    image_url: "/botany/mangrove.jpg",
    radar_signature: "Distinctive double-bounce radar dihedral reflection (water surface to trunk) yielding intense VV and VH polarimetric response."
  },
  water: {
    family_name: "Tidal Estuarine & Aquatic Channel",
    common_name: "Sundarbans Estuary & Tidal Creeks",
    representative_taxa: [
      "Planktonic Diatoms",
      "Phytoplankton bloom complexes",
      "Submerged seagrass beds"
    ],
    leaf_morphology: "Open hydrodynamic surface water body and intertidal creeks.",
    bark_stem_anatomy: "Non-vegetated aquatic substrate.",
    ecological_keystone_role: "Nursery grounds for 90% of Bay of Bengal marine fisheries; migratory corridor for Irrawaddy dolphins and estuarine crocodiles.",
    ethnobotany_timber: "Artisanal fisheries and mangrove delta transit.",
    conservation_status: "Sundarbans Biosphere Marine Reserve.",
    image_url: "/botany/mangrove.jpg",
    radar_signature: "Specular radar reflection (near total backscatter extinction in calm water) and low NIR absorption."
  },
  "other vegetation": {
    family_name: "Coastal Buffer & Pioneer Scrub",
    common_name: "Non-Mangrove Littoral Fringe",
    representative_taxa: [
      "Nypa fruticans (Mangrove Palm / Golpata)",
      "Phoenix paludosa (Mangrove Date Palm)",
      "Casuarina equisetifolia",
      "Acrostichum aureum (Mangrove Fern)"
    ],
    leaf_morphology: "Mixed littoral scrub, frond palms, and salt-tolerant ferns occupying higher coastal levee banks.",
    bark_stem_anatomy: "Fibrous stems and palm trunks resisting brackish winds.",
    ecological_keystone_role: "Stabilizes coastal embankments above normal high-tide level and provides nesting habitat for kingfishers and raptors.",
    ethnobotany_timber: "Nypa palm leaves widely harvested for traditional thatch roofing; Casuarina used as coastal shelterbelts.",
    conservation_status: "Locally managed coastal buffer zones.",
    image_url: "/botany/mangrove.jpg",
    radar_signature: "Intermediate radar volume scattering with high optical green and NIR reflectance."
  },
  "bare/built": {
    family_name: "Intertidal Mudflat & Coastal Infrastructure",
    common_name: "Alluvial Sandbars & Human Habitation",
    representative_taxa: [
      "Benthic microalgal mats",
      "Halophytic pioneer grasses (Porteresia coarctata)",
      "Anthropogenic settlements & aquaculture dykes"
    ],
    leaf_morphology: "Unvegetated alluvial sediment, earthen cyclone dykes, and shrimp aquaculture ponds.",
    bark_stem_anatomy: "Non-vegetated substrate.",
    ecological_keystone_role: "Mudflats provide indispensable intertidal foraging stopovers for millions of migratory shorebirds on the East Asian-Australasian Flyway.",
    ethnobotany_timber: "Human settlement protection dykes and salt farming.",
    conservation_status: "Coastal Regulation Zone (CRZ-I) strictly monitored.",
    image_url: "/botany/mangrove.jpg",
    radar_signature: "Direct rough-surface Bragg scattering in SAR VV and high visible/SWIR soil reflectance."
  }
};

export function getClientBotanicalProfile(className: string): BotanicalDiagnosticProfile {
  const cleanKey = className.trim().toLowerCase();
  if (BOTANY_CATALOG[cleanKey]) {
    return BOTANY_CATALOG[cleanKey];
  }
  for (const key of Object.keys(BOTANY_CATALOG)) {
    if (key.includes(cleanKey) || cleanKey.includes(key)) {
      return BOTANY_CATALOG[key];
    }
  }
  return BOTANY_CATALOG["other family"];
}
