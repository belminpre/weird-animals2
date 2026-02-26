import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, BookOpen } from "lucide-react";

import { getAllCategories } from "~features/AnimalCategory/AnimalCategory";
import { getAllAnimals, getRandomAnimal } from "~features/Animal/Animal";
import AnimalCard from "../../components/AnimalCard";
import pageContents from "./index.json";

const categories = getAllCategories();
const animals = getAllAnimals();

export default function HomePage() {
  document.title = "Weird Animals";

  // Get featured animals (first 3)
  const featuredAnimals = animals.slice(0, 3);
  const randomAnimalSlug = getRandomAnimal()?.slug;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover the
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Weirdest Animals
              </span>
              on Earth
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-teal-100">
              {pageContents.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/categories"
                className="inline-flex items-center px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                Explore Categories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              {randomAnimalSlug && (
                <Link
                  to={`/animal/${randomAnimalSlug}`}
                  className="inline-flex items-center px-8 py-3 bg-teal-700/50 text-white rounded-lg font-semibold hover:bg-teal-700/70 transition-colors duration-300 backdrop-blur-sm border border-white/20"
                >
                  <Globe className="mr-2 w-5 h-5" />
                  Random Discovery
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {animals.length}
              </h3>
              <p className="text-gray-600">Unique Species</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {categories.length}
              </h3>
              <p className="text-gray-600">Habitat Categories</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">∞</h3>
              <p className="text-gray-600">Amazing Facts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {pageContents.featuredTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {pageContents.featuredSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredAnimals.map((animal) => (
              <AnimalCard key={animal.slug} animal={animal} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/categories"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              See All Animals
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {pageContents.footerTitle}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {pageContents.footerSubtitle}
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-bold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            Start Exploring
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
