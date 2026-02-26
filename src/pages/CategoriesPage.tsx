import React from "react";
import CategoryCard from "../components/CategoryCard";

import { getAllCategories } from "~features/AnimalCategory/AnimalCategory";

export default function CategoriesPage() {
  const categories = getAllCategories();

  document.title = "Animal Categories - Weird Animals";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Animal Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of weird and wonderful creatures organized by
            their natural habitats
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why These Categories?
            </h2>
            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Each habitat presents unique challenges that have led to
              incredible adaptations. From the crushing depths of the ocean to
              the scorching heat of deserts, these environments have shaped some
              of the most extraordinary creatures on Earth. By organizing
              animals by their habitats, we can better understand how
              environment influences evolution and behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
