export interface Animal {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  location: string;
  description: string;
  funFacts: string[];
  conservationStatus: string;
  image: string;
  size: string;
  diet: string;
}

export const categories = [
  {
    id: "deep-sea",
    name: "Deep Sea Creatures",
    description: "Bizarre beings from the ocean's darkest depths",
    color: "from-blue-600 to-indigo-800",
  },
  {
    id: "desert",
    name: "Desert Dwellers",
    description: "Resilient creatures of arid landscapes",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "rainforest",
    name: "Rainforest Rarities",
    description: "Hidden gems of tropical forests",
    color: "from-green-600 to-emerald-700",
  },
  {
    id: "arctic",
    name: "Arctic Oddities",
    description: "Unique adaptations to frozen worlds",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "island",
    name: "Island Endemics",
    description: "Evolved in isolation on remote islands",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "underground",
    name: "Underground Inhabitants",
    description: "Masters of the subterranean world",
    color: "from-amber-600 to-orange-700",
  },
];

export const animals: Animal[] = [
  {
    id: "blobfish",
    name: "Blobfish",
    scientificName: "Psychrolutes marcidus",
    category: "deep-sea",
    habitat: "Deep ocean waters",
    location: "Australia and New Zealand",
    description:
      "The blobfish is a gelatinous mass that lives at depths where the pressure is 60 to 120 times greater than at sea level. Its jelly-like composition allows it to survive in these extreme conditions.",
    funFacts: [
      'Voted "world\'s ugliest animal" in 2013',
      "Looks normal at depth but becomes gelatinous when brought to surface",
      "Has no muscles and moves by floating with ocean currents",
      "Can live up to 130 years",
    ],
    conservationStatus: "Near Threatened",
    image: "https://images.pexels.com/photos/8969226/pexels-photo-8969226.jpeg",
    size: "30 cm (12 inches)",
    diet: "Small crustaceans and organic matter",
  },
  {
    id: "fennec-fox",
    name: "Fennec Fox",
    scientificName: "Vulpes zerda",
    category: "desert",
    habitat: "Sandy deserts",
    location: "North Africa and Sinai Peninsula",
    description:
      "The fennec fox is the smallest fox species, perfectly adapted to desert life with enormous ears that help dissipate heat and locate prey underground.",
    funFacts: [
      "Their ears can be up to 6 inches long",
      "Can survive without free water for long periods",
      "Fur on their feet protects them from hot sand",
      "Lives in underground dens with up to 10 other foxes",
    ],
    conservationStatus: "Least Concern",
    image:
      "https://images.pexels.com/photos/39857/fox-animal-nature-forest-39857.jpeg",
    size: "20-40 cm (8-16 inches)",
    diet: "Insects, small mammals, birds, eggs",
  },
  {
    id: "glass-frog",
    name: "Glass Frog",
    scientificName: "Centrolenidae",
    category: "rainforest",
    habitat: "Tropical rainforest canopy",
    location: "Central and South America",
    description:
      "Glass frogs have translucent skin on their bellies, allowing you to see their internal organs. This unique adaptation may help with camouflage against predators.",
    funFacts: [
      "You can see their heart beating through their skin",
      "Males guard their eggs on leaves above streams",
      "Some species can become nearly invisible when sleeping",
      "Their bones are green, adding to their camouflage",
    ],
    conservationStatus: "Vulnerable",
    image:
      "https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg",
    size: "1.2-7.5 cm (0.5-3 inches)",
    diet: "Small insects and spiders",
  },
  {
    id: "arctic-fox",
    name: "Arctic Fox",
    scientificName: "Vulpes lagopus",
    category: "arctic",
    habitat: "Arctic tundra",
    location: "Arctic regions of North America and Eurasia",
    description:
      "The arctic fox has a remarkable seasonal coat change, turning from brown in summer to pure white in winter. Their fur is so insulating they don't shiver until temperatures drop below -70°C.",
    funFacts: [
      "Changes coat color seasonally for camouflage",
      "Has fur on the soles of their feet for warmth",
      "Can survive temperatures as low as -58°F (-50°C)",
      "Their hearing is so acute they can locate prey under snow",
    ],
    conservationStatus: "Least Concern",
    image: "https://images.pexels.com/photos/459265/pexels-photo-459265.jpeg",
    size: "46-68 cm (18-27 inches)",
    diet: "Lemmings, voles, seabirds, fish",
  },
  {
    id: "kakapo",
    name: "Kakapo",
    scientificName: "Strigops habroptilus",
    category: "island",
    habitat: "Forest floors",
    location: "New Zealand",
    description:
      "The kakapo is the world's only flightless parrot and one of the longest-living birds. These gentle giants can live over 90 years and have a unique musty-sweet smell.",
    funFacts: [
      "World's only flightless parrot",
      "Can live over 90 years",
      "Males create bowl-shaped depressions to attract mates",
      "Only breeds every 2-4 years when rimu fruit is abundant",
    ],
    conservationStatus: "Critically Endangered",
    image: "https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg",
    size: "58-64 cm (23-25 inches)",
    diet: "Fruits, seeds, leaves, bark",
  },
  {
    id: "naked-mole-rat",
    name: "Naked Mole Rat",
    scientificName: "Heterocephalus glaber",
    category: "underground",
    habitat: "Underground burrow systems",
    location: "East Africa (Kenya, Ethiopia, Somalia)",
    description:
      "Naked mole rats are nearly immune to cancer, can survive 18 minutes without oxygen, and live in a eusocial colony structure like bees or ants.",
    funFacts: [
      "Nearly immune to cancer",
      "Can survive 18 minutes without oxygen",
      "Live in colonies with a queen like insects",
      "Can live up to 30 years (extremely long for a rodent)",
    ],
    conservationStatus: "Least Concern",
    image: "https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg",
    size: "8-10 cm (3-4 inches)",
    diet: "Underground tubers and roots",
  },
  {
    id: "vampire-squid",
    name: "Vampire Squid",
    scientificName: "Vampyroteutis infernalis",
    category: "deep-sea",
    habitat: "Deep ocean oxygen minimum zones",
    location: "Deep waters worldwide",
    description:
      "Despite its name, the vampire squid doesn't suck blood. It's a living fossil that can turn itself inside out and survives in areas with almost no oxygen.",
    funFacts: [
      "Can turn itself inside out when threatened",
      "Survives in areas with 3% oxygen levels",
      "Has the largest eyes relative to body size of any animal",
      "Is neither squid nor octopus but in its own order",
    ],
    conservationStatus: "Data Deficient",
    image:
      "https://images.pexels.com/photos/11044651/pexels-photo-11044651.jpeg",
    size: "15-30 cm (6-12 inches)",
    diet: "Marine snow (organic debris)",
  },
  {
    id: "shoebill-stork",
    name: "Shoebill Stork",
    scientificName: "Balaeniceps rex",
    category: "rainforest",
    habitat: "Wetlands and swamps",
    location: "East-central Africa",
    description:
      "The shoebill stork is a prehistoric-looking bird with a massive shoe-shaped bill. They can stand motionless for hours waiting for prey and make machine-gun-like sounds.",
    funFacts: [
      "Can stand motionless for hours without moving",
      "Makes machine-gun-like rattling sounds",
      "Bill can be 24 cm (9.4 inches) long",
      "Often raises only one chick, with siblings competing fiercely",
    ],
    conservationStatus: "Vulnerable",
    image: "https://images.pexels.com/photos/9764302/pexels-photo-9764302.jpeg",
    size: "110-140 cm (3.6-4.6 feet) tall",
    diet: "Fish, frogs, baby crocodiles",
  },
];

export function getAnimalsByCategory(categoryId: string): Animal[] {
  return animals.filter((animal) => animal.category === categoryId);
}

export function getAnimalById(id: string): Animal | undefined {
  return animals.find((animal) => animal.id === id);
}
