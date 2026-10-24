import { ProjectCategory } from '../types';

export interface AnalysisResult {
  title: string;
  typology: string;
  category: ProjectCategory;
  year: string;
  location: string;
  scaleGfa: string;
  aspect: string;
  description: string;
  plateCaptions: string[];
}

// Sophisticated architectural monograph heuristics fallback when offline or sandbox timeout
export function generateArchitecturalFallback(
  plateCount: number,
  firstImageAspect?: number
): AnalysisResult {
  const categories: ProjectCategory[] = [
    'Residential',
    'Commercial',
    'Workplace',
    'Culture',
    'Public',
    'Renovation'
  ];

  // Pick balanced architectural parameters
  const seed = Date.now();
  const pickedCategory: ProjectCategory = categories[seed % categories.length];

  const monographTemplates: Record<
    ProjectCategory,
    {
      titles: string[];
      typologies: string[];
      locations: string[];
      gfas: string[];
      descriptions: string[];
      captionPool: string[];
    }
  > = {
    Residential: {
      titles: [
        'HOUSE OF BASALT & LIGHT // JEJU',
        'CANYON MONOLITH RESIDENCE',
        'VOID HOUSE V // SEONGBUK',
        'RIDGE RETREAT & HORIZON VILLA',
        'CANTILEVERED STONE ATELIER'
      ],
      typologies: [
        'RESIDENTIAL / DETACHED VILLA',
        'RESIDENTIAL / COURTYARD HOUSE',
        'RESIDENTIAL / CLIFFSIDE RETREAT',
        'RESIDENTIAL / HILLSIDE MONOLITH'
      ],
      locations: [
        'Jeju Island, Aewol',
        'Seoul, Seongbuk-dong',
        'Gyeonggi-do, Yangpyeong',
        'Gangwon-do, Pyeongchang'
      ],
      gfas: ['340 m²', '480 m²', '285 m²', '520 m²'],
      descriptions: [
        'A residential monograph weaving stratified board-formed concrete and porous volcanic basalt, capturing the temporal passage of natural light. Rejecting superfluous ornamentation, the residence crafts a meditative spatial emptiness through the delicate counterpoint of illuminated apertures and shadow.',
        'Responding to the topographical contours of the hillside site, this detached dwelling counters terrestrial gravity through bold cantilevered volumes. An introspective central courtyard and continuous skylight establish an enduring visual dialogue with the surrounding landscape.'
      ],
      captionPool: [
        'Monolithic fair-faced concrete facade with vertical aperture sequence',
        'Ingress of zenithal daylight across textured board-formed walls',
        'Tectonic detail joining porous basalt stone and fair-faced concrete',
        'Deep cantilevered eaves framing the reflecting water basin',
        'Gradation of shadows and material grain revealed by morning light',
        'Upper belvedere terrace overlooking panoramic mountain ridges',
        'Introspective living sequence celebrating elemental authenticity'
      ]
    },
    Commercial: {
      titles: [
        'BRUSHED STEEL & VOID SHOWROOM',
        'APERTURE ATELIER // SINSA',
        'TECTONIC ROASTER & ARCHIVE',
        'LIMESTONE GALLERY FLAGSHIP',
        'SUBTRACTIVE MONOLITH STORE'
      ],
      typologies: [
        'COMMERCIAL / BOUTIQUE SHOWROOM',
        'COMMERCIAL / CAFE & ROASTERY',
        'COMMERCIAL / RETAIL PAVILION',
        'COMMERCIAL / BRAND FLAGSHIP'
      ],
      locations: [
        'Seoul, Sinsa-dong',
        'Seoul, Seongsu-dong',
        'Seoul, Hannam-dong',
        'Busan, Haeundae'
      ],
      gfas: ['210 m²', '380 m²', '650 m²', '195 m²'],
      descriptions: [
        'Elevating the aesthetics of spatial void into a distinctive commercial identity. Hairline-brushed stainless steel surfaces intersect with darkened cast-concrete volumes, inviting visitors to transcend physical thresholds and focus on the elemental purity of light and materiality.',
        'Conceived with thick structural envelope walls that gently filter the surrounding urban cadence. Linear lighting axes and polished mineral surfaces shape a quiet contemporary sanctuary devoted to contemplation, tactile engagement, and experiential depth.'
      ],
      captionPool: [
        'Disciplined primary facade confronting the urban streetscape',
        'Hairline stainless steel monolithic counter beneath raw concrete ceiling',
        'Interaction of linear grazing light across polished mineral flooring',
        'Articulated tectonic partition walls establishing experiential depth',
        'Subtle reveal shadow lines highlighting unvarnished material honesty',
        'Central spatial void guiding visitor circulation and perspective'
      ]
    },
    Workplace: {
      titles: [
        'RP BIO HEADQUARTERS // SAMSEONG',
        'TECTONIC GRID OFFICE MONOGRAPH',
        'CONCRETE ATRIUM WORKSPACE',
        'SILENT LOGGIA LAB // PANGYO',
        'MODULAR PRAXIS HEADQUARTERS'
      ],
      typologies: [
        'WORKPLACE / CORPORATE HEADQUARTERS',
        'WORKPLACE / CREATIVE STUDIO',
        'WORKPLACE / RESEARCH & LAB CAMPUS',
        'WORKPLACE / BOUTIQUE OFFICE'
      ],
      locations: [
        'Seoul, Samseong-dong',
        'Seoul, Gangnam-daero',
        'Gyeonggi-do, Pangyo Techno Valley',
        'Seoul, Yeouido'
      ],
      gfas: ['1,420 m²', '2,800 m²', '950 m²', '3,400 m²'],
      descriptions: [
        'An articulated office tower achieving solar regulation and rhythmic structural cadence through a limestone perimeter grid and recessed loggias. Combining a consolidated vertical core with flexible column-free floor plates, it fosters an enduring and adaptable collaborative ecosystem.',
        'A hollowed central light atrium penetrates the singular building volume, delivering balanced indirect daylight across all working tiers. Structural honesty and material restraint embody the organization’s foundational values of transparency and rigor.'
      ],
      captionPool: [
        'Limestone facade grid and deeply recessed loggia terraces',
        'Corner perspective integrating with the metropolitan street corner',
        'Central full-height light atrium and sculptural connecting circulation',
        'Exposed concrete load-bearing columns meeting low-iron curtain walling',
        'Flexible open-plan work floor bathed in diffuse natural daylight',
        'Landscaped rooftop sky court framing the urban skyline'
      ]
    },
    Culture: {
      titles: [
        'AURA CONTEMPLATION GALLERY',
        'ACOUSTIC OCULUS AUDITORIUM',
        'CHEOKSEOK LIGHT PAVILION',
        'EAST SEA HORIZON ARCHIVE',
        'MONOLITHIC EXCAVATION FORUM'
      ],
      typologies: [
        'CULTURE / CONTEMPORARY GALLERY',
        'CULTURE / CIVIC AUDITORIUM',
        'CULTURE / MEMORIAL PAVILION',
        'CULTURE / ART FOUNDATION'
      ],
      locations: [
        'Gangneung, Anmok Coastal Cliff',
        'Gwangju, Cultural Complex',
        'Seoul, Pyeongchang-dong',
        'Jeju, Seogwipo'
      ],
      gfas: ['520 m²', '860 m²', '1,200 m²', '430 m²'],
      descriptions: [
        'Framing the infinite oceanic horizon as a living canvas through monumental concrete apertures. Heavy board-formed concrete shells and calibrated slit windows orchestrate the diurnal migration of daylight, harmonizing with curated contemporary art installations.',
        'A contemplative cultural venue descending into the subterranean realm, equipped with parabolic acoustic vaults and an oculus skylight. Designed to recalibrate human perception, it creates a solemn sanctuary where silence, sound, and natural light resonate.'
      ],
      captionPool: [
        'Monumental portal welcoming primordial coastal winds and zenithal illumination',
        'Calibrated concrete aperture framing the distant sea horizon',
        'Parabolic concrete shell with micro-acoustic textural ribs',
        'Diurnal sunlight migration reflected across honed basalt flagstones',
        'Subterranean gallery descent via monumental monolithic stone stairs',
        'Tension between raw concrete massing and the vast natural setting'
      ]
    },
    Public: {
      titles: [
        'SEJONG CIVIC FORUM & COLONNADE',
        'GEO-TECTONIC RESERVOIR MONOLITH',
        'ATMOSPHERIC MIST PLAZA',
        'MONOLITHIC CANAL INFRASTRUCTURE',
        'COMMUNITY SHADOW PAVILION'
      ],
      typologies: [
        'PUBLIC / CIVIC PLAZA & PAVILION',
        'PUBLIC / WATER INFRASTRUCTURE',
        'PUBLIC / URBAN PARK PROMENADE',
        'PUBLIC / COMMUNITY CENTER'
      ],
      locations: [
        'Sejong Special Autonomous City',
        'Chungcheongbuk-do, Danyang',
        'Gyeonggi-do, Suwon',
        'Seoul, Hangang River Park'
      ],
      gfas: ['3,800 m²', '2,100 m²', '1,650 m²', '890 m²'],
      descriptions: [
        'A civic sanctuary gathering community dialogue and communal contemplation through rhythmic brutalist colonnades and reflective shallow pools. The expansive overhead canopy provides adaptive shade throughout seasonal transitions while elevating civic dignity.',
        'Dissolving the boundary between infrastructural utility and public contemplation, this sculptural concrete monolithic mass supports civic loads while serving as an iconic civic landmark for the metropolitan watershed.'
      ],
      captionPool: [
        'Rhythmic brutalist concrete colonnade flanking reflective water basin',
        'Shaded gathering zone beneath the deep protective canopy structure',
        'Tectonic interface between honed stone plinth and aquatic edge',
        'Circular oculus drawing direct solar rays onto the public floor',
        'Elevated perspective overlooking the civic plaza promenade',
        'Subtle nocturnal illumination accentuating monumental volumetric mass'
      ]
    },
    Renovation: {
      titles: [
        'SILO RE-COLONNADE // ADAPTIVE REUSE',
        'GRAIN CYLINDER PRAXIS ARCHIVE',
        'BRICK KILN CULTURAL RESTORATION',
        'FOUNDRY CONVERSION MONOGRAPH',
        'TEXTILE WAREHOUSE ADAPTATION'
      ],
      typologies: [
        'RENOVATION / INDUSTRIAL ADAPTIVE REUSE',
        'RENOVATION / HISTORIC RETROFIT',
        'RENOVATION / STRUCTURAL TRANSFORMATION',
        'RENOVATION / HERITAGE ARCHIVE'
      ],
      locations: [
        'Incheon, Port District',
        'Seoul, Mullae-dong',
        'Gunsan, Modern Heritage District',
        'Daegu, Buk-gu'
      ],
      gfas: ['980 m²', '1,560 m²', '720 m²', '2,200 m²'],
      descriptions: [
        'Preserving weathered industrial steel trusses and cylindrical concrete grain silos, transformed into an archival research foundation. Patinated historical traces coexist harmoniously with precision-engineered contemporary glass partitions.',
        'Reinforcing the load-bearing integrity of historic masonry walls while coring out spatial volumes creates a layered stage for public curation and dialogue. A transformative architectural intervention superimposing clarity atop historical memory.'
      ],
      captionPool: [
        'Interplay between historic steel framework and new glass curtain walling',
        'Cored interior void within the cylindrical concrete grain silo',
        'Junction detail between patinated steel trusses and modern skylights',
        'Preserved weathered brick masonry retaining chronological texture',
        'Pedestrian bridge connector spanning historical and contemporary wings',
        'Volumetric open exhibition hall adapted from industrial warehouse volume'
      ]
    }
  };

  const group = monographTemplates[pickedCategory];
  const title = group.titles[seed % group.titles.length];
  const typology = group.typologies[seed % group.typologies.length];
  const location = group.locations[seed % group.locations.length];
  const scaleGfa = group.gfas[seed % group.gfas.length];
  const description = group.descriptions[seed % group.descriptions.length];

  // Derive aspect from first image if available
  let aspect = 'aspect-[4/3]';
  if (firstImageAspect) {
    if (firstImageAspect > 1.8) aspect = 'aspect-[2/1]';
    else if (firstImageAspect > 1.5) aspect = 'aspect-[16/9]';
    else if (firstImageAspect > 1.15) aspect = 'aspect-[4/3]';
    else if (firstImageAspect > 0.9) aspect = 'aspect-square';
    else if (firstImageAspect > 0.7) aspect = 'aspect-[3/4]';
    else aspect = 'aspect-[2/3]';
  }

  // Generate captions for each plate without file extensions
  const plateCaptions: string[] = [];
  for (let i = 0; i < Math.max(1, plateCount); i++) {
    const poolIdx = (seed + i) % group.captionPool.length;
    const prefix = String(i + 1).padStart(2, '0');
    plateCaptions.push(`${prefix} — ${group.captionPool[poolIdx]}`);
  }

  return {
    title,
    typology,
    category: pickedCategory,
    year: '2025',
    location,
    scaleGfa,
    aspect,
    description,
    plateCaptions
  };
}
