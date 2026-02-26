import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Shield } from "lucide-react";
import { type Animal } from "../features/Animal/Animal"; // Adjust the import path as necessary

interface AnimalCardProps {
  animal: Animal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critically endangered":
        return "bg-red-100 text-red-800";
      case "endangered":
        return "bg-orange-100 text-orange-800";
      case "vulnerable":
        return "bg-yellow-100 text-yellow-800";
      case "near threatened":
        return "bg-blue-100 text-blue-800";
      case "least concern":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link
      to={`/animal/${animal.slug}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              animal.conservationStatus
            )}`}
          >
            {animal.conservationStatus}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
              {animal.name}
            </h3>
            <p className="text-sm text-gray-500 italic">
              {animal.scientificName}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {animal.description}
        </p>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{animal.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>{animal.habitat}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Size: {animal.size}</span>
            <span className="text-teal-600 font-medium group-hover:text-teal-700">
              Learn more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
