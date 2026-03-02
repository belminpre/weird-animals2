import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/homepage/Homepage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoriesDetailPage";
import AnimalDetailPage from "./pages/AnimalDetailsPage";

function NotFoundPage() {
  React.useEffect(() => {
    let meta = document.querySelector('meta[name="prerender-status-code"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "prerender-status-code");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "404");
    return () => {
      meta.remove();
    };
  }, []);
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
    </main>
  );
}

function App() {
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "/" };
  // Prevent React app from rendering on /admin or any /admin/* path
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/category/:categoryId"
            element={<CategoryDetailPage />}
          />
          <Route path="/animal/:animalId" element={<AnimalDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
