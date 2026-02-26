import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AnimalCard from "../components/AnimalCard";
import { getAnimalsByCategory } from "~features/Animal/Animal";
import { getCategoryBySlug } from "~features/AnimalCategory/AnimalCategory";

export default function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return <div>Category not found</div>;
  }

  const category = getCategoryBySlug(categoryId);
  const animals = getAnimalsByCategory(categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  document.title = `${category.name} - Weird Animals`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
        </nav>

        {/* Category Header */}
        <div
          className={`relative rounded-xl overflow-hidden mb-12 bg-gradient-to-br`}
          style={{
            background: `linear-gradient(to bottom right, ${category.color}, #1f2937)`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 px-8 py-16 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {category.description}
            </p>
            <div className="mt-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                {animals.length} {animals.length === 1 ? "species" : "species"}{" "}
                discovered
              </span>
            </div>
          </div>
        </div>

        {/* Animals Grid */}
        {animals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.map((animal) => (
              <AnimalCard key={animal.slug} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No animals found
              </h3>
              <p className="text-gray-600">
                We're still discovering creatures in this category. Check back
                soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
