import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Ruler, Utensils, Shield, Info } from "lucide-react";

import { getAnimalBySlug } from "~features/Animal/Animal";
import { getCategoryBySlug } from "~features/AnimalCategory/AnimalCategory";

export default function AnimalDetailPage() {
  const { animalId } = useParams<{ animalId: string }>();

  if (!animalId) {
    return <div>Animal not found</div>;
  }

  const animal = getAnimalBySlug(animalId);

  if (!animal) {
    return <div>Animal not found</div>;
  }

  const category = getCategoryBySlug(animal.category);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critically endangered":
        return "bg-red-100 text-red-800 border-red-200";
      case "endangered":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "vulnerable":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "near threatened":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "least concern":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  document.title = `${animal.name} - Weird Animals`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm">
          <Link to="/categories" className="text-teal-600 hover:text-teal-700">
            Categories
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/category/${category?.slug}`}
            className="text-teal-600 hover:text-teal-700"
          >
            {category?.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{animal.name}</span>
        </nav>

        <Link
          to={`/category/${animal.category}`}
          className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {category?.name}
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {animal.name}
              </h1>
              <p className="text-xl italic text-white/90">
                {animal.scientificName}
              </p>
            </div>
            <div className="absolute top-6 right-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  animal.conservationStatus
                )}`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                {animal.conservationStatus}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="font-semibold text-gray-900">{animal.location}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Ruler className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Size</span>
                </div>
                <p className="font-semibold text-gray-900">{animal.size}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Utensils className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Diet</span>
                </div>
                <p className="font-semibold text-gray-900">{animal.diet}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Habitat</span>
                </div>
                <p className="font-semibold text-gray-900">{animal.habitat}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Animal
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {animal.description}
              </p>
            </div>

            {/* Fun Facts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Amazing Facts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animal.funFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-4 border-l-4 border-teal-500"
                  >
                    <p className="text-gray-800 font-medium">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
