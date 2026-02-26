export interface Animal {
  slug: string;
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  location: string;
  description: string;
  funFacts: string[];
  conservationStatus:
    | "Least Concern"
    | "Near Threatened"
    | "Vulnerable"
    | "Endangered"
    | "Critically Endangered"
    | "Extinct in the Wild"
    | "Extinct";
  image: string;
  size: string;
  diet: string;
}

// Function to read all animals from JSON files
export function getAllAnimals(): Animal[] {
  const animals: Animal[] = [];

  try {
    // Use Vite's glob import to dynamically load all animal JSON files
    const animalModules = import.meta.glob<{ default: Animal }>(
      "/src/data/animals/*.json",
      { eager: true }
    );

    for (const path in animalModules) {
      const slug =
        path
          .split("/")
          .pop()
          ?.replace(/\.json$/, "") || "";
      const module = animalModules[path];
      animals.push({ ...module.default, slug });
    }

    return animals;
  } catch (error) {
    console.error("Error loading animals:", error);
    return [];
  }
}

// Function to get a random animal from all available animals
export function getRandomAnimal(): Animal | null {
  const animals = getAllAnimals();

  if (animals.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * animals.length);
  return animals[randomIndex];
}

// Function to get all animals that belong to a specific category
export function getAnimalsByCategory(categoryName: string): Animal[] {
  const animals = getAllAnimals();

  return animals.filter(
    (animal) => animal.category.toLowerCase() === categoryName.toLowerCase()
  );
}

// Function to get an animal by its slug
export function getAnimalBySlug(slug: string): Animal | null {
  const animals = getAllAnimals();

  return animals.find((animal) => animal.slug === slug) || null;
}
