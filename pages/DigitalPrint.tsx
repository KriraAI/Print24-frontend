import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  FileText,
  Sticker,
  Image,
  Mail,
} from "lucide-react";

// Icon mapping based on category names
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    "Visiting Cards": CreditCard,
    "Flyers & Brochures": FileText,
    "Stickers & Labels": Sticker,
    Banners: Image,
    Invitations: Mail,
  };

  return iconMap[categoryName] || FileText; // Default icon
};

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const DigitalPrint: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL =
          "https://nonprohibitory-katheryn-unbewitched.ngrok-free.dev/api/categories";
        console.log("Fetching from:", API_URL);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true", // IMPORTANT
          },
        });

        const responseText = await response.text();
        console.log("Raw response:", responseText.substring(0, 300));

        // NGROK HTML BLOCKING PAGE DETECTED
        if (
          responseText.trim().startsWith("<!DOCTYPE") ||
          responseText.trim().startsWith("<html")
        ) {
          throw new Error(
            "Ngrok blocked your request and returned an HTML page. Add ngrok-skip-browser-warning header or restart ngrok correctly."
          );
        }

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        // Parse JSON
        if (contentType?.includes("application/json")) {
          const data = JSON.parse(responseText);
          setCategories(data);
          return;
        } else {
          // Try parsing anyway
          try {
            const data = JSON.parse(responseText);
            setCategories(data);
            return;
          } catch {
            throw new Error("Server did not return JSON.");
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              Digital Printing
            </h1>
            <p className="text-cream-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
              Digital Printing
            </h1>
            <p className="text-cream-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-900 mb-4">
            Digital Printing
          </h1>
          <p className="text-cream-600 text-lg max-w-2xl mx-auto">
            Select a category below to browse templates and start customizing
            your print products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.name);
            const isPopular = category.name === "Visiting Cards";

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/digital-print/${category._id}`}>
                  <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-xl font-bold text-cream-900">
                          {category.name}
                        </h3>
                        <IconComponent className="text-cream-400 group-hover:text-cream-800 transition-colors" />
                      </div>
                      <p className="text-cream-600 text-sm mb-6">
                        {category.description}
                      </p>

                      <div className="flex items-center text-cream-900 font-medium text-sm group-hover:text-cream-600 transition-colors">
                        Select Category{" "}
                        <ArrowRight
                          size={16}
                          className="ml-2 transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>

                    {isPopular && (
                      <div className="absolute top-4 right-4 bg-cream-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigitalPrint;
