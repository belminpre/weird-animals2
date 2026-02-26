import React from "react";
import { Link } from "react-router-dom";

import { type AnimalCategory } from "~features/AnimalCategory/AnimalCategory";
import { getAnimalsByCategory } from "~features/Animal/Animal";

interface CategoryCardProps {
  category: AnimalCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const animalCount = getAnimalsByCategory(category.slug).length;

  return (
    <Link to={`/category/${category.slug}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div
          className="h-32 relative flex-shrink-0"
          style={{
            background: `linear-gradient(to bottom right, ${category.color}, #1f2937)`,
          }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="relative z-10 p-6 h-full flex flex-col justify-end">
            <h3 className="text-xl font-bold text-white mb-1">
              {category.name}
            </h3>
            <p className="text-white/90 text-sm">
              {animalCount} {animalCount === 1 ? "species" : "species"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 flex flex-col justify-between flex-grow">
          <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
            {category.description}
          </p>
          <div className="mt-3 text-right">
            <span className="text-teal-600 text-sm font-medium group-hover:text-teal-700">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
